from flask import Flask, request, jsonify
from flask_cors import CORS
import traceback

try:
    from backend.config import Config
    from backend.predict import predict_job, ModelAssetLoader
    from backend.domain_verifier import verify_structured_job
except ImportError:
    from config import Config
    from predict import predict_job, ModelAssetLoader
    from domain_verifier import verify_structured_job

app = Flask(__name__)

# Enable Cross-Origin Resource Sharing (CORS) so React can communicate with it
CORS(app)

# Load Configurations
app.config.from_object(Config)

# Constants
MAX_JOB_DESC_LENGTH = 100000  # Character limit to protect memory limits
MAX_BATCH_SIZE = 200          # Maximum items per batch request

@app.route("/", methods=["GET"])
def index():
    """
    Returns API details and current status.
    """
    return jsonify({
        "name": "Fake Job Posting Detection API",
        "version": "2.0.0",
        "description": "An AI-powered REST API that uses machine learning and Explainable AI to detect fraudulent job postings.",
        "features": ["single_prediction", "explainable_ai", "structured_verification", "batch_processing"],
        "status": "active"
    }), 200

@app.route("/health", methods=["GET"])
def health():
    """
    Serves as health check endpoint.
    Attempts to fetch model/vectorizer cache to check system integrity.
    """
    try:
        model, vectorizer = ModelAssetLoader.get_assets()
        return jsonify({
            "status": "healthy",
            "model_loaded": model is not None and vectorizer is not None
        }), 200
    except Exception as e:
        return jsonify({
            "status": "unhealthy",
            "error": str(e)
        }), 500

@app.route("/predict", methods=["POST"])
def predict():
    """
    Analyzes job description and outputs prediction, confidence, probability, risk level, and XAI red flags.
    Payload: { "job_description": "..." }
    """
    try:
        # 1. Validate payload is JSON
        if not request.is_json:
            return jsonify({
                "error": "Bad Request",
                "message": "Request content-type must be application/json."
            }), 400
            
        data = request.get_json()
        
        # 2. Check for missing key
        if "job_description" not in data:
            return jsonify({
                "error": "Bad Request",
                "message": "Missing 'job_description' key in JSON request body."
            }), 400
            
        job_desc = data["job_description"]
        
        # 3. Check for correct data type
        if not isinstance(job_desc, str):
            return jsonify({
                "error": "Bad Request",
                "message": "'job_description' must be a string."
            }), 400
            
        # 4. Check for empty string input
        if not job_desc.strip():
            return jsonify({
                "error": "Bad Request",
                "message": "'job_description' cannot be empty or contain only whitespace."
            }), 400
            
        # 5. Check characters length constraint
        if len(job_desc) > MAX_JOB_DESC_LENGTH:
            return jsonify({
                "error": "Bad Request",
                "message": f"Job description exceeds character limit of {MAX_JOB_DESC_LENGTH}."
            }), 400
            
        # Predict
        result = predict_job(job_desc)
        return jsonify(result), 200
        
    except FileNotFoundError as fnf_err:
        app.logger.error(f"Asset load fail: {str(fnf_err)}")
        return jsonify({
            "error": "Service Unavailable",
            "message": "The machine learning model or vectorizer is not loaded on this server."
        }), 503
        
    except Exception as e:
        app.logger.error(f"Error during prediction: {str(e)}\n{traceback.format_exc()}")
        return jsonify({
            "error": "Internal Server Error",
            "message": "An unexpected error occurred during prediction analysis."
        }), 500

