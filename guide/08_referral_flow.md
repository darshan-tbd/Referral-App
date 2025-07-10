# Referral Flow Guide

## 🎯 Overview

This guide outlines the referral system for the Referral Client App, designed to help users refer potential clients to the visa consultancy service. The system is implemented in two phases: current manual form submission and future shareable link generation.

## 🔄 Current Implementation: Manual Referral Form

### Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                   Logged-in User                            │
├─────────────────────────────────────────────────────────────┤
│                 Referral Form UI                            │
├─────────────────────────────────────────────────────────────┤
│                Referral Service                             │
├─────────────────────────────────────────────────────────────┤
│               API (Mock/Django)                             │
├─────────────────────────────────────────────────────────────┤
│            Referral Database                                │
└─────────────────────────────────────────────────────────────┘
```

### Flow Diagram
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   User      │    │   Fills     │    │   Submits   │    │   Referral  │
│   Logged    │───▶│   Referral  │───▶│   Form      │───▶│   Created   │
│   In        │    │   Form      │    │   Data      │    │   in CRM    │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
       │                                                         │
       │                                                         │
       └─────────────────────────────────────────────────────────┘
                              Referrer ID linked to new client
```

### Data Flow
1. **User Authentication**: User must be logged in to access referral form
2. **Form Submission**: User fills out referral details
3. **Data Processing**: System validates and processes referral data
4. **CRM Integration**: Referral data sent to CRM system
5. **Tracking**: Referrer ID linked to new client enquiry

## 🛠️ Implementation Details

### Referral Service
```typescript
// services/ReferralService.ts
import { Referral, ReferralFormData, ReferralStats } from '../types/referral';
import { mockDatabase } from '../data/mockDatabase';
import ApiService from './ApiService';
import NotificationService from './NotificationService';

class ReferralService {
  // Create a new referral
  async createReferral(referralData: ReferralFormData): Promise<Referral> {
    try {
      // Validate referral data
      this.validateReferralData(referralData);
      
      // Generate referral code
      const referralCode = this.generateReferralCode();
      
      const referral: Partial<Referral> = {
        ...referralData,
        referralCode,
        status: 'pending',
        source: 'manual_form',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      let createdReferral: Referral;
      
      if (process.env.NODE_ENV === 'development') {
        createdReferral = await mockDatabase.createReferral(referral);
      } else {
        const response = await ApiService.post('/referrals', referral);
        createdReferral = response.data;
      }

      // Send notification to referrer
      await NotificationService.createNotification(
        createdReferral.referrerId,
        'referral_submitted',
        {
          referredName: createdReferral.referredName,
          referralCode: createdReferral.referralCode
        }
      );

      // Track referral creation event
      this.trackReferralEvent('referral_created', createdReferral);
      
      return createdReferral;
    } catch (error) {
      console.error('Failed to create referral:', error);
      throw error;
    }
  }

  // Get user's referrals
  async getUserReferrals(userId: string): Promise<Referral[]> {
    try {
      if (process.env.NODE_ENV === 'development') {
        return mockDatabase.getReferralsByUserId(userId);
      } else {
        const response = await ApiService.get(`/users/${userId}/referrals`);
        return response.data;
      }
    } catch (error) {
      console.error('Failed to fetch referrals:', error);
      throw error;
    }
  }

  // Get referral by ID
  async getReferralById(referralId: string): Promise<Referral | null> {
    try {
      if (process.env.NODE_ENV === 'development') {
        return mockDatabase.getReferralById(referralId);
      } else {
        const response = await ApiService.get(`/referrals/${referralId}`);
        return response.data;
      }
    } catch (error) {
      console.error('Failed to fetch referral:', error);
      return null;
    }
  }

  // Update referral status
  async updateReferralStatus(
    referralId: string, 
    status: string, 
    notes?: string
  ): Promise<Referral | null> {
    try {
      const updates = {
        status,
        notes,
        updatedAt: new Date().toISOString(),
        ...(status === 'converted' && { convertedAt: new Date().toISOString() })
      };

      let updatedReferral: Referral | null;
      
      if (process.env.NODE_ENV === 'development') {
        updatedReferral = await mockDatabase.updateReferral(referralId, updates);
      } else {
        const response = await ApiService.patch(`/referrals/${referralId}`, updates);
        updatedReferral = response.data;
      }

      if (updatedReferral) {
        // Send notification to referrer about status change
        await NotificationService.createNotification(
          updatedReferral.referrerId,
          'referral_status_update',
          {
            referredName: updatedReferral.referredName,
            status: updatedReferral.status
          }
        );

        // Track status change event
        this.trackReferralEvent('referral_status_changed', updatedReferral);
      }

      return updatedReferral;
    } catch (error) {
      console.error('Failed to update referral status:', error);
      throw error;
    }
  }

  // Get referral statistics
  async getReferralStats(userId: string): Promise<ReferralStats> {
    try {
      const referrals = await this.getUserReferrals(userId);
      
      const stats: ReferralStats = {
        total: referrals.length,
        pending: referrals.filter(r => r.status === 'pending').length,
        contacted: referrals.filter(r => r.status === 'contacted').length,
        qualified: referrals.filter(r => r.status === 'qualified').length,
        converted: referrals.filter(r => r.status === 'converted').length,
        rejected: referrals.filter(r => r.status === 'rejected').length,
        conversionRate: 0,
        totalEarnings: 0,
        recentReferrals: referrals.slice(0, 5)
      };

      // Calculate conversion rate
      if (stats.total > 0) {
        stats.conversionRate = (stats.converted / stats.total) * 100;
      }

      return stats;
    } catch (error) {
      console.error('Failed to fetch referral stats:', error);
      throw error;
    }
  }

  // Private helper methods
  private validateReferralData(data: ReferralFormData): void {
    const required = ['referrerId', 'referredName', 'referredEmail'];
    for (const field of required) {
      if (!data[field]) {
        throw new Error(`${field} is required`);
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.referredEmail)) {
      throw new Error('Invalid email format');
    }

    // Validate phone if provided
    if (data.referredPhone && data.referredPhone.length < 10) {
      throw new Error('Invalid phone number');
    }
  }

  private generateReferralCode(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    return `REF-${timestamp}-${random}`.toUpperCase();
  }

  private trackReferralEvent(eventName: string, referral: Referral): void {
    // Analytics tracking would go here
    console.log(`Referral event: ${eventName}`, {
      referralId: referral.id,
      referrerId: referral.referrerId,
      status: referral.status
    });
  }
}

export default new ReferralService();
```

