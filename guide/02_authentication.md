# Authentication System

## 🔐 Overview

The authentication system provides secure user registration, login, and session management for the Referral Client App. It's designed to work with mock APIs initially and seamlessly transition to Django-based authentication later.

## 🏗️ Architecture

### Current Implementation (Mock APIs)
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│                 │    │                 │    │                 │
│   Client App    │───▶│   Mock Auth     │───▶│   Local JWT     │
│                 │    │   Service       │    │   Storage       │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Future Implementation (Django Integration)
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│                 │    │                 │    │                 │
│   Client App    │───▶│  Django Auth    │───▶│   Django User   │
│                 │    │   Endpoints     │    │   Database      │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🔑 JWT Implementation

### Token Structure
```json
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "user_id": "12345",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "client",
    "exp": 1640995200,
    "iat": 1640908800
  },
  "signature": "..."
}
```

### Token Management
- **Access Token**: Short-lived (15 minutes)
- **Refresh Token**: Long-lived (7 days)
- **Storage**: Secure storage (Keychain/AsyncStorage)
- **Automatic Refresh**: Handle token expiration seamlessly

## 🔄 Authentication Flow

### Registration Flow
```
1. User fills registration form
2. Client validates input
3. API call to /auth/register
4. Server creates user account
5. Return JWT tokens
6. Store tokens securely
7. Navigate to dashboard
```

### Login Flow
```
1. User enters credentials
2. Client validates input
3. API call to /auth/login
4. Server validates credentials
5. Return JWT tokens
6. Store tokens securely
7. Navigate to dashboard
```

### Token Refresh Flow
```
1. Access token expires
2. Automatic refresh attempt
3. Use refresh token
4. Get new access token
5. Update stored tokens
6. Retry original request
```

## 📱 Implementation Code Examples

### Auth Context (Shared)
```javascript
// auth/AuthContext.js
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authReducer, initialState } from './authReducer';
import AuthService from './AuthService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    // Check for stored tokens on app start
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const token = await AuthService.getStoredToken();
      if (token && !AuthService.isTokenExpired(token)) {
        const user = AuthService.getUserFromToken(token);
        dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token } });
      }
    } catch (error) {
      dispatch({ type: 'LOGOUT' });
    }
  };

  const login = async (email, password) => {
    dispatch({ type: 'LOGIN_REQUEST' });
    try {
      const response = await AuthService.login(email, password);
      const { user, token, refreshToken } = response.data;
      
      await AuthService.storeTokens(token, refreshToken);
      dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token } });
      
      return response;
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE', payload: error.message });
      throw error;
    }
  };

  const register = async (userData) => {
    dispatch({ type: 'REGISTER_REQUEST' });
    try {
      const response = await AuthService.register(userData);
      const { user, token, refreshToken } = response.data;
      
      await AuthService.storeTokens(token, refreshToken);
      dispatch({ type: 'REGISTER_SUCCESS', payload: { user, token } });
      
      return response;
    } catch (error) {
      dispatch({ type: 'REGISTER_FAILURE', payload: error.message });
      throw error;
    }
  };

  const logout = async () => {
    await AuthService.removeTokens();
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider value={{ 
      ...state, 
      login, 
      register, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
```

### Auth Service (API Layer)
```javascript
// auth/AuthService.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from 'jwt-decode';
import ApiService from '../api/ApiService';

class AuthService {
  static TOKEN_KEY = 'auth_token';
  static REFRESH_TOKEN_KEY = 'refresh_token';

  // Authentication API calls
  static async login(email, password) {
    return ApiService.post('/auth/login', { email, password });
  }

  static async register(userData) {
    return ApiService.post('/auth/register', userData);
  }

  static async refreshToken() {
    const refreshToken = await this.getStoredRefreshToken();
    return ApiService.post('/auth/refresh', { refresh_token: refreshToken });
  }

  static async forgotPassword(email) {
    return ApiService.post('/auth/forgot-password', { email });
  }

  static async resetPassword(token, newPassword) {
    return ApiService.post('/auth/reset-password', { token, password: newPassword });
  }

  // Token management
  static async storeTokens(token, refreshToken) {
    await AsyncStorage.setItem(this.TOKEN_KEY, token);
    await AsyncStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
  }

  static async getStoredToken() {
    return AsyncStorage.getItem(this.TOKEN_KEY);
  }

  static async getStoredRefreshToken() {
    return AsyncStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  static async removeTokens() {
    await AsyncStorage.removeItem(this.TOKEN_KEY);
    await AsyncStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }

  // Token validation
  static isTokenExpired(token) {
    try {
      const decoded = jwt_decode(token);
      return decoded.exp < Date.now() / 1000;
    } catch (error) {
      return true;
    }
  }

  static getUserFromToken(token) {
    try {
      const decoded = jwt_decode(token);
      return {
        id: decoded.user_id,
        email: decoded.email,
        name: decoded.name,
        role: decoded.role
      };
    } catch (error) {
      return null;
    }
  }
}

export default AuthService;
```

