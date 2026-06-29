import re
import string

def clean_text(text):
    """
    Cleans raw job description text. Replicates the NLP pipeline:
    1. Lowercase conversions
    2. HTML tag removal
    3. URL removal
    4. Punctuation removal
    5. Number removal
    6. Extra whitespace removal
    """
    if not text or not isinstance(text, str):
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
    
    # Remove extra spaces, tabs, and newlines
    text = re.sub(r'\s+', ' ', text).strip()
    
    return text
