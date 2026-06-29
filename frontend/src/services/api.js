import axios from 'axios';

// Resolve environment API URL, fallback to localhost 5000 if not defined
const BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000';

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // 10 second timeout threshold
  headers: {
    'Content-Type': 'application/json',
  }
});

export const apiService = {
  /**
   * Queries GET /health status of backend server.
   */
  async checkHealth() {
    try {
      const response = await apiClient.get('/health');
      return response.data;
    } catch (err) {
      throw this.normalizeError(err);
    }
  },

  /**
   * Queries POST /predict to predict if job is fake/genuine.
   * @param {string} jobDescription 
   */
  async predictJob(jobDescription) {
    try {
      const response = await apiClient.post('/predict', {
        job_description: jobDescription
      });
      return response.data;
    } catch (err) {
      throw this.normalizeError(err);
    }
  },

  /**
   * Standardizes error outputs for front-end toast components.
   */
  normalizeError(err) {
    if (err.response) {
      // Server returned a status code other than 2xx
      return {
        status: err.response.status,
        error: err.response.data?.error || 'Server Error',
        message: err.response.data?.message || 'An error occurred on the API server.'
      };
    } else if (err.request) {
      // Request was sent but no response was received
      return {
        status: 0,
        error: 'Offline',
        message: 'Could not connect to backend server. Make sure Flask is active.'
      };
    } else {
      // Something else broke
      return {
        status: -1,
        error: 'Request Failed',
        message: err.message || 'An unknown network request failure occurred.'
      };
    }
  }
};