### Referral Form Component
```tsx
// components/referral/ReferralForm.tsx
import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/Select';
import { useAuth } from '../../hooks/useAuth';
import ReferralService from '../../services/ReferralService';
import { toast } from 'react-hot-toast';

const VISA_TYPES = [
  'Tourist Visa',
  'Business Visa',
  'Student Visa',
  'Work Visa',
  'Transit Visa',
  'Other'
];

const COUNTRIES = [
  'United States',
  'Canada',
  'United Kingdom',
  'Australia',
  'Germany',
  'France',
  'Other'
];

export const ReferralForm: React.FC = () => {
  const [formData, setFormData] = useState({
    referredName: '',
    referredEmail: '',
    referredPhone: '',
    referredCountry: '',
    visaType: '',
    notes: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const newErrors: Record<string, string> = {};
    
    if (!formData.referredName.trim()) {
      newErrors.referredName = 'Name is required';
    }
    
    if (!formData.referredEmail.trim()) {
      newErrors.referredEmail = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.referredEmail)) {
      newErrors.referredEmail = 'Invalid email format';
    }
    
    if (!formData.referredPhone.trim()) {
      newErrors.referredPhone = 'Phone number is required';
    } else if (formData.referredPhone.length < 10) {
      newErrors.referredPhone = 'Phone number must be at least 10 digits';
    }
    
    if (!formData.referredCountry) {
      newErrors.referredCountry = 'Country is required';
    }
    
    if (!formData.visaType) {
      newErrors.visaType = 'Visa type is required';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setLoading(true);
    setErrors({});
    
    try {
      await ReferralService.createReferral({
        referrerId: user.id,
        ...formData
      });
      
      toast.success('Referral submitted successfully!');
      
      // Reset form
      setFormData({
        referredName: '',
        referredEmail: '',
        referredPhone: '',
        referredCountry: '',
        visaType: '',
        notes: ''
      });
    } catch (error) {
      toast.error(error.message || 'Failed to submit referral');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Refer Someone</CardTitle>
        <p className="text-sm text-gray-600">
          Help someone with their visa journey and earn rewards
        </p>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Personal Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                value={formData.referredName}
                onChange={(e) => handleInputChange('referredName', e.target.value)}
                error={errors.referredName}
                placeholder="Enter their full name"
                required
              />
              
              <Input
                label="Email Address"
                type="email"
                value={formData.referredEmail}
                onChange={(e) => handleInputChange('referredEmail', e.target.value)}
                error={errors.referredEmail}
                placeholder="Enter their email"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Phone Number"
                type="tel"
                value={formData.referredPhone}
                onChange={(e) => handleInputChange('referredPhone', e.target.value)}
                error={errors.referredPhone}
                placeholder="Enter their phone number"
                required
              />
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Country</label>
                <Select
                  value={formData.referredCountry}
                  onValueChange={(value) => handleInputChange('referredCountry', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTRIES.map(country => (
                      <SelectItem key={country} value={country}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.referredCountry && (
                  <p className="text-sm text-red-500">{errors.referredCountry}</p>
                )}
              </div>
            </div>
          </div>
          
          {/* Visa Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Visa Information</h3>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Visa Type</label>
              <Select
                value={formData.visaType}
                onValueChange={(value) => handleInputChange('visaType', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select visa type" />
                </SelectTrigger>
                <SelectContent>
                  {VISA_TYPES.map(type => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.visaType && (
                <p className="text-sm text-red-500">{errors.visaType}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Additional Notes (Optional)</label>
              <Textarea
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Any additional information about the referral..."
                rows={4}
              />
            </div>
          </div>
          
          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            loading={loading}
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit Referral'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
```

