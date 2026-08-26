import time
import pickle
import os

try:
    from backend.config import Config
    from backend.utils import clean_text, extract_red_flags
except ImportError:
    from config import Config
    from utils import clean_text, extract_red_flags

class ModelAssetLoader:
    """
    Ensures model and vectorizer are cached in memory after first load.
    """
    _model = None
    _vectorizer = None

    @classmethod
    def get_assets(cls):
        if cls._model is None:
            model_path = Config.MODEL_PATH
            if not os.path.exists(model_path):
                raise FileNotFoundError(f"Model file not found at {model_path}. Please train a model first.")
            with open(model_path, "rb") as f:
                cls._model = pickle.load(f)
                
        if cls._vectorizer is None:
            vectorizer_path = Config.VECTORIZER_PATH
            if not os.path.exists(vectorizer_path):
                raise FileNotFoundError(f"Vectorizer file not found at {vectorizer_path}. Please train a vectorizer first.")
            with open(vectorizer_path, "rb") as f:
                cls._vectorizer = pickle.load(f)
                
        return cls._model, cls._vectorizer

def predict_job(job_description):
    """
    Cleans raw description, vectorizes text, runs inference, extracts XAI indicators, and returns prediction details.
    """
    start_time = time.perf_counter()
    
    if not job_description or not isinstance(job_description, str):
        return {
            "prediction": "Genuine Job",
            "confidence": 100.0,
            "probability": [1.0, 0.0],
            "risk_level": "Low",
            "processing_time": "0.0000 sec",
            "red_flags": [],
            "contributing_keywords": [],
            "category_counts": {},
            "trust_markers": []
        }
        
    # Clean the input text
    cleaned_text = clean_text(job_description)
    
    # Load model assets
    model, vectorizer = ModelAssetLoader.get_assets()
    
    # Vectorize text
    vectorized_text = vectorizer.transform([cleaned_text])
    
    # Make prediction and compute probabilities
    probs = model.predict_proba(vectorized_text)[0]  # [prob_genuine, prob_fake]
    prediction_class = model.predict(vectorized_text)[0]  # 0 or 1
    
    p_genuine = float(probs[0])
    p_fake = float(probs[1])
    
    # Setup response parameters
    prediction_label = "Fake Job" if prediction_class == 1 else "Genuine Job"
    
    # Confidence is the probability of the predicted class
    confidence = p_fake if prediction_class == 1 else p_genuine
    confidence_percentage = round(confidence * 100, 2)
    
    # Categorize Risk level
    if prediction_class == 1:
        if confidence_percentage >= 85.0:
            risk_level = "High"
        elif confidence_percentage >= 60.0:
            risk_level = "Medium"
        else:
            risk_level = "Low"
    else:
        risk_level = "Low"

    # Extract Red-Flag Phrases & Trust Markers (Explainable AI)
    red_flag_data = extract_red_flags(job_description)

    # Extract Top Contributing Tokens from TF-IDF + Logistic Regression Weights
    contributing_keywords = []
    try:
        if hasattr(vectorizer, 'get_feature_names_out') and hasattr(model, 'coef_'):
            feature_names = vectorizer.get_feature_names_out()
            coefs = model.coef_[0]
            nonzeros = vectorized_text.nonzero()[1]
            
            token_scores = []
            for idx in nonzeros:
                term = feature_names[idx]
                tfidf_val = vectorized_text[0, idx]
                weight = coefs[idx]
                score = tfidf_val * weight
                token_scores.append({
                    "term": term,
                    "score": round(float(score), 4),
                    "impact": "fake" if score > 0 else "genuine"
                })
            
            # Sort by absolute score impact
            token_scores.sort(key=lambda x: abs(x["score"]), reverse=True)
            contributing_keywords = token_scores[:10]
    except Exception:
        contributing_keywords = []
        
    end_time = time.perf_counter()
    processing_time = f"{end_time - start_time:.4f} sec"
    
    return {
        "prediction": prediction_label,
        "confidence": confidence_percentage,
        "probability": [round(p_genuine, 4), round(p_fake, 4)],
        "risk_level": risk_level,
        "processing_time": processing_time,
        "red_flags": red_flag_data.get("flags", []),
        "flag_count": red_flag_data.get("flag_count", 0),
        "category_counts": red_flag_data.get("category_counts", {}),
        "trust_markers": red_flag_data.get("trust_markers_found", []),
        "contributing_keywords": contributing_keywords
    }

