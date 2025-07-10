import { API_CONFIG } from '../constants/config.js';
import { createApiResponse, createApiError } from '../types/api.js';

class ApiService {
  constructor() {
    const env = process.env.NODE_ENV || 'development';
    const config = API_CONFIG[env] || API_CONFIG.development;
    
    this.baseURL = config.baseURL;
    this.timeout = config.timeout;
    this.useMockData = config.useMockData;
  }

  async makeRequest(config) {
    const { method, url, data, headers = {}, timeout = this.timeout } = config;

    // Add auth token if available
    const token = await this.getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    headers['Content-Type'] = 'application/json';

    try {
      if (this.useMockData) {
        return await this.mockRequest(method, url, data);
      }

      const response = await fetch(`${this.baseURL}${url}`, {
        method,
        headers,
        body: data ? JSON.stringify(data) : undefined,
        signal: AbortSignal.timeout(timeout),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('API request failed:', error);
      throw this.handleError(error);
    }
  }

  async mockRequest(method, url, data) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 700));

    try {
      // Route to appropriate mock service
      if (url.startsWith('/auth')) {
        const { MockAuthService } = await import('./MockAuthService.js');
        return MockAuthService.handleRequest(method, url, data);
      } else if (url.startsWith('/referrals')) {
        const { MockReferralService } = await import('./MockReferralService.js');
        return MockReferralService.handleRequest(method, url, data);
      } else if (url.startsWith('/notifications')) {
        const { MockNotificationService } = await import('./MockNotificationService.js');
        return MockNotificationService.handleRequest(method, url, data);
      }
    } catch (error) {
      console.error('Mock service error:', error);
    }

    // Default mock response
    return createApiResponse({}, 'Mock response', 200);
  }

  async getAuthToken() {
    // This will be implemented differently for mobile vs web
    if (typeof window !== 'undefined') {
      // Web environment
      return localStorage.getItem('auth_token');
    } else {
      // Mobile environment - will be implemented in platform-specific code
      return null;
    }
  }

  handleError(error) {
    return createApiError(
      error.message || 'An error occurred',
      error.status || 500,
      error.url || '',
      error.response?.data || {}
    );
  }

  // Public methods
  async get(url, headers) {
    return this.makeRequest({ method: 'GET', url, headers });
  }

  async post(url, data, headers) {
    return this.makeRequest({ method: 'POST', url, data, headers });
  }

  async put(url, data, headers) {
    return this.makeRequest({ method: 'PUT', url, data, headers });
  }

  async patch(url, data, headers) {
    return this.makeRequest({ method: 'PATCH', url, data, headers });
  }

  async delete(url, headers) {
    return this.makeRequest({ method: 'DELETE', url, headers });
  }
}

export default new ApiService(); 