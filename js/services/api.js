// API client for backend communication

const API_BASE_URL = (() => {
  const defaultBackend = 'https://f2x-o81l.onrender.com/api';
  const raw = window.API_BASE_URL || defaultBackend || 'http://localhost:3000/api';
  const trimmed = raw.replace(/\/+$/, '');
  return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
})();

// Get auth token from localStorage
function getToken() {
  return localStorage.getItem('auth_token');
}

// Set auth token
function setToken(token) {
  localStorage.setItem('auth_token', token);
}

// Remove auth token
function removeToken() {
  localStorage.removeItem('auth_token');
}

// Make API request
async function apiRequest(endpoint, options = {}) {
  const token = getToken();
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
}

// Auth API
export const authAPI = {
  async register(email, password, parentEmail, language) {
    const data = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, parentEmail, language })
    });
    if (data.token) {
      setToken(data.token);
    }
    return data;
  },

  async login(email, password) {
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    if (data.token) {
      setToken(data.token);
    }
    return data;
  },

  logout() {
    removeToken();
    window.location.reload();
  },

  isAuthenticated() {
    return !!getToken();
  }
};

// Practice API
export const practiceAPI = {
  async saveSession(sessionData) {
    return apiRequest('/practice/sessions', {
      method: 'POST',
      body: JSON.stringify(sessionData)
    });
  },

  async getHistory(chapterId) {
    const data = await apiRequest(`/practice/history/${chapterId}`);
    return data.sessions;
  },

  async getStats(chapterId) {
    const data = await apiRequest(`/practice/stats/${chapterId}`);
    return data;
  }
};

// Assessment API
export const assessmentAPI = {
  async createSession(chapterId) {
    const data = await apiRequest('/assessments/sessions', {
      method: 'POST',
      body: JSON.stringify({ chapterId })
    });
    return data.session;
  },

  async analyzeWork(sessionId, exerciseIndex, imageBase64, exerciseData, language) {
    const data = await apiRequest('/assessments/analyze', {
      method: 'POST',
      body: JSON.stringify({
        sessionId,
        exerciseIndex,
        imageBase64,
        exerciseData,
        language
      })
    });
    return data.feedback;
  },

  async completeSession(sessionId, assessmentData, language) {
    const data = await apiRequest(`/assessments/sessions/${sessionId}/complete`, {
      method: 'POST',
      body: JSON.stringify({ ...assessmentData, language })
    });
    return data;
  },

  async getHistory(chapterId = null) {
    const endpoint = chapterId 
      ? `/assessments/history?chapterId=${chapterId}`
      : '/assessments/history';
    const data = await apiRequest(endpoint);
    return data.sessions;
  },

  async checkIfDue() {
    const data = await apiRequest('/assessments/due');
    return data;
  }
};

// Recommendations API
export const recommendationsAPI = {
  async get() {
    const data = await apiRequest('/recommendations');
    return data.recommendations || [];
  }
};

// Export default
export default {
  auth: authAPI,
  practice: practiceAPI,
  assessment: assessmentAPI,
  recommendations: recommendationsAPI
};

