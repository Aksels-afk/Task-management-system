const config = {
  development: {
    apiBaseUrl: 'http://localhost:8000/api'
  },
  production: {
    apiBaseUrl: 'https://task-management-system-f5dm.onrender.com/api'
  }
};

const environment = import.meta.env.MODE || 'development';
export const apiConfig = config[environment];

export const getApiUrl = (endpoint) => {
  return `${apiConfig.apiBaseUrl}${endpoint}`;
};

export const API_ENDPOINTS = {
  REGISTER: '/register',
  LOGIN: '/login',
  LOGOUT: '/logout',
  USER: '/user',
  TASKS: '/tasks',
  TASK: (id) => `/tasks/${id}`,
  TEST: '/test'
}; 