### Auth Reducer
```javascript
// auth/authReducer.js
export const initialState = {
  user: null,
  token: null,
  isLoading: false,
  isAuthenticated: false,
  error: null
};

export const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_REQUEST':
    case 'REGISTER_REQUEST':
      return {
        ...state,
        isLoading: true,
        error: null
      };

    case 'LOGIN_SUCCESS':
    case 'REGISTER_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        error: null
      };

    case 'LOGIN_FAILURE':
    case 'REGISTER_FAILURE':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        token: null,
        error: action.payload
      };

    case 'LOGOUT':
      return {
        ...initialState
      };

    default:
      return state;
  }
};
```

## 🚀 Mock API Implementation

### Mock Authentication Endpoints
```javascript
// api/mockAuthAPI.js
import jwt from 'jsonwebtoken';

const MOCK_USERS = [
  {
    id: '1',
    email: 'john@example.com',
    password: 'password123',
    name: 'John Doe',
    role: 'client'
  }
];

const JWT_SECRET = 'your-secret-key';

export const mockAuthAPI = {
  login: async (email, password) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user = MOCK_USERS.find(u => u.email === email && u.password === password);
    
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign(
      { 
        user_id: user.id, 
        email: user.email, 
        name: user.name, 
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { user_id: user.id },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return {
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        },
        token,
        refreshToken
      }
    };
  },

  register: async (userData) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user already exists
    const existingUser = MOCK_USERS.find(u => u.email === userData.email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    const newUser = {
      id: Date.now().toString(),
      email: userData.email,
      password: userData.password,
      name: userData.name,
      role: 'client'
    };

    MOCK_USERS.push(newUser);

    const token = jwt.sign(
      { 
        user_id: newUser.id, 
        email: newUser.email, 
        name: newUser.name, 
        role: newUser.role 
      },
      JWT_SECRET,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { user_id: newUser.id },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return {
      data: {
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          role: newUser.role
        },
        token,
        refreshToken
      }
    };
  }
};
```

## 🔄 Django Integration Plan

### Phase 1: API Compatibility
```python
# Django views.py
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken

@api_view(['POST'])
def login(request):
    email = request.data.get('email')
    password = request.data.get('password')
    
    user = authenticate(username=email, password=password)
    if user:
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': {
                'id': user.id,
                'email': user.email,
                'name': user.get_full_name(),
                'role': 'client'
            },
            'token': str(refresh.access_token),
            'refreshToken': str(refresh)
        })
    
    return Response(
        {'error': 'Invalid credentials'}, 
        status=status.HTTP_401_UNAUTHORIZED
    )
```

### Phase 2: Migration Strategy
1. **Environment Configuration**: Switch API base URL
2. **Response Format**: Ensure Django matches mock structure
3. **Error Handling**: Standardize error responses
4. **Testing**: Validate all auth flows work with Django

## 🔐 Security Best Practices

### Token Security
- Store tokens in secure storage (Keychain/Keystore)
- Implement token rotation
- Use HTTPS for all API calls
- Implement proper logout (token invalidation)

### Input Validation
- Client-side validation for UX
- Server-side validation for security
- Password strength requirements
- Email format validation

### Error Handling
- Generic error messages (avoid info leakage)
- Rate limiting for login attempts
- Account lockout after failed attempts
- Secure password reset flow

## 📱 Platform-Specific Implementation

### React Native (Mobile)
```javascript
// Use @react-native-async-storage/async-storage
// Use react-native-keychain for sensitive data
// Implement biometric authentication
```

### React (Web)
```javascript
// Use localStorage with encryption
// Implement remember me functionality
// Handle browser session management
```

## 🧪 Testing Strategy

### Unit Tests
- Auth service methods
- Token validation
- Context state management
- Reducer logic

### Integration Tests
- Login/logout flows
- Token refresh
- API error handling
- Navigation after auth

### E2E Tests
- Complete user registration
- Login and access protected routes
- Token expiration handling
- Logout functionality

This authentication system provides a solid foundation for secure user management while maintaining flexibility for future Django integration. 