### Referral Dashboard
```tsx
// components/referral/ReferralDashboard.tsx
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Users, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import ReferralService from '../../services/ReferralService';
import { ReferralStats, Referral } from '../../types/referral';

export const ReferralDashboard: React.FC = () => {
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    loadReferralStats();
  }, []);

  const loadReferralStats = async () => {
    try {
      setLoading(true);
      const data = await ReferralService.getReferralStats(user.id);
      setStats(data);
    } catch (error) {
      console.error('Failed to load referral stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
      contacted: { color: 'bg-blue-100 text-blue-800', label: 'Contacted' },
      qualified: { color: 'bg-purple-100 text-purple-800', label: 'Qualified' },
      converted: { color: 'bg-green-100 text-green-800', label: 'Converted' },
      rejected: { color: 'bg-red-100 text-red-800', label: 'Rejected' }
    };

    const config = statusConfig[status] || statusConfig.pending;
    return (
      <Badge className={config.color}>
        {config.label}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Referrals</p>
                <p className="text-2xl font-bold">{stats?.total || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                <p className="text-2xl font-bold">{stats?.conversionRate.toFixed(1) || 0}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold">{stats?.pending || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Converted</p>
                <p className="text-2xl font-bold">{stats?.converted || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Referrals */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Referrals</CardTitle>
        </CardHeader>
        <CardContent>
          {stats?.recentReferrals && stats.recentReferrals.length > 0 ? (
            <div className="space-y-4">
              {stats.recentReferrals.map((referral) => (
                <div key={referral.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">{referral.referredName}</h4>
                    <p className="text-sm text-gray-600">{referral.referredEmail}</p>
                    <p className="text-xs text-gray-500">
                      {referral.visaType} • {new Date(referral.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(referral.status)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No referrals yet</p>
              <p className="text-sm">Start referring people to earn rewards!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
```

## 🚀 Future Feature: Shareable Referral Links

### Architecture Design
```
┌─────────────────────────────────────────────────────────────┐
│                 Referral Link System                        │
├─────────────────────────────────────────────────────────────┤
│  Link Generation  │  Link Sharing  │  Link Tracking        │
├─────────────────────────────────────────────────────────────┤
│               Public Form Landing Page                      │
├─────────────────────────────────────────────────────────────┤
│               Referral Attribution                          │
└─────────────────────────────────────────────────────────────┘
```

### Implementation Plan

