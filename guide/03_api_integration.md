# API Integration Guide

## 🔗 Overview

This guide covers the API integration strategy for the Referral Client App, focusing on seamless transition from mock APIs to Django REST Framework endpoints. The architecture ensures easy swapping between data sources without major code changes.

## 🏗️ Architecture Pattern

### Layered API Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                    React Components                         │
├─────────────────────────────────────────────────────────────┤
│                   Service Layer                             │
├─────────────────────────────────────────────────────────────┤
│                   API Client Layer                          │
├─────────────────────────────────────────────────────────────┤
│                 Data Source Layer                           │
├─────────────────────────────────────────────────────────────┤
│           Mock APIs  ←→  Django REST APIs                   │
└─────────────────────────────────────────────────────────────┘
```

### Configuration-Driven Switching
```javascript
// config/api.js
const API_CONFIG = {
  development: {
    baseURL: 'http://localhost:3000/api', // Mock server
    useMockData: true
  },
  staging: {
    baseURL: 'https://staging-api.company.com/api',
    useMockData: false
  },
  production: {
    baseURL: 'https://api.company.com/api',
    useMockData: false
  }
};
```

## 🔧 Core API Client Implementation

### Base API Client
```javascript
// api/ApiClient.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG } from '../config/api';

class ApiClient {
  constructor() {
    this.client = axios.create({
      baseURL: API_CONFIG.baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      }
    });

    // Request interceptor for auth tokens
    this.client.interceptors.request.use(
      async (config) => {
        const token = await AsyncStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          await this.handleTokenExpiration();
        }
        return Promise.reject(error);
      }
    );
  }

  async handleTokenExpiration() {
    try {
      const refreshToken = await AsyncStorage.getItem('refresh_token');
      if (refreshToken) {
        const response = await this.client.post('/auth/refresh', {
          refresh_token: refreshToken
        });
        
        const newToken = response.data.token;
        await AsyncStorage.setItem('auth_token', newToken);
        
        // Retry the original request
        return this.client.request(error.config);
      }
    } catch (refreshError) {
      // Redirect to login
      await AsyncStorage.removeItem('auth_token');
      await AsyncStorage.removeItem('refresh_token');
      // Navigate to login screen
    }
  }

  // HTTP Methods
  async get(url, config = {}) {
    return this.client.get(url, config);
  }

  async post(url, data = {}, config = {}) {
    return this.client.post(url, data, config);
  }

  async put(url, data = {}, config = {}) {
    return this.client.put(url, data, config);
  }

  async delete(url, config = {}) {
    return this.client.delete(url, config);
  }

  async patch(url, data = {}, config = {}) {
    return this.client.patch(url, data, config);
  }
}

export default new ApiClient();
```

### Data Source Factory
```javascript
// api/DataSourceFactory.js
import { API_CONFIG } from '../config/api';
import MockDataSource from './MockDataSource';
import DjangoDataSource from './DjangoDataSource';

class DataSourceFactory {
  static createDataSource() {
    if (API_CONFIG.useMockData) {
      return new MockDataSource();
    } else {
      return new DjangoDataSource();
    }
  }
}

export default DataSourceFactory;
```

## 🎭 Mock Data Source Implementation

### Mock Data Source
```javascript
// api/MockDataSource.js
import { mockUsers } from '../data/mockUsers';
import { mockReferrals } from '../data/mockReferrals';
import { mockNotifications } from '../data/mockNotifications';

class MockDataSource {
  // Authentication
  async login(email, password) {
    const user = mockUsers.find(u => u.email === email && u.password === password);
    if (!user) {
      throw new Error('Invalid credentials');
    }
    
    return {
      data: {
        user: { id: user.id, email: user.email, name: user.name },
        token: 'mock-jwt-token',
        refreshToken: 'mock-refresh-token'
      }
    };
  }

  async register(userData) {
    const newUser = {
      id: Date.now().toString(),
      ...userData,
      createdAt: new Date().toISOString()
    };
    
    mockUsers.push(newUser);
    
    return {
      data: {
        user: { id: newUser.id, email: newUser.email, name: newUser.name },
        token: 'mock-jwt-token',
        refreshToken: 'mock-refresh-token'
      }
    };
  }

