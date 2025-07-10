// Mock Data Service for React Native Mobile App

export const mockData = {
  // Users data for authentication
  users: [
    {
      id: 1,
      name: 'John Smith',
      email: 'john@example.com',
      password: 'password123',
      phone: '+1-555-0123',
      country: 'United States',
      visaType: 'H1B',
      currentStage: 'Documents Review',
      joinDate: '2023-06-15',
      referralCode: 'JOHN123',
      totalReferrals: 5,
      successfulReferrals: 3,
      avatar: 'https://via.placeholder.com/150/3B82F6/FFFFFF?text=JS',
      accountType: 'Premium',
      points: 1250,
      tier: 'Gold',
      progress: {
        current: 2,
        stages: [
          { id: 1, name: 'Initial Enquiry', status: 'completed', date: '2023-06-15' },
          { id: 2, name: 'Document Collection', status: 'completed', date: '2023-06-20' },
          { id: 3, name: 'Documents Review', status: 'in_progress', date: '2023-06-25' },
          { id: 4, name: 'Application Submission', status: 'pending', date: null },
          { id: 5, name: 'Visa Approval', status: 'pending', date: null },
        ],
      },
    },
    {
      id: 2,
      name: 'Jane Doe',
      email: 'jane@example.com',
      password: 'password123',
      phone: '+1-555-0456',
      country: 'Canada',
      visaType: 'Study Visa',
      currentStage: 'Application Submission',
      joinDate: '2023-05-10',
      referralCode: 'JANE456',
      totalReferrals: 8,
      successfulReferrals: 6,
      avatar: 'https://via.placeholder.com/150/3B82F6/FFFFFF?text=JD',
      accountType: 'Premium',
      points: 2100,
      tier: 'Platinum',
      progress: {
        current: 3,
        stages: [
          { id: 1, name: 'Initial Enquiry', status: 'completed', date: '2023-05-10' },
          { id: 2, name: 'Document Collection', status: 'completed', date: '2023-05-15' },
          { id: 3, name: 'Documents Review', status: 'completed', date: '2023-05-20' },
          { id: 4, name: 'Application Submission', status: 'in_progress', date: '2023-05-25' },
          { id: 5, name: 'Visa Approval', status: 'pending', date: null },
        ],
      },
    },
  ],

  // Referrals data
  referrals: [
    {
      id: 1,
      referrerName: 'John Smith',
      referrerEmail: 'john@example.com',
      refereeName: 'Michael Johnson',
      refereeEmail: 'michael@example.com',
      refereePhone: '+1-555-0789',
      status: 'pending',
      visaType: 'H1B',
      country: 'United States',
      submissionDate: '2023-11-15',
      notes: 'Referred by John for H1B visa application',
      commissionAmount: 500,
      commissionStatus: 'pending',
      priority: 'medium',
      assignedTo: 'Sarah Wilson',
      estimatedProcessingTime: '2-3 weeks',
      documents: ['Resume', 'Passport Copy', 'Educational Certificates'],
      source: 'mobile_app',
    },
    {
      id: 2,
      referrerName: 'Jane Doe',
      referrerEmail: 'jane@example.com',
      refereeName: 'Emily Davis',
      refereeEmail: 'emily@example.com',
      refereePhone: '+1-555-0321',
      status: 'approved',
      visaType: 'Study Visa',
      country: 'Canada',
      submissionDate: '2023-11-10',
      notes: 'Student visa application for Masters program',
      commissionAmount: 750,
      commissionStatus: 'paid',
      priority: 'high',
      assignedTo: 'David Brown',
      estimatedProcessingTime: '1-2 weeks',
      documents: ['Academic Transcripts', 'IELTS Score', 'Financial Documents'],
      source: 'mobile_app',
    },
    {
      id: 3,
      referrerName: 'John Smith',
      referrerEmail: 'john@example.com',
      refereeName: 'Robert Wilson',
      refereeEmail: 'robert@example.com',
      refereePhone: '+1-555-0654',
      status: 'in_progress',
      visaType: 'Tourist Visa',
      country: 'United Kingdom',
      submissionDate: '2023-11-08',
      notes: 'Tourist visa for family vacation',
      commissionAmount: 300,
      commissionStatus: 'pending',
      priority: 'low',
      assignedTo: 'Lisa Anderson',
      estimatedProcessingTime: '3-4 weeks',
      documents: ['Bank Statements', 'Travel Itinerary', 'Hotel Bookings'],
      source: 'mobile_app',
    },
    {
      id: 4,
      referrerName: 'Jane Doe',
      referrerEmail: 'jane@example.com',
      refereeName: 'Amanda Chen',
      refereeEmail: 'amanda@example.com',
      refereePhone: '+1-555-0987',
      status: 'rejected',
      visaType: 'Work Visa',
      country: 'Australia',
      submissionDate: '2023-11-05',
      notes: 'Work visa application - documents incomplete',
      commissionAmount: 600,
      commissionStatus: 'cancelled',
      priority: 'medium',
      assignedTo: 'Mark Taylor',
      estimatedProcessingTime: '2-3 weeks',
      documents: ['Work Contract', 'Skills Assessment', 'Medical Certificate'],
      source: 'mobile_app',
    },
  ],

  // Notifications data
  notifications: [
    {
      id: 1,
      title: 'Application Status Update',
      message: 'Your H1B visa application has been approved! Congratulations!',
      type: 'success',
      category: 'visa_status',
      isRead: false,
      createdAt: '2023-11-20T10:30:00Z',
      priority: 'high',
      actionRequired: false,
      relatedId: 1,
      relatedType: 'visa_application',
    },
    {
      id: 2,
      title: 'Document Required',
      message: 'Please upload your updated passport copy for your visa application.',
      type: 'warning',
      category: 'documents',
      isRead: false,
      createdAt: '2023-11-19T14:15:00Z',
      priority: 'medium',
      actionRequired: true,
      relatedId: 2,
      relatedType: 'document_request',
    },
    {
      id: 3,
      title: 'Referral Commission',
      message: 'You have earned $500 commission for your successful referral!',
      type: 'info',
      category: 'referral',
      isRead: true,
      createdAt: '2023-11-18T09:45:00Z',
      priority: 'low',
      actionRequired: false,
      relatedId: 1,
      relatedType: 'referral_commission',
    },
    {
      id: 4,
      title: 'Appointment Reminder',
      message: 'Your consultation appointment is scheduled for tomorrow at 2:00 PM.',
      type: 'info',
      category: 'appointment',
      isRead: false,
      createdAt: '2023-11-17T16:20:00Z',
      priority: 'medium',
      actionRequired: true,
      relatedId: 1,
      relatedType: 'appointment',
    },
    {
      id: 5,
      title: 'Welcome Message',
      message: 'Welcome to our visa consultancy app! We are here to help you with your visa journey.',
      type: 'info',
      category: 'general',
      isRead: true,
      createdAt: '2023-11-15T12:00:00Z',
      priority: 'low',
      actionRequired: false,
      relatedId: null,
      relatedType: 'welcome',
    },
  ],

  // Dashboard statistics
  dashboardStats: {
    totalApplications: 156,
    activeApplications: 23,
    approvedApplications: 98,
    pendingApplications: 35,
    totalReferrals: 45,
    successfulReferrals: 32,
    pendingReferrals: 13,
    totalCommission: 15750,
    thisMonthCommission: 2500,
    successRate: 85.3,
    avgProcessingTime: '2.5 weeks',
    notifications: {
      total: 12,
      unread: 4,
      urgent: 1,
    },
  },

  // Monthly performance data
  monthlyPerformance: [
    { month: 'Jan', applications: 12, approvals: 10, referrals: 3, commission: 1250 },
    { month: 'Feb', applications: 15, approvals: 12, referrals: 4, commission: 1800 },
    { month: 'Mar', applications: 18, approvals: 14, referrals: 5, commission: 2100 },
    { month: 'Apr', applications: 22, approvals: 18, referrals: 6, commission: 2750 },
    { month: 'May', applications: 25, approvals: 20, referrals: 7, commission: 3200 },
    { month: 'Jun', applications: 28, approvals: 24, referrals: 8, commission: 3800 },
    { month: 'Jul', applications: 32, approvals: 26, referrals: 9, commission: 4200 },
    { month: 'Aug', applications: 35, approvals: 28, referrals: 10, commission: 4750 },
    { month: 'Sep', applications: 38, approvals: 32, referrals: 11, commission: 5200 },
    { month: 'Oct', applications: 42, approvals: 36, referrals: 12, commission: 5800 },
    { month: 'Nov', applications: 45, approvals: 38, referrals: 13, commission: 6250 },
    { month: 'Dec', applications: 48, approvals: 42, referrals: 15, commission: 6800 },
  ],

  // Visa types
  visaTypes: [
    { id: 'h1b', name: 'H1B Work Visa', description: 'For skilled workers in specialty occupations' },
    { id: 'student', name: 'Student Visa', description: 'For students pursuing education abroad' },
    { id: 'tourist', name: 'Tourist Visa', description: 'For tourism and leisure travel' },
    { id: 'business', name: 'Business Visa', description: 'For business meetings and conferences' },
    { id: 'family', name: 'Family Visa', description: 'For family reunification' },
    { id: 'transit', name: 'Transit Visa', description: 'For transit through a country' },
  ],

  // Countries
  countries: [
    { id: 'us', name: 'United States', code: 'US' },
    { id: 'ca', name: 'Canada', code: 'CA' },
    { id: 'uk', name: 'United Kingdom', code: 'GB' },
    { id: 'au', name: 'Australia', code: 'AU' },
    { id: 'de', name: 'Germany', code: 'DE' },
    { id: 'fr', name: 'France', code: 'FR' },
    { id: 'jp', name: 'Japan', code: 'JP' },
    { id: 'sg', name: 'Singapore', code: 'SG' },
  ],

  // Settings
  settings: {
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      smsNotifications: false,
      statusUpdates: true,
      promotionalEmails: false,
    },
    privacy: {
      profileVisible: true,
      shareProgress: false,
      analyticsEnabled: true,
    },
    preferences: {
      theme: 'light',
      language: 'en',
      currency: 'USD',
      timezone: 'America/New_York',
    },
  },
};

