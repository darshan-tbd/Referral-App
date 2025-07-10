# Database Design Guide

## 🗄️ Overview

This guide outlines the database design for the Referral Client App, focusing on client-side data requirements. The design accommodates both mock data structures for development and future integration with Django CRM's database.

## 🏗️ Database Architecture

### Current Implementation (Client-Side)
```
┌─────────────────────────────────────────────────────────────┐
│                   Client App Database                       │
├─────────────────────────────────────────────────────────────┤
│  Users  │  Referrals  │  Notifications  │  App Settings   │
├─────────────────────────────────────────────────────────────┤
│                    Local Storage                            │
└─────────────────────────────────────────────────────────────┘
```

### Future Implementation (Django Integration)
```
┌─────────────────────────────────────────────────────────────┐
│                   Django CRM Database                       │
├─────────────────────────────────────────────────────────────┤
│  CRM Tables  │  Visa Process  │  Client Management          │
├─────────────────────────────────────────────────────────────┤
│              Client App Specific Tables                     │
├─────────────────────────────────────────────────────────────┤
│  Users  │  Referrals  │  Notifications  │  App Settings   │
└─────────────────────────────────────────────────────────────┘
```

## 📊 Core Tables Design

### 1. Users Table

#### Schema
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    country VARCHAR(100),
    password_hash VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP WITH TIME ZONE,
    profile_picture_url VARCHAR(500),
    preferred_language VARCHAR(5) DEFAULT 'en',
    timezone VARCHAR(50) DEFAULT 'UTC',
    
    -- Visa-specific fields
    visa_application_number VARCHAR(50),
    current_visa_stage VARCHAR(50) DEFAULT 'enquiry',
    visa_type VARCHAR(100),
    application_date DATE,
    
    -- Referral tracking
    referred_by UUID REFERENCES users(id),
    referral_code VARCHAR(20) UNIQUE,
    
    -- Audit fields
    created_by UUID,
    updated_by UUID
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_referral_code ON users(referral_code);
CREATE INDEX idx_users_referred_by ON users(referred_by);
CREATE INDEX idx_users_created_at ON users(created_at);
```

#### TypeScript Interface
```typescript
// types/user.ts
export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  country?: string;
  isActive: boolean;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
  profilePictureUrl?: string;
  preferredLanguage: string;
  timezone: string;
  
  // Visa-specific fields
  visaApplicationNumber?: string;
  currentVisaStage: VisaStage;
  visaType?: string;
  applicationDate?: string;
  
  // Referral tracking
  referredBy?: string;
  referralCode?: string;
}

export type VisaStage = 
  | 'enquiry'
  | 'detailed_enquiry'
  | 'assessment'
  | 'application'
  | 'payment'
  | 'completed';
```

### 2. Referrals Table

#### Schema
```sql
CREATE TABLE referrals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    referrer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Referred person details
    referred_name VARCHAR(255) NOT NULL,
    referred_email VARCHAR(255) NOT NULL,
    referred_phone VARCHAR(20),
    referred_country VARCHAR(100),
    visa_type VARCHAR(100),
    
    -- Referral tracking
    referral_link VARCHAR(500),
    referral_code VARCHAR(20) UNIQUE,
    status VARCHAR(50) DEFAULT 'pending',
    converted_at TIMESTAMP WITH TIME ZONE,
    conversion_type VARCHAR(50),
    
    -- Metadata
    notes TEXT,
    source VARCHAR(100) DEFAULT 'app',
    utm_source VARCHAR(100),
    utm_medium VARCHAR(100),
    utm_campaign VARCHAR(100),
    
    -- Audit fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_by UUID
);

CREATE INDEX idx_referrals_referrer_id ON referrals(referrer_id);
CREATE INDEX idx_referrals_status ON referrals(status);
CREATE INDEX idx_referrals_created_at ON referrals(created_at);
CREATE INDEX idx_referrals_email ON referrals(referred_email);
CREATE INDEX idx_referrals_code ON referrals(referral_code);
```

#### TypeScript Interface
```typescript
// types/referral.ts
export interface Referral {
  id: string;
  referrerId: string;
  
