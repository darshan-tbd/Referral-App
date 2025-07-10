// Mock data for the application
export const mockUsers = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1 (555) 123-4567',
    createdAt: '2024-01-15T10:30:00Z',
    totalReferrals: 12,
    successfulReferrals: 8,
    pendingReferrals: 3,
    rejectedReferrals: 1,
    totalEarnings: 2400,
    currentStage: 'document_verification',
    profilePicture: null,
    address: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA'
    },
    preferences: {
      language: 'en',
      timezone: 'America/New_York',
      notifications: {
        email: true,
        sms: false,
        push: true
      }
    }
  }
];

export const mockReferrals = [
  {
    id: 1,
    referrerName: 'John Doe',
    referrerEmail: 'john@example.com',
    refereeName: 'Sarah Johnson',
    refereeEmail: 'sarah@example.com',
    refereePhone: '+1 (555) 987-6543',
    visaType: 'Student Visa',
    country: 'Canada',
    status: 'pending',
    submittedAt: '2024-01-20T14:30:00Z',
    lastUpdated: '2024-01-22T09:15:00Z',
    commission: 200,
    notes: 'Interested in studying computer science',
    documents: [
      { name: 'passport.pdf', uploadedAt: '2024-01-20T14:30:00Z', status: 'verified' },
      { name: 'transcripts.pdf', uploadedAt: '2024-01-20T14:35:00Z', status: 'pending' }
    ],
    timeline: [
      { date: '2024-01-20T14:30:00Z', event: 'Referral submitted', status: 'completed' },
      { date: '2024-01-22T09:15:00Z', event: 'Initial review', status: 'completed' },
      { date: '2024-01-25T10:00:00Z', event: 'Document verification', status: 'pending' }
    ]
  },
  {
    id: 2,
    referrerName: 'John Doe',
    referrerEmail: 'john@example.com',
    refereeName: 'Michael Chen',
    refereeEmail: 'michael@example.com',
    refereePhone: '+1 (555) 456-7890',
    visaType: 'Work Visa',
    country: 'Australia',
    status: 'approved',
    submittedAt: '2024-01-10T11:20:00Z',
    lastUpdated: '2024-01-25T16:45:00Z',
    commission: 300,
    paidAt: '2024-01-25T16:45:00Z',
    notes: 'Software engineer position',
    documents: [
      { name: 'passport.pdf', uploadedAt: '2024-01-10T11:20:00Z', status: 'verified' },
      { name: 'job_offer.pdf', uploadedAt: '2024-01-10T11:25:00Z', status: 'verified' },
      { name: 'degree_certificate.pdf', uploadedAt: '2024-01-10T11:30:00Z', status: 'verified' }
    ],
    timeline: [
      { date: '2024-01-10T11:20:00Z', event: 'Referral submitted', status: 'completed' },
      { date: '2024-01-12T10:30:00Z', event: 'Initial review', status: 'completed' },
      { date: '2024-01-15T14:20:00Z', event: 'Document verification', status: 'completed' },
      { date: '2024-01-18T09:15:00Z', event: 'Interview scheduled', status: 'completed' },
      { date: '2024-01-22T11:30:00Z', event: 'Interview completed', status: 'completed' },
      { date: '2024-01-25T16:45:00Z', event: 'Visa approved', status: 'completed' }
    ]
  },
  {
    id: 3,
    referrerName: 'John Doe',
    referrerEmail: 'john@example.com',
    refereeName: 'Emily Rodriguez',
    refereeEmail: 'emily@example.com',
    refereePhone: '+1 (555) 234-5678',
    visaType: 'Tourist Visa',
    country: 'United Kingdom',
    status: 'rejected',
    submittedAt: '2024-01-05T13:15:00Z',
    lastUpdated: '2024-01-18T10:30:00Z',
    commission: 150,
    rejectionReason: 'Insufficient financial documentation',
    notes: 'Planning a 2-week vacation',
    documents: [
      { name: 'passport.pdf', uploadedAt: '2024-01-05T13:15:00Z', status: 'verified' },
      { name: 'bank_statement.pdf', uploadedAt: '2024-01-05T13:20:00Z', status: 'rejected' }
    ],
    timeline: [
      { date: '2024-01-05T13:15:00Z', event: 'Referral submitted', status: 'completed' },
      { date: '2024-01-08T09:30:00Z', event: 'Initial review', status: 'completed' },
      { date: '2024-01-12T14:15:00Z', event: 'Document verification', status: 'completed' },
      { date: '2024-01-18T10:30:00Z', event: 'Application rejected', status: 'completed' }
    ]
  },
  {
    id: 4,
    referrerName: 'John Doe',
    referrerEmail: 'john@example.com',
    refereeName: 'David Wilson',
    refereeEmail: 'david@example.com',
    refereePhone: '+1 (555) 345-6789',
    visaType: 'Business Visa',
    country: 'Germany',
    status: 'in_progress',
    submittedAt: '2024-01-25T16:20:00Z',
    lastUpdated: '2024-01-26T11:45:00Z',
    commission: 250,
    notes: 'Attending business conference',
    documents: [
      { name: 'passport.pdf', uploadedAt: '2024-01-25T16:20:00Z', status: 'verified' },
      { name: 'invitation_letter.pdf', uploadedAt: '2024-01-25T16:25:00Z', status: 'verified' },
      { name: 'company_registration.pdf', uploadedAt: '2024-01-25T16:30:00Z', status: 'pending' }
    ],
    timeline: [
      { date: '2024-01-25T16:20:00Z', event: 'Referral submitted', status: 'completed' },
      { date: '2024-01-26T11:45:00Z', event: 'Initial review', status: 'completed' },
      { date: '2024-01-28T10:00:00Z', event: 'Document verification', status: 'pending' }
    ]
  },
  {
    id: 5,
    referrerName: 'John Doe',
    referrerEmail: 'john@example.com',
    refereeName: 'Lisa Anderson',
    refereeEmail: 'lisa@example.com',
    refereePhone: '+1 (555) 567-8901',
    visaType: 'Family Visa',
    country: 'Canada',
    status: 'pending',
    submittedAt: '2024-01-28T09:30:00Z',
    lastUpdated: '2024-01-28T09:30:00Z',
    commission: 280,
    notes: 'Reuniting with spouse',
    documents: [
      { name: 'passport.pdf', uploadedAt: '2024-01-28T09:30:00Z', status: 'pending' },
      { name: 'marriage_certificate.pdf', uploadedAt: '2024-01-28T09:35:00Z', status: 'pending' }
    ],
    timeline: [
      { date: '2024-01-28T09:30:00Z', event: 'Referral submitted', status: 'completed' },
      { date: '2024-01-30T10:00:00Z', event: 'Initial review', status: 'pending' }
    ]
  }
];