// Authentication service - LOGIN ONLY (no registration for client-side app)
export const authService = {
  async login(email, password) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = mockData.users.find(u => u.email === email && u.password === password);
        if (user) {
          const { password: _, ...userData } = user;
          resolve({
            success: true,
            data: {
              user: userData,
              token: `mock-jwt-token-${user.id}`,
              refreshToken: `mock-refresh-token-${user.id}`,
            },
          });
        } else {
          reject(new Error('Invalid email or password'));
        }
      }, 1000);
    });
  },

  async getCurrentUser(token) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const userId = parseInt(token.split('-').pop());
        const user = mockData.users.find(u => u.id === userId);
        if (user) {
          const { password: _, ...userData } = user;
          resolve({
            success: true,
            data: { user: userData },
          });
        } else {
          reject(new Error('Invalid token'));
        }
      }, 500);
    });
  },

  async logout() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: 'Logged out successfully',
        });
      }, 300);
    });
  },
};

// Referral service
export const referralService = {
  async getReferrals(userId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = mockData.users.find(u => u.id === userId);
        const userReferrals = mockData.referrals.filter(r => r.referrerEmail === user?.email);
        resolve({
          success: true,
          data: { referrals: userReferrals },
        });
      }, 800);
    });
  },

  async createReferral(referralData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const existingReferral = mockData.referrals.find(r => r.refereeEmail === referralData.refereeEmail);
        if (existingReferral) {
          reject(new Error('This email has already been referred'));
        } else {
          const newReferral = {
            id: mockData.referrals.length + 1,
            ...referralData,
            status: 'pending',
            submissionDate: new Date().toISOString().split('T')[0],
            commissionAmount: Math.floor(Math.random() * 500) + 300,
            commissionStatus: 'pending',
            priority: 'medium',
            assignedTo: 'Support Team',
            estimatedProcessingTime: '2-3 weeks',
            documents: [],
            source: 'mobile_app',
          };
          mockData.referrals.push(newReferral);
          resolve({
            success: true,
            data: { referral: newReferral },
          });
        }
      }, 1000);
    });
  },
};