  // Referred person details
  referredName: string;
  referredEmail: string;
  referredPhone?: string;
  referredCountry?: string;
  visaType?: string;
  
  // Referral tracking
  referralLink?: string;
  referralCode?: string;
  status: ReferralStatus;
  convertedAt?: string;
  conversionType?: string;
  
  // Metadata
  notes?: string;
  source: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  
  // Audit fields
  createdAt: string;
  updatedAt: string;
}

export type ReferralStatus = 
  | 'pending'
  | 'contacted'
  | 'qualified'
  | 'converted'
  | 'completed'
  | 'rejected';
```

### 3. Notifications Table

#### Schema
```sql
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Notification content
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    category VARCHAR(50),
    priority VARCHAR(20) DEFAULT 'medium',
    
    -- Notification state
    read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP WITH TIME ZONE,
    archived BOOLEAN DEFAULT FALSE,
    archived_at TIMESTAMP WITH TIME ZONE,
    
    -- Delivery tracking
    delivered BOOLEAN DEFAULT FALSE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    delivery_method VARCHAR(50) DEFAULT 'in_app',
    
    -- Rich content
    image_url VARCHAR(500),
    action_url VARCHAR(500),
    action_text VARCHAR(100),
    
    -- Metadata
    related_entity_type VARCHAR(50),
    related_entity_id UUID,
    expires_at TIMESTAMP WITH TIME ZONE,
    
    -- Audit fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_by UUID
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);
CREATE INDEX idx_notifications_priority ON notifications(priority);
```

#### TypeScript Interface
```typescript
// types/notification.ts
export interface Notification {
  id: string;
  userId: string;
  
  // Notification content
  title: string;
  message: string;
  type: NotificationType;
  category?: string;
  priority: NotificationPriority;
  
  // Notification state
  read: boolean;
  readAt?: string;
  archived: boolean;
  archivedAt?: string;
  
  // Delivery tracking
  delivered: boolean;
  deliveredAt?: string;
  deliveryMethod: DeliveryMethod;
  
  // Rich content
  imageUrl?: string;
  actionUrl?: string;
  actionText?: string;
  
  // Metadata
  relatedEntityType?: string;
  relatedEntityId?: string;
  expiresAt?: string;
  
  // Audit fields
  createdAt: string;
  updatedAt: string;
}

export type NotificationType = 
  | 'status_update'
  | 'reminder'
  | 'referral'
  | 'system'
  | 'promotional';

export type NotificationPriority = 
  | 'low'
  | 'medium'
  | 'high'
  | 'urgent';

export type DeliveryMethod = 
  | 'in_app'
  | 'email'
  | 'push'
  | 'sms';
```

### 4. Visa Progress Table

#### Schema
```sql
CREATE TABLE visa_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Progress tracking
    current_stage VARCHAR(50) NOT NULL,
    previous_stage VARCHAR(50),
    stage_order INTEGER NOT NULL,
    
    -- Stage details
    stage_name VARCHAR(100) NOT NULL,
    stage_description TEXT,
    completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP WITH TIME ZONE,
    started_at TIMESTAMP WITH TIME ZONE,
    
    -- Requirements and documents
    required_documents JSONB,
    submitted_documents JSONB,
    missing_documents JSONB,
    
    -- Progress metadata
    progress_percentage DECIMAL(5,2) DEFAULT 0.00,
    estimated_completion_date DATE,
    actual_completion_date DATE,
    
    -- Notes and comments
    notes TEXT,
    internal_notes TEXT,
    
    -- Audit fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_by UUID
);

CREATE INDEX idx_visa_progress_user_id ON visa_progress(user_id);
CREATE INDEX idx_visa_progress_stage ON visa_progress(current_stage);
CREATE INDEX idx_visa_progress_completed ON visa_progress(completed);
CREATE INDEX idx_visa_progress_created_at ON visa_progress(created_at);
```

#### TypeScript Interface
```typescript
// types/visaProgress.ts
export interface VisaProgress {
  id: string;
  userId: string;
  
  // Progress tracking
  currentStage: VisaStage;
  previousStage?: VisaStage;
  stageOrder: number;
  