@app.route("/predict/structured", methods=["POST"])
def predict_structured():
    """
    Evaluates a structured job post with company metadata, recruiter email, and compensation checks.
    Payload: { "title": "...", "company": "...", "website": "...", "recruiter_email": "...", "salary": "...", "job_description": "..." }
    """
    try:
        if not request.is_json:
            return jsonify({"error": "Bad Request", "message": "Content-Type must be application/json"}), 400
            
        data = request.get_json()
        job_desc = data.get("job_description", "").strip()
        
        if not job_desc:
            return jsonify({"error": "Bad Request", "message": "Missing 'job_description' string."}), 400
            
        # Run ML NLP text prediction
        nlp_result = predict_job(job_desc)
        
        # Run structured domain and email verification
        structured_audit = verify_structured_job(data)
        
        # Calculate composite risk
        composite_score = nlp_result["confidence"] if nlp_result["prediction"] == "Fake Job" else (100 - nlp_result["confidence"])
        if structured_audit["structured_risk_score"] > 0:
            # Weighted average: 65% NLP model, 35% structured red flags
            adjusted_fake_prob = (composite_score * 0.65) + (structured_audit["structured_risk_score"] * 0.35)
        else:
            adjusted_fake_prob = composite_score
            
        overall_prediction = "Fake Job" if adjusted_fake_prob >= 50.0 else "Genuine Job"
        overall_confidence = round(adjusted_fake_prob if overall_prediction == "Fake Job" else (100 - adjusted_fake_prob), 2)
        
        if overall_prediction == "Fake Job":
            if overall_confidence >= 80.0:
                overall_risk = "High"
            elif overall_confidence >= 55.0:
                overall_risk = "Medium"
            else:
                overall_risk = "Low"
        else:
            overall_risk = "Low"
            
        return jsonify({
            "prediction": overall_prediction,
            "confidence": overall_confidence,
            "risk_level": overall_risk,
            "processing_time": nlp_result["processing_time"],
            "nlp_analysis": nlp_result,
            "structured_findings": structured_audit["findings"],
            "structured_risk_score": structured_audit["structured_risk_score"],
            "red_flags": nlp_result.get("red_flags", []),
            "trust_markers": nlp_result.get("trust_markers", []),
            "contributing_keywords": nlp_result.get("contributing_keywords", [])
        }), 200
        
    except Exception as e:
        app.logger.error(f"Error in predict_structured: {str(e)}\n{traceback.format_exc()}")
        return jsonify({"error": "Internal Server Error", "message": str(e)}), 500

@app.route("/predict/batch", methods=["POST"])
def predict_batch():
    """
    Evaluates an array of job postings.
    Payload: { "jobs": [ { "id": "1", "title": "...", "description": "..." }, ... ] }
    """
    try:
        if not request.is_json:
            return jsonify({"error": "Bad Request", "message": "Content-Type must be application/json"}), 400
            
        data = request.get_json()
        jobs = data.get("jobs", [])
        
        if not isinstance(jobs, list) or len(jobs) == 0:
            return jsonify({"error": "Bad Request", "message": "'jobs' must be a non-empty list."}), 400
            
        if len(jobs) > MAX_BATCH_SIZE:
            return jsonify({"error": "Bad Request", "message": f"Batch size cannot exceed {MAX_BATCH_SIZE} items."}), 400
            
        results = []
        fake_count = 0
        genuine_count = 0
        high_risk_count = 0
        
        for idx, item in enumerate(jobs):
            desc = item.get("description", "") or item.get("job_description", "")
            title = item.get("title", f"Job #{idx+1}")
            company = item.get("company", "N/A")
            
            if not desc.strip():
                continue
                
            res = predict_job(desc)
            if res["prediction"] == "Fake Job":
                fake_count += 1
            else:
                genuine_count += 1
                
            if res["risk_level"] == "High":
                high_risk_count += 1
                
            results.append({
                "id": item.get("id", idx + 1),
                "title": title,
                "company": company,
                "prediction": res["prediction"],
                "confidence": res["confidence"],
                "risk_level": res["risk_level"],
                "flag_count": len(res.get("red_flags", [])),
                "processing_time": res["processing_time"]
            })
            
        total_processed = len(results)
        
        return jsonify({
            "total_jobs": total_processed,
            "summary": {
                "fake_count": fake_count,
                "genuine_count": genuine_count,
                "fake_percentage": round((fake_count / total_processed * 100) if total_processed else 0, 1),
                "high_risk_count": high_risk_count
            },
            "results": results
        }), 200
        
    except Exception as e:
        app.logger.error(f"Error in predict_batch: {str(e)}\n{traceback.format_exc()}")
        return jsonify({"error": "Internal Server Error", "message": str(e)}), 500

if __name__ == "__main__":
    app.run(host=Config.HOST, port=Config.PORT, debug=Config.DEBUG)