// Notification service
export const notificationService = {
  async getNotifications(userId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: { notifications: mockData.notifications },
        });
      }, 600);
    });
  },

  async markAsRead(notificationId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const notification = mockData.notifications.find(n => n.id === notificationId);
        if (notification) {
          notification.isRead = true;
        }
        resolve({
          success: true,
          data: { notification },
        });
      }, 300);
    });
  },

  async markAllAsRead() {
    return new Promise((resolve) => {
      setTimeout(() => {
        mockData.notifications.forEach(n => n.isRead = true);
        resolve({
          success: true,
          data: { notifications: mockData.notifications },
        });
      }, 500);
    });
  },
};

// Dashboard service
export const dashboardService = {
  async getDashboardData(userId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: {
            stats: mockData.dashboardStats,
            monthlyPerformance: mockData.monthlyPerformance,
            recentReferrals: mockData.referrals.slice(0, 3),
            recentNotifications: mockData.notifications.slice(0, 5),
          },
        });
      }, 700);
    });
  },
};

// User service
export const userService = {
  async updateProfile(userId, profileData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const userIndex = mockData.users.findIndex(u => u.id === userId);
        if (userIndex !== -1) {
          mockData.users[userIndex] = { ...mockData.users[userIndex], ...profileData };
          const { password: _, ...userData } = mockData.users[userIndex];
          resolve({
            success: true,
            data: { user: userData },
          });
        } else {
          reject(new Error('User not found'));
        }
      }, 800);
    });
  },

  async updateSettings(userId, settings) {
    return new Promise((resolve) => {
      setTimeout(() => {
        mockData.settings = { ...mockData.settings, ...settings };
        resolve({
          success: true,
          data: { settings: mockData.settings },
        });
      }, 500);
    });
  },
};

export default mockData; 