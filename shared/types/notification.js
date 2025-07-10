// Notification types
export const NOTIFICATION_TYPES = [
  'visa_progress',
  'referral_submitted',
  'referral_status_update',
  'referral_converted',
  'system_update',
  'account_update',
  'payment_update',
  'document_request',
  'appointment_scheduled',
  'general'
];

export const createNotification = (notificationData) => ({
  id: notificationData.id || '',
  userId: notificationData.userId || '',
  type: notificationData.type || 'general',
  title: notificationData.title || '',
  message: notificationData.message || '',
  data: notificationData.data || {},
  read: notificationData.read !== undefined ? notificationData.read : false,
  readAt: notificationData.readAt || null,
  createdAt: notificationData.createdAt || new Date().toISOString(),
  updatedAt: notificationData.updatedAt || new Date().toISOString(),
});

export const createNotificationData = (data = {}) => ({
  referralId: data.referralId || null,
  referralCode: data.referralCode || null,
  referredName: data.referredName || null,
  visaStage: data.visaStage || null,
  actionUrl: data.actionUrl || null,
  actionText: data.actionText || null,
  ...data,
});

export const createNotificationPreferences = (preferencesData) => ({
  userId: preferencesData.userId || '',
  emailNotifications: preferencesData.emailNotifications !== undefined ? preferencesData.emailNotifications : true,
  pushNotifications: preferencesData.pushNotifications !== undefined ? preferencesData.pushNotifications : true,
  smsNotifications: preferencesData.smsNotifications !== undefined ? preferencesData.smsNotifications : false,
  notificationTypes: preferencesData.notificationTypes || NOTIFICATION_TYPES.reduce((acc, type) => {
    acc[type] = true;
    return acc;
  }, {}),
  quietHours: preferencesData.quietHours || {
    enabled: false,
    startTime: '22:00',
    endTime: '08:00',
  },
});

export const createNotificationStats = (statsData) => ({
  total: statsData.total || 0,
  unread: statsData.unread || 0,
  read: statsData.read || 0,
  recent: statsData.recent || [],
}); 