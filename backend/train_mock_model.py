import os
import re
import string
import pickle
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression

# Define raw mock dataset for training (0 = Genuine, 1 = Fake)
DATA = [
    # Genuine jobs
    ("We are seeking a Software Engineer with 3+ years of experience in React and Node.js. Join our team in Chicago.", 0),
    ("Senior Data Scientist position at TechCorp. Requirements: PhD or MS in CS, experience with Python, TensorFlow.", 0),
    ("Looking for a Product Manager to lead our growth team. Must have experience launching SaaS products.", 0),
    ("Frontend Developer vacancy in Austin, TX. Proficient in HTML, CSS, JavaScript, and Tailwind.", 0),
    ("Human Resources Coordinator needed for a full-time role at a healthcare company. 2 years experience required.", 0),
    ("Marketing Associate responsible for running social media campaigns and tracking analytics in our Boston office.", 0),
    ("Financial Analyst to assist with budgeting, forecasting, and reporting. Degree in Finance required.", 0),
    
    # Fake / Scam jobs
    ("Urgently hiring! Work from home part-time. Earn $5000 a week. No experience needed. Immediate start!", 1),
    ("Easy money! Cash processing assistant. Just receive payments and transfer them. Keep 10% commission.", 1),
    ("Earn money processing bank transfers from home. No qualifications required. Must have active bank account.", 1),
    ("Unclaimed funds department needs a data entry clerk. Work from home, high pay, salary paid daily.", 1),
    ("Work at home package handler. Earn massive weekly income. All you do is receive and re-ship packages.", 1),
    ("Immediate start vacancy. Customer service representative. High salary, sign-on bonus, no interview.", 1),
    ("Financial assistant required to handle crypto transfers. High commission, daily payouts, start today.", 1),
]

def clean_text(text):
    """
    Cleans raw text data using standard preprocessing rules.
    Converts to lowercase, removes HTML, URLs, punctuation, numbers, and extra spaces.
    """
    if not text:
        return ""
    # Convert to lowercase
    text = text.lower()
    # Remove HTML tags
    text = re.sub(r'<[^>]*>', ' ', text)
    # Remove URLs
    text = re.sub(r'https?://\S+|www\.\S+', ' ', text)
    # Remove punctuation
    text = text.translate(str.maketrans('', '', string.punctuation))
    # Remove numbers
    text = re.sub(r'\d+', ' ', text)
    # Remove extra whitespaces
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def train_and_save():
    print("Pre-processing training data...")
    cleaned_texts = [clean_text(text) for text, label in DATA]
    labels = [label for text, label in DATA]
    
    print("Fitting TfidfVectorizer...")
    vectorizer = TfidfVectorizer(max_features=1000)
    X = vectorizer.fit_transform(cleaned_texts)
    
    print("Training LogisticRegression model...")
    model = LogisticRegression(C=1.0)
    model.fit(X, labels)
    
    # Ensure backend directory exists (should be current directory or parent)
    backend_dir = os.path.dirname(os.path.abspath(__file__))
    
    model_path = os.path.join(backend_dir, "model.pkl")
    vectorizer_path = os.path.join(backend_dir, "vectorizer.pkl")
    
    print(f"Saving model to {model_path}...")
    with open(model_path, "wb") as f:
        pickle.dump(model, f)
        
    print(f"Saving vectorizer to {vectorizer_path}...")
    with open(vectorizer_path, "wb") as f:
        pickle.dump(vectorizer, f)
        
    print("Training complete! Model and Vectorizer saved successfully.")

if __name__ == "__main__":
    train_and_save()