export const mockNotifications = [
  {
    id: 1,
    title: 'Visa Application Approved',
    message: 'Michael Chen\'s work visa application for Australia has been approved. Commission of $300 has been credited to your account.',
    type: 'success',
    category: 'referral',
    isRead: false,
    createdAt: '2024-01-25T16:45:00Z',
    relatedId: 2,
    relatedType: 'referral',
    actionUrl: '/referrals/2'
  },
  {
    id: 2,
    title: 'New Document Required',
    message: 'Sarah Johnson needs to submit additional documents for her student visa application. Please follow up.',
    type: 'warning',
    category: 'document',
    isRead: false,
    createdAt: '2024-01-25T10:30:00Z',
    relatedId: 1,
    relatedType: 'referral',
    actionUrl: '/referrals/1'
  },
  {
    id: 3,
    title: 'Payment Processed',
    message: 'Your commission payment of $300 for Michael Chen\'s referral has been processed successfully.',
    type: 'info',
    category: 'payment',
    isRead: true,
    createdAt: '2024-01-25T16:50:00Z',
    relatedId: 2,
    relatedType: 'referral',
    actionUrl: '/payments'
  },
  {
    id: 4,
    title: 'Application Rejected',
    message: 'Emily Rodriguez\'s tourist visa application has been rejected due to insufficient financial documentation.',
    type: 'error',
    category: 'referral',
    isRead: true,
    createdAt: '2024-01-18T10:30:00Z',
    relatedId: 3,
    relatedType: 'referral',
    actionUrl: '/referrals/3'
  },
  {
    id: 5,
    title: 'Interview Scheduled',
    message: 'An interview has been scheduled for David Wilson\'s business visa application on February 1st at 2:00 PM.',
    type: 'info',
    category: 'interview',
    isRead: false,
    createdAt: '2024-01-26T14:20:00Z',
    relatedId: 4,
    relatedType: 'referral',
    actionUrl: '/referrals/4'
  },
  {
    id: 6,
    title: 'Welcome to the Platform',
    message: 'Welcome to our visa consultancy platform! Complete your profile to get started with referrals.',
    type: 'info',
    category: 'system',
    isRead: true,
    createdAt: '2024-01-15T10:30:00Z',
    relatedId: null,
    relatedType: null,
    actionUrl: '/profile'
  },
  {
    id: 7,
    title: 'Monthly Report Available',
    message: 'Your monthly referral report for January 2024 is now available for download.',
    type: 'info',
    category: 'report',
    isRead: false,
    createdAt: '2024-01-26T09:00:00Z',
    relatedId: null,
    relatedType: null,
    actionUrl: '/reports'
  }
];