  // Stage details
  stageName: string;
  stageDescription?: string;
  completed: boolean;
  completedAt?: string;
  startedAt?: string;
  
  // Requirements and documents
  requiredDocuments?: DocumentRequirement[];
  submittedDocuments?: SubmittedDocument[];
  missingDocuments?: string[];
  
  // Progress metadata
  progressPercentage: number;
  estimatedCompletionDate?: string;
  actualCompletionDate?: string;
  
  // Notes and comments
  notes?: string;
  internalNotes?: string;
  
  // Audit fields
  createdAt: string;
  updatedAt: string;
}

export interface DocumentRequirement {
  name: string;
  description?: string;
  required: boolean;
  format?: string;
  maxSize?: number;
}

export interface SubmittedDocument {
  name: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: string;
  verified: boolean;
  verifiedAt?: string;
}
```

### 5. App Settings Table

#### Schema
```sql
CREATE TABLE app_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    -- Settings key-value pairs
    setting_key VARCHAR(100) NOT NULL,
    setting_value JSONB,
    setting_type VARCHAR(50) DEFAULT 'user',
    
    -- Metadata
    description TEXT,
    is_encrypted BOOLEAN DEFAULT FALSE,
    is_system BOOLEAN DEFAULT FALSE,
    
    -- Audit fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    
    -- Constraints
    UNIQUE(user_id, setting_key)
);

CREATE INDEX idx_app_settings_user_id ON app_settings(user_id);
CREATE INDEX idx_app_settings_key ON app_settings(setting_key);
CREATE INDEX idx_app_settings_type ON app_settings(setting_type);
```

#### TypeScript Interface
```typescript
// types/settings.ts
export interface AppSetting {
  id: string;
  userId?: string;
  
  // Settings key-value pairs
  settingKey: string;
  settingValue: any;
  settingType: SettingType;
  
  // Metadata
  description?: string;
  isEncrypted: boolean;
  isSystem: boolean;
  
  // Audit fields
  createdAt: string;
  updatedAt: string;
}

export type SettingType = 
  | 'user'
  | 'system'
  | 'app'
  | 'feature';

export interface UserSettings {
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
    inApp: boolean;
  };
  privacy: {
    profileVisible: boolean;
    shareReferralStats: boolean;
  };
  preferences: {
    language: string;
    timezone: string;
    theme: 'light' | 'dark' | 'system';
  };
}
```

## 🔄 Mock Data Implementation

### Mock Data Store
```typescript
// data/mockDatabase.ts
import { User, Referral, Notification, VisaProgress } from '../types';

export class MockDatabase {
  private users: User[] = [];
  private referrals: Referral[] = [];
  private notifications: Notification[] = [];
  private visaProgress: VisaProgress[] = [];

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData() {
    // Initialize with sample data
    this.users = [
      {
        id: '1',
        email: 'john@example.com',
        name: 'John Doe',
        phone: '+1234567890',
        country: 'USA',
        isActive: true,
        emailVerified: true,
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
        preferredLanguage: 'en',
        timezone: 'UTC',
        currentVisaStage: 'assessment',
        visaType: 'Tourist Visa',
        applicationDate: '2023-01-15',
        referralCode: 'JOHN2023'
      }
    ];

    this.referrals = [
      {
        id: '1',
        referrerId: '1',
        referredName: 'Jane Smith',
        referredEmail: 'jane@example.com',
        referredPhone: '+1234567891',
        referredCountry: 'Canada',
        visaType: 'Student Visa',
        status: 'pending',
        source: 'app',
        createdAt: '2023-01-20T00:00:00Z',
        updatedAt: '2023-01-20T00:00:00Z'
      }
    ];

    this.notifications = [
      {
        id: '1',
        userId: '1',
        title: 'Application Status Update',
        message: 'Your visa application has moved to Assessment stage.',
        type: 'status_update',
        priority: 'high',
        read: false,
        archived: false,
        delivered: true,
        deliveredAt: '2023-01-25T00:00:00Z',
        deliveryMethod: 'in_app',
        createdAt: '2023-01-25T00:00:00Z',
        updatedAt: '2023-01-25T00:00:00Z'
      }
    ];
  }

