export const API_CONFIG = {
  development: {
    baseURL: 'http://localhost:3000/api',
    useMockData: true,
    timeout: 10000,
  },
  staging: {
    baseURL: 'https://staging-api.company.com/api',
    useMockData: false,
    timeout: 10000,
  },
  production: {
    baseURL: 'https://api.company.com/api',
    useMockData: false,
    timeout: 10000,
  },
};

export const APP_CONFIG = {
  name: 'Referral Client App',
  version: '1.0.0',
  description: 'Visa consultancy referral application',
  company: 'Your Company Name',
  supportEmail: 'support@company.com',
  website: 'https://company.com',
};

export const VISA_STAGES = {
  enquiry: {
    id: 'enquiry',
    name: 'Initial Enquiry',
    description: 'Basic information gathering and initial consultation',
    order: 1,
    estimatedDuration: '1-2 days',
  },
  detailed_enquiry: {
    id: 'detailed_enquiry',
    name: 'Detailed Enquiry',
    description: 'Comprehensive assessment of your case',
    order: 2,
    estimatedDuration: '3-5 days',
  },
  assessment: {
    id: 'assessment',
    name: 'Assessment',
    description: 'Professional evaluation and documentation review',
    order: 3,
    estimatedDuration: '1-2 weeks',
  },
  application: {
    id: 'application',
    name: 'Application',
    description: 'Visa application preparation and submission',
    order: 4,
    estimatedDuration: '2-4 weeks',
  },
  payment: {
    id: 'payment',
    name: 'Payment',
    description: 'Payment processing and final documentation',
    order: 5,
    estimatedDuration: '1-3 days',
  },
  completed: {
    id: 'completed',
    name: 'Completed',
    description: 'Application successfully processed',
    order: 6,
    estimatedDuration: 'Complete',
  },
};

export const NOTIFICATION_TYPES = {
  visa_progress: 'Visa Progress Update',
  referral_submitted: 'Referral Submitted',
  referral_status_update: 'Referral Status Update',
  referral_converted: 'Referral Converted',
  system_update: 'System Update',
  account_update: 'Account Update',
  payment_update: 'Payment Update',
  document_request: 'Document Request',
  appointment_scheduled: 'Appointment Scheduled',
  general: 'General Notification',
};

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user_data',
  THEME: 'theme',
  LANGUAGE: 'language',
  ONBOARDING_COMPLETED: 'onboarding_completed',
}; 