import re
from urllib.parse import urlparse

FREE_EMAIL_DOMAINS = {
    "gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "aol.com", 
    "protonmail.com", "zoho.com", "mail.com", "yandex.com", "gmx.com",
    "icloud.com", "fastmail.com", "live.com"
}

def clean_domain(url_or_domain):
    if not url_or_domain:
        return ""
    d = url_or_domain.strip().lower()
    if not d.startswith("http://") and not d.startswith("https://"):
        d = "https://" + d
    try:
        parsed = urlparse(d)
        netloc = parsed.netloc or parsed.path
        # Strip leading www.
        if netloc.startswith("www."):
            netloc = netloc[4:]
        # Remove ports or trailing slash
        netloc = netloc.split(":")[0].split("/")[0]
        return netloc
    except Exception:
        return url_or_domain.strip().lower()

def extract_email_domain(email):
    if not email or "@" not in email:
        return ""
    return email.strip().split("@")[-1].lower()

def verify_structured_job(data):
    """
    Evaluates structured job post attributes:
    - Recruiter Email vs Company Website domain consistency
    - Free email provider used for corporate recruitment
    - Suspicious salary claims (e.g. entry level > $150k or > $3,000/week)
    """
    company = data.get("company", "").strip()
    website = data.get("website", "").strip()
    recruiter_email = data.get("recruiter_email", "").strip()
    salary = data.get("salary", "").strip()
    title = data.get("title", "").strip()
    
    findings = []
    anomaly_score = 0 # 0 to 100
    
    # 1. Recruiter Email Analysis
    if recruiter_email:
        email_domain = extract_email_domain(recruiter_email)
        if email_domain in FREE_EMAIL_DOMAINS:
            findings.append({
                "field": "Recruiter Email",
                "severity": "High",
                "issue": f"Recruiter is using a public consumer email provider ({email_domain}).",
                "recommendation": "Legitimate enterprise recruiters almost always contact via corporate email domains."
            })
            anomaly_score += 40
        elif website:
            web_domain = clean_domain(website)
            if email_domain and web_domain and email_domain != web_domain and not email_domain.endswith("." + web_domain):
                findings.append({
                    "field": "Domain Consistency",
                    "severity": "Medium",
                    "issue": f"Recruiter email domain (@{email_domain}) does not match company domain ({web_domain}).",
                    "recommendation": "Verify if the recruiter is an authorized external recruiting agency or spoofed sender."
                })
                anomaly_score += 25
    
    # 2. Company & Website Check
    if company and not website:
        findings.append({
            "field": "Company Website",
            "severity": "Low",
            "issue": "No official company website provided.",
            "recommendation": "Search the official registry or LinkedIn to verify company existence."
        })
        anomaly_score += 10
        
    # 3. Salary Anomaly Heuristics
    if salary:
        # Check for extreme numbers
        nums = [int(n) for n in re.findall(r'\b\d{2,7}\b', salary.replace(",", ""))]
        title_lower = title.lower() if title else ""
        is_entry = any(k in title_lower for k in ["data entry", "assistant", "entry level", "clerk", "typist", "part time", "no experience"])
        
        for n in nums:
            # Hourly > $100 for entry level, or weekly > $3500 for entry level
            if is_entry and ((n > 3500 and "week" in salary.lower()) or (n > 100 and ("hour" in salary.lower() or "/hr" in salary.lower()))):
                findings.append({
                    "field": "Compensation Realism",
                    "severity": "High",
                    "issue": f"Stated salary ({salary}) is substantially above market standard for '{title or 'this role'}'.",
                    "recommendation": "Scammers use inflated pay to lure candidates into advance-fee or money-mule schemes."
                })
                anomaly_score += 35
                break

    anomaly_score = min(anomaly_score, 100)
    
    return {
        "findings": findings,
        "structured_risk_score": anomaly_score,
        "is_suspicious_domain": any(f["field"] in ["Recruiter Email", "Domain Consistency"] and f["severity"] == "High" for f in findings)
    }
