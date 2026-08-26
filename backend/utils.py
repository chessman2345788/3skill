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


RED_FLAG_PATTERNS = [
    # Financial & Payment Schemes
    {
        "category": "Financial & Payment",
        "severity": "High",
        "patterns": [
            r"\b(wire transfer|bank transfer|crypto|bitcoin|usdt|cashapp|venmo|zelle)\b",
            r"\b(personal bank account|active bank account|provide bank details)\b",
            r"\b(keep \d{1,2}%\s*(commission|cut))\b",
            r"\b(receive payments? and transfer|process(ing)? payments?)\b",
            r"\b(upfront fee|registration fee|starter kit|equipment deposit|check deposit)\b",
            r"\b(unclaimed funds|package handler|re-?ship(ping)?)\b",
        ],
        "explanation": "Requests to transfer money, use personal bank accounts, or pay upfront fees are strong indicators of employment/money mule scams."
    },
    # Unrealistic Compensation & Ease
    {
        "category": "Unrealistic Compensation",
        "severity": "High",
        "patterns": [
            r"\b(earn\s*\$?\d{3,5}\s*(a|per)\s*(week|day|hour)|massive weekly income|high daily pay)\b",
            r"\b(no experience (needed|required)|no qualifications? (needed|required))\b",
            r"\b(easy money|earn fast cash|instant income)\b",
            r"\b(1-2 hours? (of )?free time|work 1 hour a day)\b",
        ],
        "explanation": "Disproportionately high pay promised for minimal hours or zero qualifications is a hallmark tactic of phishing and fake job listings."
    },
    # High-Pressure & Bypassed Screening
    {
        "category": "Bypassed Screening",
        "severity": "Medium",
        "patterns": [
            r"\b(no interview( process)?|start without interview|immediate hire|immediate start!*)\b",
            r"\b(urgently hiring!?|urgent vacancy|apply immediately)\b",
            r"\b(guaranteed job|guaranteed placement|sign-on bonus without screening)\b",
        ],
        "explanation": "Legitimate employers conduct formal interviews and verification. Bypassing interviews completely often signals fraudulent intent."
    },
    # Suspicious Communication Channels
    {
        "category": "Communication Channel",
        "severity": "Medium",
        "patterns": [
            r"\b(contact (us )?on telegram|message (us )?on whatsapp|telegram (@|\b[a-z0-9_]+))\b",
            r"\b([a-zA-Z0-9._%+-]+@(gmail|yahoo|hotmail|outlook|protonmail)\.com)\b",
        ],
        "explanation": "Corporate recruiters typically use verified corporate domains rather than consumer email providers or Telegram/WhatsApp channels."
    }
]

TRUST_MARKERS = [
    r"\b(bachelor'?s degree|master'?s degree|ph\.?d\.?|years of experience)\b",
    r"\b(401\(k\)|health insurance|dental insurance|paid time off|pto|medical benefits)\b",
    r"\b(collaborate with|agile|scrum|cross-functional|responsibilities include)\b",
    r"\b(equal opportunity employer|eoe|background check required)\b"
]


def extract_red_flags(text):
    """
    Extracts matched red-flag phrases and evaluates scam risk indicators from text.
    """
    if not text or not isinstance(text, str):
        return {
            "flags": [],
            "risk_score": 0,
            "category_counts": {},
            "trust_markers_found": []
        }

    flags = []
    category_counts = {}

    for group in RED_FLAG_PATTERNS:
        cat = group["category"]
        severity = group["severity"]
        explanation = group["explanation"]

        for pat in group["patterns"]:
            matches = list(re.finditer(pat, text, re.IGNORECASE))
            for match in matches:
                phrase = match.group(0)
                # Deduplicate similar spans
                if not any(f["phrase"].lower() == phrase.lower() for f in flags):
                    flags.append({
                        "phrase": phrase,
                        "category": cat,
                        "severity": severity,
                        "explanation": explanation,
                        "start": match.start(),
                        "end": match.end()
                    })
                    category_counts[cat] = category_counts.get(cat, 0) + 1

    # Check trust markers
    trust_markers_found = []
    for tm in TRUST_MARKERS:
        matches = list(re.finditer(tm, text, re.IGNORECASE))
        for m in matches:
            phrase = m.group(0)
            if phrase.lower() not in [t.lower() for t in trust_markers_found]:
                trust_markers_found.append(phrase)

    # Sort flags by occurrence in text
    flags.sort(key=lambda x: x["start"])

    return {
        "flags": flags,
        "flag_count": len(flags),
        "category_counts": category_counts,
        "trust_markers_found": trust_markers_found
    }