#### Phase 1: Link Generation Service
```typescript
// services/ReferralLinkService.ts (Future Implementation)
class ReferralLinkService {
  // Generate unique referral link
  async generateReferralLink(userId: string, options?: {
    campaign?: string;
    source?: string;
    medium?: string;
  }): Promise<{
    link: string;
    code: string;
    expiresAt?: string;
  }> {
    const referralCode = this.generateUniqueCode();
    const baseUrl = process.env.REFERRAL_BASE_URL || 'https://app.company.com';
    
    const link = `${baseUrl}/ref/${referralCode}`;
    
    // Store referral link in database
    await this.storeReferralLink({
      userId,
      referralCode,
      link,
      campaign: options?.campaign,
      source: options?.source,
      medium: options?.medium,
      expiresAt: options?.expiresAt
    });
    
    return {
      link,
      code: referralCode,
      expiresAt: options?.expiresAt
    };
  }

  // Track link clicks
  async trackLinkClick(referralCode: string, metadata?: {
    userAgent?: string;
    ipAddress?: string;
    location?: string;
  }): Promise<void> {
    // Implementation for tracking link clicks
  }

  // Get referral link analytics
  async getLinkAnalytics(referralCode: string): Promise<{
    clicks: number;
    conversions: number;
    conversionRate: number;
    sources: Record<string, number>;
  }> {
    // Implementation for analytics
    return {
      clicks: 0,
      conversions: 0,
      conversionRate: 0,
      sources: {}
    };
  }
}
```

#### Phase 2: Public Landing Page
```tsx
// pages/ReferralLandingPage.tsx (Future Implementation)
export const ReferralLandingPage: React.FC = () => {
  const { referralCode } = useParams();
  const [referrer, setReferrer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReferrerInfo();
  }, [referralCode]);

  const loadReferrerInfo = async () => {
    try {
      // Track link click
      await ReferralLinkService.trackLinkClick(referralCode);
      
      // Get referrer information
      const referrerData = await ReferralService.getReferrerByCode(referralCode);
      setReferrer(referrerData);
    } catch (error) {
      console.error('Failed to load referrer info:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Start Your Visa Journey
          </h1>
          {referrer && (
            <p className="text-xl text-gray-600">
              {referrer.name} recommended our visa services
            </p>
          )}
        </div>

        {/* Referral Form */}
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Get Started</CardTitle>
            <p className="text-gray-600">
              Fill out this form to begin your visa application process
            </p>
          </CardHeader>
          <CardContent>
            <ReferralPublicForm referralCode={referralCode} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
```

