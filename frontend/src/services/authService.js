const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const authService = {
  setToken: (token, expiryDays = 30) => {
    const expiryTime = new Date().getTime() + (expiryDays * 24 * 60 * 60 * 1000);
    localStorage.setItem('authToken', token);
    localStorage.setItem('tokenExpiry', expiryTime.toString());
  },

  getToken: () => {
    const token = localStorage.getItem('authToken');
    const expiry = localStorage.getItem('tokenExpiry');
    
    if (!token || !expiry) return null;
    
    if (new Date().getTime() > parseInt(expiry)) {
      authService.logout();
      return null;
    }
    
    return token;
  },

  isAuthenticated: () => {
    return !!authService.getToken();
  },

  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  setUser: (user) => {
    localStorage.setItem('user', JSON.stringify(user));
  },

  login: async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/login-simple`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Login failed');
      }
      
      const data = await response.json();
      
      if (data.success && data.token) {
        authService.setToken(data.token, 30);
        authService.setUser(data.user);
      }
      
      return data;
    } catch (error) {
      throw error;
    }
  },

  register: async (email, password, name, phone) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/register-simple`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name, phone })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Registration failed');
      }
      
      const data = await response.json();
      
      if (data.success && data.token) {
        authService.setToken(data.token, 30);
        authService.setUser(data.user);
      }
      
      return data;
    } catch (error) {
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('tokenExpiry');
    localStorage.removeItem('user');
  },

  refreshSession: () => {
    const token = authService.getToken();
    if (token) {
      authService.setToken(token, 30);
      return true;
    }
    return false;
  },

  getSessionTimeRemaining: () => {
    const expiry = localStorage.getItem('tokenExpiry');
    if (!expiry) return 0;
    
    const remaining = parseInt(expiry) - new Date().getTime();
    return Math.max(0, Math.floor(remaining / (60 * 1000)));
  },

  healthCheck: async () => {
    try {
      const response = await fetch(`${API_URL}/api/health`);
      return await response.json();
    } catch (error) {
      throw error;
    }
  }
};

export default authService;
