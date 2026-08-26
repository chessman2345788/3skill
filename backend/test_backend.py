import unittest
import json
from app import app

class BackendApiTestCase(unittest.TestCase):
    def setUp(self):
        self.client = app.test_client()

    def test_health(self):
        res = self.client.get('/health')
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertEqual(data["status"], "healthy")
        self.assertTrue(data["model_loaded"])

    def test_predict_explainable(self):
        payload = {
            "job_description": "Urgently hiring! Work from home part-time. Earn $5000 a week. No experience needed. Immediate start! Keep 10% commission on bank transfers. Contact us on telegram @scamjob"
        }
        res = self.client.post('/predict', data=json.dumps(payload), content_type='application/json')
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertEqual(data["prediction"], "Fake Job")
        self.assertGreater(len(data["red_flags"]), 0)
        self.assertIn("Financial & Payment", data["category_counts"])
        self.assertIn("contributing_keywords", data)

    def test_predict_structured(self):
        payload = {
            "title": "Data Entry Assistant",
            "company": "Amazon Inc",
            "website": "amazon.com",
            "recruiter_email": "hr-recruiting@gmail.com",
            "salary": "$4,500/week",
            "job_description": "Work from home data entry clerk. High pay, salary paid daily."
        }
        res = self.client.post('/predict/structured', data=json.dumps(payload), content_type='application/json')
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertGreater(len(data["structured_findings"]), 0)
        self.assertGreater(data["structured_risk_score"], 0)

    def test_predict_batch(self):
        payload = {
            "jobs": [
                {"id": 1, "title": "Software Engineer", "company": "TechCorp", "description": "Senior Software Engineer with React and Node.js experience in Chicago."},
                {"id": 2, "title": "Cash Handler", "company": "Global Cash", "description": "Earn $5000 a week processing wire transfers from home. No experience needed."}
            ]
        }
        res = self.client.post('/predict/batch', data=json.dumps(payload), content_type='application/json')
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertEqual(data["total_jobs"], 2)
        self.assertEqual(data["summary"]["fake_count"], 1)
        self.assertEqual(data["summary"]["genuine_count"], 1)

if __name__ == '__main__':
    unittest.main()