  // User Profile
  async getUserProfile(userId) {
    const user = mockUsers.find(u => u.id === userId);
    if (!user) {
      throw new Error('User not found');
    }
    
    return {
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        country: user.country,
        visaStatus: user.visaStatus
      }
    };
  }

  async updateUserProfile(userId, updateData) {
    const userIndex = mockUsers.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    
    mockUsers[userIndex] = { ...mockUsers[userIndex], ...updateData };
    
    return {
      data: mockUsers[userIndex]
    };
  }

  // Visa Progress
  async getVisaProgress(userId) {
    const user = mockUsers.find(u => u.id === userId);
    return {
      data: {
        currentStage: user?.visaStatus?.currentStage || 'enquiry',
        stages: [
          { id: 'enquiry', name: 'Enquiry', completed: true, completedAt: '2023-01-01' },
          { id: 'detailed_enquiry', name: 'Detailed Enquiry', completed: true, completedAt: '2023-01-05' },
          { id: 'assessment', name: 'Assessment', completed: false, completedAt: null },
          { id: 'application', name: 'Application', completed: false, completedAt: null },
          { id: 'payment', name: 'Payment', completed: false, completedAt: null }
        ]
      }
    };
  }

  // Referrals
  async createReferral(referralData) {
    const newReferral = {
      id: Date.now().toString(),
      ...referralData,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    
    mockReferrals.push(newReferral);
    
    return {
      data: newReferral
    };
  }

  async getUserReferrals(userId) {
    const userReferrals = mockReferrals.filter(r => r.referrerId === userId);
    return {
      data: userReferrals
    };
  }

  // Notifications
  async getUserNotifications(userId) {
    const userNotifications = mockNotifications.filter(n => n.userId === userId);
    return {
      data: userNotifications
    };
  }

  async markNotificationAsRead(notificationId) {
    const notification = mockNotifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
      notification.readAt = new Date().toISOString();
    }
    return {
      data: notification
    };
  }
}

export default MockDataSource;
```

### Mock Data Store
```javascript
// data/mockUsers.js
export const mockUsers = [
  {
    id: '1',
    email: 'john@example.com',
    password: 'password123',
    name: 'John Doe',
    phone: '+1234567890',
    country: 'USA',
    visaStatus: {
      currentStage: 'assessment',
      applicationNumber: 'VIS-2023-001'
    },
    createdAt: '2023-01-01T00:00:00Z'
  }
];

// data/mockReferrals.js
export const mockReferrals = [
  {
    id: '1',
    referrerId: '1',
    referredName: 'Jane Smith',
    referredEmail: 'jane@example.com',
    referredPhone: '+1234567891',
    status: 'completed',
    createdAt: '2023-01-15T00:00:00Z'
  }
];

// data/mockNotifications.js
export const mockNotifications = [
  {
    id: '1',
    userId: '1',
    title: 'Application Status Update',
    message: 'Your visa application has moved to Assessment stage.',
    type: 'status_update',
    read: false,
    createdAt: '2023-01-20T00:00:00Z'
  }
];
```

## 🎯 Django Data Source Implementation

### Django Data Source
```javascript
// api/DjangoDataSource.js
import ApiClient from './ApiClient';

class DjangoDataSource {
  // Authentication
  async login(email, password) {
    return ApiClient.post('/auth/login/', { email, password });
  }

  async register(userData) {
    return ApiClient.post('/auth/register/', userData);
  }

  async refreshToken(refreshToken) {
    return ApiClient.post('/auth/refresh/', { refresh_token: refreshToken });
  }

  // User Profile
  async getUserProfile(userId) {
    return ApiClient.get(`/users/${userId}/profile/`);
  }

  async updateUserProfile(userId, updateData) {
    return ApiClient.patch(`/users/${userId}/profile/`, updateData);
  }

  // Visa Progress
  async getVisaProgress(userId) {
    return ApiClient.get(`/users/${userId}/visa-progress/`);
  }

  // Referrals
  async createReferral(referralData) {
    return ApiClient.post('/referrals/', referralData);
  }

  async getUserReferrals(userId) {
    return ApiClient.get(`/users/${userId}/referrals/`);
  }

  // Notifications
  async getUserNotifications(userId) {
    return ApiClient.get(`/users/${userId}/notifications/`);
  }

  async markNotificationAsRead(notificationId) {
    return ApiClient.patch(`/notifications/${notificationId}/`, { read: true });
  }
}

export default DjangoDataSource;
```

## 🔄 Service Layer Implementation

### User Service
```javascript
// services/UserService.js
import DataSourceFactory from '../api/DataSourceFactory';

class UserService {
  constructor() {
    this.dataSource = DataSourceFactory.createDataSource();
  }