  // User operations
  async createUser(userData: Partial<User>): Promise<User> {
    const newUser: User = {
      id: Date.now().toString(),
      email: userData.email!,
      name: userData.name!,
      phone: userData.phone,
      country: userData.country,
      isActive: true,
      emailVerified: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      preferredLanguage: 'en',
      timezone: 'UTC',
      currentVisaStage: 'enquiry',
      referralCode: this.generateReferralCode(),
      ...userData
    };

    this.users.push(newUser);
    return newUser;
  }

  async getUserById(id: string): Promise<User | null> {
    return this.users.find(user => user.id === id) || null;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.users.find(user => user.email === email) || null;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex === -1) return null;

    this.users[userIndex] = {
      ...this.users[userIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    return this.users[userIndex];
  }

  // Referral operations
  async createReferral(referralData: Partial<Referral>): Promise<Referral> {
    const newReferral: Referral = {
      id: Date.now().toString(),
      referrerId: referralData.referrerId!,
      referredName: referralData.referredName!,
      referredEmail: referralData.referredEmail!,
      referredPhone: referralData.referredPhone,
      referredCountry: referralData.referredCountry,
      visaType: referralData.visaType,
      status: 'pending',
      source: 'app',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...referralData
    };

    this.referrals.push(newReferral);
    return newReferral;
  }

  async getReferralsByUserId(userId: string): Promise<Referral[]> {
    return this.referrals.filter(referral => referral.referrerId === userId);
  }

  async updateReferral(id: string, updates: Partial<Referral>): Promise<Referral | null> {
    const referralIndex = this.referrals.findIndex(referral => referral.id === id);
    if (referralIndex === -1) return null;

    this.referrals[referralIndex] = {
      ...this.referrals[referralIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    return this.referrals[referralIndex];
  }

  // Notification operations
  async createNotification(notificationData: Partial<Notification>): Promise<Notification> {
    const newNotification: Notification = {
      id: Date.now().toString(),
      userId: notificationData.userId!,
      title: notificationData.title!,
      message: notificationData.message!,
      type: notificationData.type!,
      priority: notificationData.priority || 'medium',
      read: false,
      archived: false,
      delivered: false,
      deliveryMethod: 'in_app',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...notificationData
    };

    this.notifications.push(newNotification);
    return newNotification;
  }

  async getNotificationsByUserId(userId: string): Promise<Notification[]> {
    return this.notifications
      .filter(notification => notification.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async markNotificationAsRead(id: string): Promise<Notification | null> {
    const notificationIndex = this.notifications.findIndex(notification => notification.id === id);
    if (notificationIndex === -1) return null;

    this.notifications[notificationIndex] = {
      ...this.notifications[notificationIndex],
      read: true,
      readAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return this.notifications[notificationIndex];
  }

  // Utility methods
  private generateReferralCode(): string {
    return Math.random().toString(36).substr(2, 9).toUpperCase();
  }

  // Data export for debugging
  exportData() {
    return {
      users: this.users,
      referrals: this.referrals,
      notifications: this.notifications,
      visaProgress: this.visaProgress
    };
  }

  // Clear all data
  clearData() {
    this.users = [];
    this.referrals = [];
    this.notifications = [];
    this.visaProgress = [];
  }
}

export const mockDatabase = new MockDatabase();
```

## 🔄 Django Migration Strategy

### Phase 1: Schema Mapping
```python
# Django models.py
from django.db import models
from django.contrib.auth.models import AbstractUser
import uuid

class User(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    phone = models.CharField(max_length=20, blank=True)
    country = models.CharField(max_length=100, blank=True)
    email_verified = models.BooleanField(default=False)
    profile_picture_url = models.URLField(blank=True)
    preferred_language = models.CharField(max_length=5, default='en')
    timezone = models.CharField(max_length=50, default='UTC')
    
    # Visa-specific fields
    visa_application_number = models.CharField(max_length=50, blank=True)
    current_visa_stage = models.CharField(max_length=50, default='enquiry')
    visa_type = models.CharField(max_length=100, blank=True)
    application_date = models.DateField(null=True, blank=True)
    
    # Referral tracking
    referred_by = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True)
    referral_code = models.CharField(max_length=20, unique=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class Referral(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    referrer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='referrals')
    
    # Referred person details
    referred_name = models.CharField(max_length=255)
    referred_email = models.EmailField()
    referred_phone = models.CharField(max_length=20, blank=True)
    referred_country = models.CharField(max_length=100, blank=True)
    visa_type = models.CharField(max_length=100, blank=True)
    
    # Referral tracking
    referral_link = models.URLField(blank=True)
    referral_code = models.CharField(max_length=20, unique=True, blank=True)
    status = models.CharField(max_length=50, default='pending')
    converted_at = models.DateTimeField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class Notification(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    
    title = models.CharField(max_length=255)
    message = models.TextField()
    type = models.CharField(max_length=50)
    priority = models.CharField(max_length=20, default='medium')
    
    read = models.BooleanField(default=False)
    read_at = models.DateTimeField(null=True, blank=True)
    archived = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
```

### Phase 2: API Serializers
```python
# Django serializers.py
from rest_framework import serializers
from .models import User, Referral, Notification

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id', 'email', 'name', 'phone', 'country',
            'is_active', 'email_verified', 'created_at', 'updated_at',
            'preferred_language', 'timezone', 'visa_application_number',
            'current_visa_stage', 'visa_type', 'application_date',
            'referral_code'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

class ReferralSerializer(serializers.ModelSerializer):
    class Meta:
        model = Referral
        fields = [
            'id', 'referrer', 'referred_name', 'referred_email',
            'referred_phone', 'referred_country', 'visa_type',
            'referral_link', 'referral_code', 'status',
            'converted_at', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = [
            'id', 'user', 'title', 'message', 'type', 'priority',
            'read', 'read_at', 'archived', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
```

### Phase 3: Migration Checklist
- [ ] Create Django models matching client schema
- [ ] Set up database migrations
- [ ] Create API endpoints with same response format
- [ ] Test data migration from mock to Django
- [ ] Update client app configuration
- [ ] Validate all CRUD operations
- [ ] Set up proper indexing and constraints
- [ ] Configure backup and recovery procedures

## 🔍 Performance Optimization

### Indexing Strategy
```sql
-- Performance indexes
CREATE INDEX CONCURRENTLY idx_users_email_active ON users(email) WHERE is_active = true;
CREATE INDEX CONCURRENTLY idx_referrals_status_created ON referrals(status, created_at DESC);
CREATE INDEX CONCURRENTLY idx_notifications_user_unread ON notifications(user_id, read, created_at DESC);
CREATE INDEX CONCURRENTLY idx_visa_progress_user_stage ON visa_progress(user_id, current_stage);

-- Composite indexes for common queries
CREATE INDEX CONCURRENTLY idx_referrals_referrer_status ON referrals(referrer_id, status);
CREATE INDEX CONCURRENTLY idx_notifications_user_type_unread ON notifications(user_id, type, read);
```

### Query Optimization
```typescript
// Optimized queries for common operations
export const optimizedQueries = {
  // Get user dashboard data in single query
  getUserDashboard: `
    SELECT 
      u.id, u.name, u.email, u.current_visa_stage,
      COUNT(r.id) as referral_count,
      COUNT(n.id) FILTER (WHERE n.read = false) as unread_notifications
    FROM users u
    LEFT JOIN referrals r ON u.id = r.referrer_id
    LEFT JOIN notifications n ON u.id = n.user_id
    WHERE u.id = $1
    GROUP BY u.id, u.name, u.email, u.current_visa_stage
  `,

  // Get referral statistics
  getReferralStats: `
    SELECT 
      status,
      COUNT(*) as count,
      DATE_TRUNC('month', created_at) as month
    FROM referrals
    WHERE referrer_id = $1
    GROUP BY status, month
    ORDER BY month DESC
  `,

  // Get notification summary
  getNotificationSummary: `
    SELECT 
      type,
      COUNT(*) as total,
      COUNT(*) FILTER (WHERE read = false) as unread
    FROM notifications
    WHERE user_id = $1
    GROUP BY type
  `
};
```

This database design provides a solid foundation for both mock development and future Django integration while maintaining optimal performance and data integrity. 