export const mockVisaProgress = [
  {
    id: 1,
    userId: 1,
    visaType: 'Student Visa',
    country: 'Canada',
    applicationId: 'CA-STU-2024-001',
    currentStage: 'document_verification',
    overallProgress: 45,
    estimatedCompletion: '2024-03-15T00:00:00Z',
    stages: [
      {
        name: 'Application Submitted',
        key: 'application_submitted',
        status: 'completed',
        completedAt: '2024-01-15T10:30:00Z',
        progress: 100,
        description: 'Initial visa application submitted successfully'
      },
      {
        name: 'Initial Review',
        key: 'initial_review',
        status: 'completed',
        completedAt: '2024-01-18T14:20:00Z',
        progress: 100,
        description: 'Application reviewed and accepted for processing'
      },
      {
        name: 'Document Verification',
        key: 'document_verification',
        status: 'in_progress',
        startedAt: '2024-01-20T09:00:00Z',
        progress: 65,
        description: 'Verifying submitted documents and credentials',
        requirements: [
          { name: 'Passport', status: 'verified', submittedAt: '2024-01-15T10:30:00Z' },
          { name: 'Academic Transcripts', status: 'verified', submittedAt: '2024-01-15T10:35:00Z' },
          { name: 'Financial Statement', status: 'pending', submittedAt: '2024-01-20T11:00:00Z' },
          { name: 'Medical Certificate', status: 'required', submittedAt: null }
        ]
      },
      {
        name: 'Interview',
        key: 'interview',
        status: 'pending',
        progress: 0,
        description: 'Visa interview with consular officer',
        scheduledAt: '2024-02-15T14:00:00Z'
      },
      {
        name: 'Final Decision',
        key: 'final_decision',
        status: 'pending',
        progress: 0,
        description: 'Final visa decision and processing'
      }
    ],
    recentActivity: [
      {
        date: '2024-01-26T10:30:00Z',
        activity: 'Medical certificate requirement added',
        type: 'requirement_added'
      },
      {
        date: '2024-01-25T15:45:00Z',
        activity: 'Financial statement under review',
        type: 'document_review'
      },
      {
        date: '2024-01-22T11:20:00Z',
        activity: 'Academic transcripts verified',
        type: 'document_verified'
      }
    ]
  }
];