#### Phase 3: Link Sharing UI
```tsx
// components/referral/ReferralLinkGenerator.tsx (Future Implementation)
export const ReferralLinkGenerator: React.FC = () => {
  const [referralLink, setReferralLink] = useState('');
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const { user } = useAuth();

  const generateLink = async () => {
    setGenerating(true);
    try {
      const result = await ReferralLinkService.generateReferralLink(user.id);
      setReferralLink(result.link);
    } catch (error) {
      toast.error('Failed to generate referral link');
    } finally {
      setGenerating(false);
    }
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareVia = (platform: string) => {
    const message = `Check out this visa service! ${referralLink}`;
    const encodedMessage = encodeURIComponent(message);
    
    const shareUrls = {
      whatsapp: `https://wa.me/?text=${encodedMessage}`,
      telegram: `https://t.me/share/url?url=${referralLink}&text=${encodedMessage}`,
      email: `mailto:?subject=Visa Service Recommendation&body=${encodedMessage}`,
      sms: `sms:?body=${encodedMessage}`
    };
    
    window.open(shareUrls[platform], '_blank');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Share Your Referral Link</CardTitle>
        <p className="text-gray-600">
          Generate a unique link to share with friends and family
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {!referralLink ? (
          <Button onClick={generateLink} loading={generating}>
            Generate Referral Link
          </Button>
        ) : (
          <>
            <div className="flex items-center space-x-2">
              <Input
                value={referralLink}
                readOnly
                className="flex-1"
              />
              <Button onClick={copyToClipboard} variant="outline">
                {copied ? 'Copied!' : 'Copy'}
              </Button>
            </div>
            
            <div className="flex space-x-2">
              <Button onClick={() => shareVia('whatsapp')} size="sm">
                WhatsApp
              </Button>
              <Button onClick={() => shareVia('telegram')} size="sm">
                Telegram
              </Button>
              <Button onClick={() => shareVia('email')} size="sm">
                Email
              </Button>
              <Button onClick={() => shareVia('sms')} size="sm">
                SMS
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
```

## 🔄 Django Integration

### Django Models for Referral System
```python
# models.py
from django.db import models
from django.contrib.auth.models import User
import uuid

class ReferralLink(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='referral_links')
    referral_code = models.CharField(max_length=50, unique=True)
    link = models.URLField()
    
    # Campaign tracking
    campaign = models.CharField(max_length=100, blank=True)
    source = models.CharField(max_length=100, blank=True)
    medium = models.CharField(max_length=100, blank=True)
    
    # Analytics
    clicks = models.IntegerField(default=0)
    conversions = models.IntegerField(default=0)
    
    # Lifecycle
    is_active = models.BooleanField(default=True)
    expires_at = models.DateTimeField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class ReferralLinkClick(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    referral_link = models.ForeignKey(ReferralLink, on_delete=models.CASCADE)
    
    # Tracking data
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    location = models.CharField(max_length=100, blank=True)
    
    clicked_at = models.DateTimeField(auto_now_add=True)

class Referral(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('contacted', 'Contacted'),
        ('qualified', 'Qualified'),
        ('converted', 'Converted'),
        ('rejected', 'Rejected'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    referrer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='referrals')
    referral_link = models.ForeignKey(ReferralLink, on_delete=models.SET_NULL, null=True, blank=True)
    
    # Referred person details
    referred_name = models.CharField(max_length=255)
    referred_email = models.EmailField()
    referred_phone = models.CharField(max_length=20, blank=True)
    referred_country = models.CharField(max_length=100, blank=True)
    visa_type = models.CharField(max_length=100, blank=True)
    
    # Status tracking
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    referral_code = models.CharField(max_length=50, unique=True, blank=True)
    
    # Conversion tracking
    converted_at = models.DateTimeField(null=True, blank=True)
    conversion_value = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    
    notes = models.TextField(blank=True)
    source = models.CharField(max_length=100, default='manual_form')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
```

### Django API Views
```python
# views.py
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Referral, ReferralLink
from .serializers import ReferralSerializer, ReferralLinkSerializer

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_referral(request):
    serializer = ReferralSerializer(data=request.data)
    if serializer.is_valid():
        referral = serializer.save(referrer=request.user)
        
        # Send notification to CRM system
        send_referral_to_crm(referral)
        
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_referrals(request):
    referrals = Referral.objects.filter(referrer=request.user).order_by('-created_at')
    serializer = ReferralSerializer(referrals, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def generate_referral_link(request):
    # Check if user already has an active link
    existing_link = ReferralLink.objects.filter(
        user=request.user,
        is_active=True
    ).first()
    
    if existing_link:
        serializer = ReferralLinkSerializer(existing_link)
        return Response(serializer.data)
    
    # Generate new link
    referral_code = generate_unique_code()
    link = f"{settings.REFERRAL_BASE_URL}/ref/{referral_code}"
    
    referral_link = ReferralLink.objects.create(
        user=request.user,
        referral_code=referral_code,
        link=link
    )
    
    serializer = ReferralLinkSerializer(referral_link)
    return Response(serializer.data, status=status.HTTP_201_CREATED)

def send_referral_to_crm(referral):
    # Integration with CRM system
    # This would send the referral data to your CRM
    pass
```

## 📊 Analytics and Tracking

### Referral Analytics Dashboard
```typescript
// components/referral/ReferralAnalytics.tsx (Future Implementation)
export const ReferralAnalytics: React.FC = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const data = await ReferralService.getAnalytics();
      setAnalytics(data);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Link Clicks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{analytics?.totalClicks || 0}</div>
            <p className="text-sm text-gray-600">+12% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{analytics?.conversionRate || 0}%</div>
            <p className="text-sm text-gray-600">+2.5% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Total Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${analytics?.totalEarnings || 0}</div>
            <p className="text-sm text-gray-600">+$125 from last month</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts and detailed analytics would go here */}
    </div>
  );
};
```

This referral system provides a comprehensive foundation for tracking and managing referrals, with clear paths for future enhancement through shareable links and advanced analytics. 