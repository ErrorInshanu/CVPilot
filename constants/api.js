export const API_BASE_URL = "https://cvpilot-backend-sxut.onrender.com";

export const ENDPOINTS = {
  signup: `${API_BASE_URL}/api/auth/signup`,
  login:  `${API_BASE_URL}/api/auth/login`,
  me:     `${API_BASE_URL}/api/auth/me`,
  resumes: `${API_BASE_URL}/api/resumes`,
  resume: (id) => `${API_BASE_URL}/api/resumes/${id}`,
};