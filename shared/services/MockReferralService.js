import { createReferral, createReferralStats } from '../types/referral.js';
import { createApiResponse } from '../types/api.js';
import { generateReferralCode } from '../utils/validation.js';

const mockReferrals = [
  createReferral({
    id: '1',
    referrerId: '1',
    referredName: 'Alice Johnson',
    referredEmail: 'alice@example.com',
    referredPhone: '+1234567892',
    referredCountry: 'United Kingdom',
    visaType: 'Student Visa',
    referralCode: 'REF-ALI123',
    status: 'converted',
    convertedAt: '2024-01-10T00:00:00Z',
    source: 'manual_form',
    notes: 'Interested in computer science program',
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z',
  }),
  createReferral({
    id: '2',
    referrerId: '1',
    referredName: 'Bob Williams',
    referredEmail: 'bob@example.com',
    referredPhone: '+1234567893',
    referredCountry: 'Australia',
    visaType: 'Work Visa',
    referralCode: 'REF-BOB456',
    status: 'contacted',
    source: 'manual_form',
    notes: 'Experienced software developer',
    createdAt: '2024-01-08T00:00:00Z',
    updatedAt: '2024-01-12T00:00:00Z',
  }),
  createReferral({
    id: '3',
    referrerId: '2',
    referredName: 'Carol Brown',
    referredEmail: 'carol@example.com',
    referredPhone: '+1234567894',
    referredCountry: 'Germany',
    visaType: 'Student Visa',
    referralCode: 'REF-CAR789',
    status: 'pending',
    source: 'manual_form',
    notes: 'Interested in business studies',
    createdAt: '2024-01-12T00:00:00Z',
    updatedAt: '2024-01-12T00:00:00Z',
  }),
];

export class MockReferralService {
  static async handleRequest(method, url, data) {
    const timestamp = new Date().toISOString();

    try {
      if (method === 'POST' && url === '/referrals') {
        return this.createReferral(data);
      } else if (method === 'GET' && url.startsWith('/referrals/')) {
        const referralId = url.split('/')[2];
        return this.getReferral(referralId);
      } else if (method === 'GET' && url === '/referrals') {
        return this.getReferrals();
      } else if (method === 'PATCH' && url.startsWith('/referrals/')) {
        const referralId = url.split('/')[2];
        return this.updateReferral(referralId, data);
      } else if (method === 'GET' && url.startsWith('/users/') && url.endsWith('/referrals')) {
        const userId = url.split('/')[2];
        return this.getUserReferrals(userId);
      } else if (method === 'GET' && url.startsWith('/users/') && url.endsWith('/referral-stats')) {
        const userId = url.split('/')[2];
        return this.getReferralStats(userId);
      }

      throw new Error('Endpoint not found');
    } catch (error) {
      return createApiResponse(null, error.message, 400);
    }
  }

  static async createReferral(data) {
    const newReferral = createReferral({
      id: (mockReferrals.length + 1).toString(),
      referrerId: data.referrerId,
      referredName: data.referredName,
      referredEmail: data.referredEmail,
      referredPhone: data.referredPhone,
      referredCountry: data.referredCountry,
      visaType: data.visaType,
      referralCode: generateReferralCode(),
      status: 'pending',
      source: data.source || 'manual_form',
      notes: data.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    mockReferrals.push(newReferral);

    return createApiResponse(newReferral, 'Referral created successfully', 201);
  }

  static async getReferral(referralId) {
    const referral = mockReferrals.find(r => r.id === referralId);
    
    if (!referral) {
      throw new Error('Referral not found');
    }

    return createApiResponse(referral, 'Referral retrieved successfully', 200);
  }

  static async getReferrals() {
    return createApiResponse(mockReferrals, 'Referrals retrieved successfully', 200);
  }

  static async updateReferral(referralId, updateData) {
    const referralIndex = mockReferrals.findIndex(r => r.id === referralId);
    
    if (referralIndex === -1) {
      throw new Error('Referral not found');
    }

    const updatedReferral = createReferral({
      ...mockReferrals[referralIndex],
      ...updateData,
      updatedAt: new Date().toISOString(),
    });

    mockReferrals[referralIndex] = updatedReferral;

    return createApiResponse(updatedReferral, 'Referral updated successfully', 200);
  }

  static async getUserReferrals(userId) {
    const userReferrals = mockReferrals.filter(r => r.referrerId === userId);

    return createApiResponse(userReferrals, 'User referrals retrieved successfully', 200);
  }

  static async getReferralStats(userId) {
    const userReferrals = mockReferrals.filter(r => r.referrerId === userId);

    const stats = createReferralStats({
      total: userReferrals.length,
      pending: userReferrals.filter(r => r.status === 'pending').length,
      contacted: userReferrals.filter(r => r.status === 'contacted').length,
      qualified: userReferrals.filter(r => r.status === 'qualified').length,
      converted: userReferrals.filter(r => r.status === 'converted').length,
      rejected: userReferrals.filter(r => r.status === 'rejected').length,
      conversionRate: 0,
      totalEarnings: 0,
      recentReferrals: userReferrals.slice(-5),
    });

    if (stats.total > 0) {
      stats.conversionRate = (stats.converted / stats.total) * 100;
    }

    return createApiResponse(stats, 'Referral stats retrieved successfully', 200);
  }
} 