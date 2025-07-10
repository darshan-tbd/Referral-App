import { createNotification, createNotificationStats } from '../types/notification.js';
import { createApiResponse } from '../types/api.js';

const mockNotifications = [
  createNotification({
    id: '1',
    userId: '1',
    type: 'visa_progress',
    title: 'Visa Progress Update',
    message: 'Your visa application has moved to the Assessment stage.',
    data: {
      visaStage: 'assessment',
      actionUrl: '/progress',
      actionText: 'View Progress',
    },
    read: false,
    createdAt: '2024-01-15T08:30:00Z',
    updatedAt: '2024-01-15T08:30:00Z',
  }),
  createNotification({
    id: '2',
    userId: '1',
    type: 'referral_submitted',
    title: 'Referral Submitted',
    message: 'Your referral for Alice Johnson has been submitted successfully.',
    data: {
      referralId: '1',
      referralCode: 'REF-ALI123',
      referredName: 'Alice Johnson',
      actionUrl: '/referrals',
      actionText: 'View Referrals',
    },
    read: true,
    readAt: '2024-01-10T12:00:00Z',
    createdAt: '2024-01-05T14:20:00Z',
    updatedAt: '2024-01-10T12:00:00Z',
  }),
  createNotification({
    id: '3',
    userId: '1',
    type: 'referral_status_update',
    title: 'Referral Status Update',
    message: 'Your referral for Alice Johnson has been converted!',
    data: {
      referralId: '1',
      referralCode: 'REF-ALI123',
      referredName: 'Alice Johnson',
      actionUrl: '/referrals/1',
      actionText: 'View Details',
    },
    read: false,
    createdAt: '2024-01-10T16:45:00Z',
    updatedAt: '2024-01-10T16:45:00Z',
  }),
  createNotification({
    id: '4',
    userId: '2',
    type: 'document_request',
    title: 'Document Request',
    message: 'Please upload your passport copy to continue with your application.',
    data: {
      actionUrl: '/documents',
      actionText: 'Upload Documents',
    },
    read: false,
    createdAt: '2024-01-12T10:15:00Z',
    updatedAt: '2024-01-12T10:15:00Z',
  }),
];

export class MockNotificationService {
  static async handleRequest(method, url, data) {
    const timestamp = new Date().toISOString();

    try {
      if (method === 'GET' && url.startsWith('/users/') && url.endsWith('/notifications')) {
        const userId = url.split('/')[2];
        return this.getUserNotifications(userId);
      } else if (method === 'PATCH' && url.startsWith('/notifications/')) {
        const notificationId = url.split('/')[2];
        return this.markAsRead(notificationId);
      } else if (method === 'GET' && url.startsWith('/users/') && url.endsWith('/notification-stats')) {
        const userId = url.split('/')[2];
        return this.getNotificationStats(userId);
      } else if (method === 'POST' && url === '/notifications') {
        return this.createNotification(data);
      }

      throw new Error('Endpoint not found');
    } catch (error) {
      return createApiResponse(null, error.message, 400);
    }
  }

  static async getUserNotifications(userId) {
    const userNotifications = mockNotifications
      .filter(n => n.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return createApiResponse(userNotifications, 'Notifications retrieved successfully', 200);
  }

  static async markAsRead(notificationId) {
    const notificationIndex = mockNotifications.findIndex(n => n.id === notificationId);
    
    if (notificationIndex === -1) {
      throw new Error('Notification not found');
    }

    const updatedNotification = createNotification({
      ...mockNotifications[notificationIndex],
      read: true,
      readAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    mockNotifications[notificationIndex] = updatedNotification;

    return createApiResponse(updatedNotification, 'Notification marked as read', 200);
  }

  static async getNotificationStats(userId) {
    const userNotifications = mockNotifications.filter(n => n.userId === userId);

    const stats = createNotificationStats({
      total: userNotifications.length,
      unread: userNotifications.filter(n => !n.read).length,
      read: userNotifications.filter(n => n.read).length,
      recent: userNotifications.slice(0, 5),
    });

    return createApiResponse(stats, 'Notification stats retrieved successfully', 200);
  }

  static async createNotification(data) {
    const newNotification = createNotification({
      id: (mockNotifications.length + 1).toString(),
      userId: data.userId,
      type: data.type,
      title: data.title,
      message: data.message,
      data: data.data,
      read: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    mockNotifications.push(newNotification);

    return createApiResponse(newNotification, 'Notification created successfully', 201);
  }
} 