export const mockDashboardStats = {
  totalReferrals: 12,
  pendingReferrals: 3,
  approvedReferrals: 8,
  rejectedReferrals: 1,
  totalEarnings: 2400,
  thisMonthEarnings: 800,
  pendingPayments: 450,
  conversionRate: 66.7,
  avgProcessingTime: 18, // days
  recentActivity: [
    {
      type: 'referral_approved',
      message: 'Michael Chen\'s work visa approved',
      timestamp: '2024-01-25T16:45:00Z',
      amount: 300
    },
    {
      type: 'document_required',
      message: 'Sarah Johnson needs additional documents',
      timestamp: '2024-01-25T10:30:00Z',
      referralId: 1
    },
    {
      type: 'interview_scheduled',
      message: 'David Wilson\'s interview scheduled',
      timestamp: '2024-01-26T14:20:00Z',
      referralId: 4
    },
    {
      type: 'payment_processed',
      message: 'Commission payment processed',
      timestamp: '2024-01-25T16:50:00Z',
      amount: 300
    }
  ],
  monthlyStats: [
    { month: 'Jul', referrals: 2, earnings: 500 },
    { month: 'Aug', referrals: 3, earnings: 750 },
    { month: 'Sep', referrals: 1, earnings: 200 },
    { month: 'Oct', referrals: 4, earnings: 1000 },
    { month: 'Nov', referrals: 2, earnings: 450 },
    { month: 'Dec', referrals: 3, earnings: 700 },
    { month: 'Jan', referrals: 5, earnings: 1200 }
  ],
  visaTypeStats: [
    { type: 'Student Visa', count: 4, percentage: 33.3 },
    { type: 'Work Visa', count: 3, percentage: 25.0 },
    { type: 'Tourist Visa', count: 2, percentage: 16.7 },
    { type: 'Business Visa', count: 2, percentage: 16.7 },
    { type: 'Family Visa', count: 1, percentage: 8.3 }
  ],
  countryStats: [
    { country: 'Canada', count: 5, percentage: 41.7 },
    { country: 'Australia', count: 3, percentage: 25.0 },
    { country: 'United Kingdom', count: 2, percentage: 16.7 },
    { country: 'Germany', count: 1, percentage: 8.3 },
    { country: 'USA', count: 1, percentage: 8.3 }
  ]
};

export const mockPayments = [
  {
    id: 1,
    referralId: 2,
    refereeName: 'Michael Chen',
    amount: 300,
    currency: 'USD',
    status: 'paid',
    processedAt: '2024-01-25T16:50:00Z',
    paymentMethod: 'Bank Transfer',
    transactionId: 'TXN-2024-001',
    commissionRate: 15
  },
  {
    id: 2,
    referralId: 1,
    refereeName: 'Sarah Johnson',
    amount: 200,
    currency: 'USD',
    status: 'pending',
    dueDate: '2024-02-15T00:00:00Z',
    paymentMethod: 'Bank Transfer',
    commissionRate: 10
  },
  {
    id: 3,
    referralId: 4,
    refereeName: 'David Wilson',
    amount: 250,
    currency: 'USD',
    status: 'processing',
    paymentMethod: 'PayPal',
    commissionRate: 12.5
  }
];

export const mockCountries = [
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
  { code: 'UK', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'FR', name: 'France', flag: '🇫🇷' },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱' },
  { code: 'SE', name: 'Sweden', flag: '🇸🇪' },
  { code: 'NO', name: 'Norway', flag: '🇳🇴' },
  { code: 'DK', name: 'Denmark', flag: '🇩🇰' }
];

export const mockVisaTypes = [
  { id: 1, name: 'Student Visa', description: 'For educational purposes', commission: 10 },
  { id: 2, name: 'Work Visa', description: 'For employment purposes', commission: 15 },
  { id: 3, name: 'Tourist Visa', description: 'For tourism and leisure', commission: 8 },
  { id: 4, name: 'Business Visa', description: 'For business activities', commission: 12 },
  { id: 5, name: 'Family Visa', description: 'For family reunification', commission: 14 },
  { id: 6, name: 'Transit Visa', description: 'For transit purposes', commission: 5 },
  { id: 7, name: 'Medical Visa', description: 'For medical treatment', commission: 16 }
];

// Helper functions for mock API calls
export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const mockApiResponse = (data, delayMs = 500) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data,
        timestamp: new Date().toISOString()
      });
    }, delayMs);
  });
};

export const mockApiError = (message, delayMs = 500) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error(message));
    }, delayMs);
  });
}; 