  async login(email, password) {
    try {
      const response = await this.dataSource.login(email, password);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  }

  async register(userData) {
    try {
      const response = await this.dataSource.register(userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  }

  async getProfile(userId) {
    try {
      const response = await this.dataSource.getUserProfile(userId);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch profile');
    }
  }

  async updateProfile(userId, updateData) {
    try {
      const response = await this.dataSource.updateUserProfile(userId, updateData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update profile');
    }
  }

  async getVisaProgress(userId) {
    try {
      const response = await this.dataSource.getVisaProgress(userId);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch visa progress');
    }
  }
}

export default new UserService();
```

### Referral Service
```javascript
// services/ReferralService.js
import DataSourceFactory from '../api/DataSourceFactory';

class ReferralService {
  constructor() {
    this.dataSource = DataSourceFactory.createDataSource();
  }

  async createReferral(referralData) {
    try {
      const response = await this.dataSource.createReferral(referralData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create referral');
    }
  }

  async getUserReferrals(userId) {
    try {
      const response = await this.dataSource.getUserReferrals(userId);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch referrals');
    }
  }
}

export default new ReferralService();
```

## 🔐 Security & Error Handling

### Request Interceptors
```javascript
// api/interceptors.js
import ApiClient from './ApiClient';

// Request logging (development only)
if (__DEV__) {
  ApiClient.interceptors.request.use(
    (config) => {
      console.log('API Request:', config.method.toUpperCase(), config.url);
      return config;
    }
  );
}

// Global error handler
ApiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorMessage = error.response?.data?.message || 'An error occurred';
    const statusCode = error.response?.status;
    
    // Log error (consider using crash reporting service)
    console.error('API Error:', statusCode, errorMessage);
    
    // Handle specific error codes
    switch (statusCode) {
      case 401:
        // Handle unauthorized access
        break;
      case 403:
        // Handle forbidden access
        break;
      case 404:
        // Handle not found
        break;
      case 500:
        // Handle server errors
        break;
      default:
        // Handle other errors
        break;
    }
    
    return Promise.reject(error);
  }
);
```

### Response Validation
```javascript
// utils/responseValidator.js
export const validateResponse = (response, schema) => {
  // Implement response validation logic
  // You can use libraries like Joi or Yup for validation
  return response;
};

// Example usage in service
async getProfile(userId) {
  const response = await this.dataSource.getUserProfile(userId);
  return validateResponse(response.data, userProfileSchema);
}
```

## 🔄 Django Integration Planning

### Phase 1: API Endpoint Mapping
```python
# Django urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'referrals', views.ReferralViewSet)
router.register(r'notifications', views.NotificationViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/auth/', include('auth.urls')),
]
```

### Phase 2: Response Format Standardization
```python
# Django serializers.py
from rest_framework import serializers

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'name', 'phone', 'country']

class VisaProgressSerializer(serializers.Serializer):
    current_stage = serializers.CharField()
    stages = serializers.ListField(child=serializers.DictField())
```

### Phase 3: Migration Checklist
- [ ] Update API base URL in configuration
- [ ] Test all endpoints with real Django server
- [ ] Validate response formats match mock structure
- [ ] Update error handling for Django error responses
- [ ] Test authentication flow end-to-end
- [ ] Validate all CRUD operations
- [ ] Test pagination and filtering
- [ ] Implement proper error logging

## 🧪 Testing Strategy

### Mock Service Testing
```javascript
// __tests__/services/UserService.test.js
import UserService from '../../services/UserService';
import MockDataSource from '../../api/MockDataSource';

// Mock the data source
jest.mock('../../api/DataSourceFactory', () => ({
  createDataSource: () => new MockDataSource()
}));

describe('UserService', () => {
  test('should login successfully', async () => {
    const result = await UserService.login('john@example.com', 'password123');
    expect(result.user.email).toBe('john@example.com');
    expect(result.token).toBeDefined();
  });

  test('should handle login failure', async () => {
    await expect(
      UserService.login('invalid@example.com', 'wrongpassword')
    ).rejects.toThrow('Login failed');
  });
});
```

### Integration Testing
```javascript
// __tests__/integration/api.test.js
import { setupServer } from 'msw/node';
import { rest } from 'msw';
import ApiClient from '../../api/ApiClient';

const server = setupServer(
  rest.post('/api/auth/login/', (req, res, ctx) => {
    return res(ctx.json({ token: 'test-token' }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('API Integration', () => {
  test('should make authenticated requests', async () => {
    const response = await ApiClient.post('/auth/login/', {
      email: 'test@example.com',
      password: 'password'
    });
    
    expect(response.data.token).toBe('test-token');
  });
});
```

## 📊 Performance Optimization

### Caching Strategy
```javascript
// utils/cache.js
class ApiCache {
  constructor(maxSize = 100, ttl = 300000) { // 5 minutes TTL
    this.cache = new Map();
    this.maxSize = maxSize;
    this.ttl = ttl;
  }

  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() - item.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }

  set(key, data) {
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }
}

export default new ApiCache();
```

### Request Deduplication
```javascript
// utils/requestDeduplication.js
class RequestDeduplicator {
  constructor() {
    this.pendingRequests = new Map();
  }

  async deduplicate(key, requestFn) {
    if (this.pendingRequests.has(key)) {
      return this.pendingRequests.get(key);
    }

    const promise = requestFn();
    this.pendingRequests.set(key, promise);

    try {
      const result = await promise;
      this.pendingRequests.delete(key);
      return result;
    } catch (error) {
      this.pendingRequests.delete(key);
      throw error;
    }
  }
}

export default new RequestDeduplicator();
```

This API integration architecture provides a robust foundation for seamless transition from mock to real Django APIs while maintaining clean separation of concerns and excellent error handling. 