import { createUser, createAuthResponse } from '../types/auth.js';
import { createApiResponse } from '../types/api.js';
import { generateReferralCode } from '../utils/validation.js';

const mockUsers = [
  createUser({
    id: '1',
    email: 'john@example.com',
    name: 'John Doe',
    phone: '+1234567890',
    country: 'United States',
    isActive: true,
    emailVerified: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    lastLogin: '2024-01-15T10:30:00Z',
    preferredLanguage: 'en',
    timezone: 'UTC',
    currentVisaStage: 'assessment',
    visaType: 'Student Visa',
    referralCode: 'REF12345',
  }),
  createUser({
    id: '2',
    email: 'jane@example.com',
    name: 'Jane Smith',
    phone: '+1234567891',
    country: 'Canada',
    isActive: true,
    emailVerified: true,
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z',
    lastLogin: '2024-01-14T15:45:00Z',
    preferredLanguage: 'en',
    timezone: 'UTC',
    currentVisaStage: 'enquiry',
    visaType: 'Work Visa',
    referralCode: 'REF67890',
  }),
];

// Mock passwords (in a real app, these would be hashed)
const mockPasswords = {
  'john@example.com': 'password123',
  'jane@example.com': 'password456',
};

export class MockAuthService {
  static async handleRequest(method, url, data) {
    const timestamp = new Date().toISOString();

    try {
      if (method === 'POST' && url === '/auth/login') {
        return this.login(data);
      } else if (method === 'POST' && url === '/auth/register') {
        return this.register(data);
      } else if (method === 'POST' && url === '/auth/refresh') {
        return this.refreshToken(data);
      } else if (method === 'GET' && url === '/auth/me') {
        return this.getCurrentUser();
      } else if (method === 'POST' && url === '/auth/logout') {
        return this.logout();
      }

      throw new Error('Endpoint not found');
    } catch (error) {
      return createApiResponse(null, error.message, 400);
    }
  }

  static async login(credentials) {
    const { email, password } = credentials;

    const user = mockUsers.find(u => u.email === email);
    if (!user || mockPasswords[email] !== password) {
      throw new Error('Invalid credentials');
    }

    // Update last login
    user.lastLogin = new Date().toISOString();

    const authResponse = createAuthResponse({
      user,
      token: this.generateToken(user),
      refreshToken: this.generateRefreshToken(user),
      expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // 15 minutes
    });

    return createApiResponse(authResponse, 'Login successful', 200);
  }

  static async register(userData) {
    const { name, email, password, phone, country, visaType, referralCode } = userData;

    // Check if user already exists
    if (mockUsers.find(u => u.email === email)) {
      throw new Error('User already exists');
    }

    // Create new user
    const newUser = createUser({
      id: (mockUsers.length + 1).toString(),
      email,
      name,
      phone,
      country,
      isActive: true,
      emailVerified: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      preferredLanguage: 'en',
      timezone: 'UTC',
      currentVisaStage: 'enquiry',
      visaType,
      referralCode: generateReferralCode(),
      referredBy: referralCode ? mockUsers.find(u => u.referralCode === referralCode)?.id : undefined,
    });

    mockUsers.push(newUser);
    mockPasswords[email] = password;

    const authResponse = createAuthResponse({
      user: newUser,
      token: this.generateToken(newUser),
      refreshToken: this.generateRefreshToken(newUser),
      expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
    });

    return createApiResponse(authResponse, 'Registration successful', 201);
  }

  static async refreshToken(data) {
    // In a real app, you would validate the refresh token
    // For now, we'll just generate a new token
    const newToken = 'mock-jwt-token-' + Date.now();

    return createApiResponse({ token: newToken }, 'Token refreshed', 200);
  }

  static async getCurrentUser() {
    // In a real app, you would get the user from the token
    // For now, return the first user
    const user = mockUsers[0];

    return createApiResponse(user, 'User retrieved', 200);
  }

  static async logout() {
    return createApiResponse(null, 'Logout successful', 200);
  }

  static generateToken(user) {
    return `mock-jwt-token-${user.id}-${Date.now()}`;
  }

  static generateRefreshToken(user) {
    return `mock-refresh-token-${user.id}-${Date.now()}`;
  }
} 