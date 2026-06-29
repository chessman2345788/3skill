from flask import Flask, request, jsonify
from flask_cors import CORS
import traceback

try:
    from backend.config import Config
    from backend.predict import predict_job, ModelAssetLoader
except ImportError:
    from config import Config
    from predict import predict_job, ModelAssetLoader

app = Flask(__name__)

# Enable Cross-Origin Resource Sharing (CORS) so React can communicate with it
CORS(app)

# Load Configurations
app.config.from_object(Config)

# Constants
MAX_JOB_DESC_LENGTH = 100000  # Character limit to protect memory limits

@app.route("/", methods=["GET"])
def index():
    """
    Returns API details and current status.
    """
    return jsonify({
        "name": "Fake Job Posting Detection API",
        "version": "1.0.0",
        "description": "An AI-powered REST API that uses machine learning to detect fraudulent job postings.",
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
    Analyzes job description and outputs prediction, confidence, probability, risk level.
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

if __name__ == "__main__":
    app.run(host=Config.HOST, port=Config.PORT, debug=Config.DEBUG)
