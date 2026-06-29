import os

class Config:
    """
    Application configuration values.
    Uses environment variables with sensible defaults.
    """
    # Environment config
    DEBUG = os.environ.get("FLASK_DEBUG", "False").lower() in ("true", "1", "t")
    PORT = int(os.environ.get("PORT", 5000))
    HOST = os.environ.get("HOST", "0.0.0.0")
    
    # ML Assets configuration
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    MODEL_PATH = os.environ.get("MODEL_PATH", os.path.join(BASE_DIR, "model.pkl"))
    VECTORIZER_PATH = os.environ.get("VECTORIZER_PATH", os.path.join(BASE_DIR, "vectorizer.pkl"))
