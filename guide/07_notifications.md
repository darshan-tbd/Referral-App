# Notifications System Guide

## 🔔 Overview

This guide covers the comprehensive notification system for the Referral Client App, designed to keep users informed about their visa process, referral updates, and important announcements. The system starts with in-app notifications and is architected for future expansion to email and push notifications.

## 🏗️ Architecture

### Current Implementation (In-App Only)
```
┌─────────────────────────────────────────────────────────────┐
│                    Client Applications                       │
├─────────────────────────────────────────────────────────────┤
│  Notification Context  │  Notification UI  │  Local Storage │
├─────────────────────────────────────────────────────────────┤
│                   Notification Service                      │
├─────────────────────────────────────────────────────────────┤
│                    Mock/Django API                          │
└─────────────────────────────────────────────────────────────┘
```

### Future Implementation (Multi-Channel)
```
┌─────────────────────────────────────────────────────────────┐
│                    Client Applications                       │
├─────────────────────────────────────────────────────────────┤
│                   Notification Hub                          │
├─────────────────────────────────────────────────────────────┤
│  In-App  │  Email Service  │  Push Service  │  SMS Service  │
├─────────────────────────────────────────────────────────────┤
│                    Notification Queue                       │
├─────────────────────────────────────────────────────────────┤
│                    Django Backend                           │
└─────────────────────────────────────────────────────────────┘
```

## 📱 In-App Notification System

### Notification Types
```typescript
// types/notification.ts
export interface NotificationConfig {
  types: {
    status_update: {
      name: 'Status Update';
      description: 'Visa application status changes';
      icon: 'trending-up';
      color: 'blue';
      priority: 'high';
    };
    reminder: {
      name: 'Reminder';
      description: 'Document submissions and deadlines';
      icon: 'clock';
      color: 'orange';
      priority: 'medium';
    };
    referral: {
      name: 'Referral';
      description: 'Referral status updates';
      icon: 'user-plus';
      color: 'green';
      priority: 'medium';
    };
    system: {
      name: 'System';
      description: 'System announcements and updates';
      icon: 'settings';
      color: 'gray';
      priority: 'low';
    };
    promotional: {
      name: 'Promotional';
      description: 'Special offers and announcements';
      icon: 'gift';
      color: 'purple';
      priority: 'low';
    };
  };
}

export interface NotificationTemplate {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  variables: string[];
  channels: NotificationChannel[];
  priority: NotificationPriority;
  autoExpire: boolean;
  expiresInHours?: number;
}
```

### Notification Service
```typescript
// services/NotificationService.ts
import { Notification, NotificationTemplate } from '../types/notification';
import { mockDatabase } from '../data/mockDatabase';
import ApiService from './ApiService';

class NotificationService {
  private templates: Map<string, NotificationTemplate> = new Map();
  private subscribers: Map<string, (notification: Notification) => void> = new Map();

  constructor() {
    this.initializeTemplates();
  }

  private initializeTemplates() {
    const templates: NotificationTemplate[] = [
      {
        id: 'visa_status_update',
        type: 'status_update',
        title: 'Visa Status Update',
        message: 'Your visa application has moved to {{stage}} stage.',
        variables: ['stage'],
        channels: ['in_app', 'email'],
        priority: 'high',
        autoExpire: false
      },
      {
        id: 'document_reminder',
        type: 'reminder',
        title: 'Document Submission Reminder',
        message: 'Please submit your {{document}} by {{deadline}}.',
        variables: ['document', 'deadline'],
        channels: ['in_app', 'email', 'push'],
        priority: 'medium',
        autoExpire: true,
        expiresInHours: 24
      },
      {
        id: 'referral_status',
        type: 'referral',
        title: 'Referral Update',
        message: 'Your referral {{name}} has been {{status}}.',
        variables: ['name', 'status'],
        channels: ['in_app'],
        priority: 'medium',
        autoExpire: false
      }
    ];

    templates.forEach(template => {
      this.templates.set(template.id, template);
    });
  }

  // Get notifications for a user
  async getUserNotifications(userId: string): Promise<Notification[]> {
    try {
      if (process.env.NODE_ENV === 'development') {
        return mockDatabase.getNotificationsByUserId(userId);
      } else {
        const response = await ApiService.get(`/users/${userId}/notifications`);
        return response.data;
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      throw error;
    }
  }

  // Create a new notification
  async createNotification(
    userId: string,
    templateId: string,
    variables: Record<string, string> = {},
    options: Partial<Notification> = {}
  ): Promise<Notification> {
    const template = this.templates.get(templateId);
    if (!template) {
      throw new Error(`Template ${templateId} not found`);
    }

    const notification: Partial<Notification> = {
      userId,
      title: this.interpolateTemplate(template.title, variables),
      message: this.interpolateTemplate(template.message, variables),
      type: template.type,
      priority: template.priority,
      expiresAt: template.autoExpire 
        ? new Date(Date.now() + (template.expiresInHours || 24) * 60 * 60 * 1000).toISOString()
        : undefined,
      ...options
    };

    try {
      let createdNotification: Notification;
      if (process.env.NODE_ENV === 'development') {
        createdNotification = await mockDatabase.createNotification(notification);
      } else {
        const response = await ApiService.post('/notifications', notification);
        createdNotification = response.data;
      }

      // Notify subscribers
      this.notifySubscribers(createdNotification);
      
      return createdNotification;
    } catch (error) {
      console.error('Failed to create notification:', error);
      throw error;
    }
  }

  // Mark notification as read
  async markAsRead(notificationId: string): Promise<void> {
    try {
      if (process.env.NODE_ENV === 'development') {
        await mockDatabase.markNotificationAsRead(notificationId);
      } else {
        await ApiService.patch(`/notifications/${notificationId}`, { read: true });
      }
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      throw error;
    }
  }

  // Mark all notifications as read
  async markAllAsRead(userId: string): Promise<void> {
    try {
      if (process.env.NODE_ENV === 'development') {
        const notifications = await mockDatabase.getNotificationsByUserId(userId);
        await Promise.all(
          notifications
            .filter(n => !n.read)
            .map(n => mockDatabase.markNotificationAsRead(n.id))
        );
      } else {
        await ApiService.patch(`/users/${userId}/notifications/mark-all-read`);
      }
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
      throw error;
    }
  }

  // Archive notification
  async archiveNotification(notificationId: string): Promise<void> {
    try {
      if (process.env.NODE_ENV === 'development') {
        // Mock implementation
        console.log(`Archiving notification ${notificationId}`);
      } else {
        await ApiService.patch(`/notifications/${notificationId}`, { archived: true });
      }
    } catch (error) {
      console.error('Failed to archive notification:', error);
      throw error;
    }
  }

  // Delete notification
  async deleteNotification(notificationId: string): Promise<void> {
    try {
      if (process.env.NODE_ENV === 'development') {
        // Mock implementation
        console.log(`Deleting notification ${notificationId}`);
      } else {
        await ApiService.delete(`/notifications/${notificationId}`);
      }
    } catch (error) {
      console.error('Failed to delete notification:', error);
      throw error;
    }
  }

  // Get notification statistics
  async getNotificationStats(userId: string): Promise<{
    total: number;
    unread: number;
    byType: Record<string, number>;
  }> {
    const notifications = await this.getUserNotifications(userId);
    
    return {
      total: notifications.length,
      unread: notifications.filter(n => !n.read).length,
      byType: notifications.reduce((acc, n) => {
        acc[n.type] = (acc[n.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    };
  }

  // Subscribe to real-time notifications
  subscribe(userId: string, callback: (notification: Notification) => void): () => void {
    const subscriptionId = `${userId}-${Date.now()}`;
    this.subscribers.set(subscriptionId, callback);
    
    return () => {
      this.subscribers.delete(subscriptionId);
    };
  }

  // Utility methods
  private interpolateTemplate(template: string, variables: Record<string, string>): string {
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return variables[key] || match;
    });
  }

  private notifySubscribers(notification: Notification): void {
    this.subscribers.forEach(callback => {
      try {
        callback(notification);
      } catch (error) {
        console.error('Error in notification subscriber:', error);
      }
    });
  }
}

export default new NotificationService();
```

### Notification Context
```typescript
// context/NotificationContext.tsx
import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { Notification } from '../types/notification';
import NotificationService from '../services/NotificationService';
import { useAuth } from './AuthContext';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
}

interface NotificationContextType {
  state: NotificationState;
  actions: {
    refreshNotifications: () => Promise<void>;
    markAsRead: (id: string) => Promise<void>;
    markAllAsRead: () => Promise<void>;
    archiveNotification: (id: string) => Promise<void>;
    deleteNotification: (id: string) => Promise<void>;
    createNotification: (templateId: string, variables?: Record<string, string>) => Promise<void>;
  };
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};

type NotificationAction = 
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_NOTIFICATIONS'; payload: Notification[] }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'UPDATE_NOTIFICATION'; payload: { id: string; updates: Partial<Notification> } }
  | { type: 'REMOVE_NOTIFICATION'; payload: string };

const notificationReducer = (state: NotificationState, action: NotificationAction): NotificationState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    case 'SET_NOTIFICATIONS':
      return {
        ...state,
        notifications: action.payload,
        unreadCount: action.payload.filter(n => !n.read).length
      };
    
    case 'ADD_NOTIFICATION':
      const newNotifications = [action.payload, ...state.notifications];
      return {
        ...state,
        notifications: newNotifications,
        unreadCount: newNotifications.filter(n => !n.read).length
      };
    
    case 'UPDATE_NOTIFICATION':
      const updatedNotifications = state.notifications.map(n =>
        n.id === action.payload.id ? { ...n, ...action.payload.updates } : n
      );
      return {
        ...state,
        notifications: updatedNotifications,
        unreadCount: updatedNotifications.filter(n => !n.read).length
      };
    
    case 'REMOVE_NOTIFICATION':
      const filteredNotifications = state.notifications.filter(n => n.id !== action.payload);
      return {
        ...state,
        notifications: filteredNotifications,
        unreadCount: filteredNotifications.filter(n => !n.read).length
      };
    
    default:
      return state;
  }
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, {
    notifications: [],
    unreadCount: 0,
    loading: false,
    error: null
  });

  const { user } = useAuth();

  const refreshNotifications = useCallback(async () => {
    if (!user) return;
    
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    
    try {
      const notifications = await NotificationService.getUserNotifications(user.id);
      dispatch({ type: 'SET_NOTIFICATIONS', payload: notifications });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [user]);

  const markAsRead = useCallback(async (id: string) => {
    try {
      await NotificationService.markAsRead(id);
      dispatch({ 
        type: 'UPDATE_NOTIFICATION', 
        payload: { id, updates: { read: true, readAt: new Date().toISOString() } }
      });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    if (!user) return;
    
    try {
      await NotificationService.markAllAsRead(user.id);
      const updatedNotifications = state.notifications.map(n => ({
        ...n,
        read: true,
        readAt: new Date().toISOString()
      }));
      dispatch({ type: 'SET_NOTIFICATIONS', payload: updatedNotifications });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  }, [user, state.notifications]);

  const archiveNotification = useCallback(async (id: string) => {
    try {
      await NotificationService.archiveNotification(id);
      dispatch({ 
        type: 'UPDATE_NOTIFICATION', 
        payload: { id, updates: { archived: true, archivedAt: new Date().toISOString() } }
      });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  }, []);

  const deleteNotification = useCallback(async (id: string) => {
    try {
      await NotificationService.deleteNotification(id);
      dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  }, []);

  const createNotification = useCallback(async (
    templateId: string, 
    variables: Record<string, string> = {}
  ) => {
    if (!user) return;
    
    try {
      const notification = await NotificationService.createNotification(
        user.id,
        templateId,
        variables
      );
      dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  }, [user]);

  // Subscribe to real-time notifications
  useEffect(() => {
    if (!user) return;
    
    const unsubscribe = NotificationService.subscribe(user.id, (notification) => {
      dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
    });
    
    return unsubscribe;
  }, [user]);

  // Initial load
  useEffect(() => {
    refreshNotifications();
  }, [refreshNotifications]);

  const actions = {
    refreshNotifications,
    markAsRead,
    markAllAsRead,
    archiveNotification,
    deleteNotification,
    createNotification
  };

  return (
    <NotificationContext.Provider value={{ state, actions }}>
      {children}
    </NotificationContext.Provider>
  );
};
```

## 🎨 UI Components

### Notification Bell Component
```tsx
// components/notifications/NotificationBell.tsx
import React from 'react';
import { Bell, BellRing } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/Popover';
import { NotificationList } from './NotificationList';

export const NotificationBell: React.FC = () => {
  const { state } = useNotifications();
  const { unreadCount } = state;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          {unreadCount > 0 ? (
            <BellRing className="h-5 w-5" />
          ) : (
            <Bell className="h-5 w-5" />
          )}
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4 border-b">
          <h3 className="font-semibold">Notifications</h3>
          {unreadCount > 0 && (
            <p className="text-sm text-muted-foreground">
              {unreadCount} unread notification{unreadCount === 1 ? '' : 's'}
            </p>
          )}
        </div>
        <NotificationList maxHeight="400px" />
      </PopoverContent>
    </Popover>
  );
};
```

### Notification List Component
```tsx
// components/notifications/NotificationList.tsx
import React from 'react';
import { format } from 'date-fns';
import { Check, Archive, Trash2, Bell } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';
import { Button } from '../ui/Button';
import { ScrollArea } from '../ui/ScrollArea';
import { cn } from '../../utils/cn';

interface NotificationListProps {
  maxHeight?: string;
  showActions?: boolean;
}

export const NotificationList: React.FC<NotificationListProps> = ({
  maxHeight = '100%',
  showActions = true
}) => {
  const { state, actions } = useNotifications();
  const { notifications, loading } = state;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'status_update':
        return '📊';
      case 'reminder':
        return '⏰';
      case 'referral':
        return '👥';
      case 'system':
        return '⚙️';
      case 'promotional':
        return '🎁';
      default:
        return '🔔';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-red-500';
      case 'medium':
        return 'border-yellow-500';
      case 'low':
        return 'border-gray-300';
      default:
        return 'border-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <Bell className="h-12 w-12 text-gray-400 mb-4" />
        <p className="text-gray-600 font-medium">No notifications yet</p>
        <p className="text-sm text-gray-500">
          You'll receive updates about your visa application here
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className={cn('p-0', maxHeight && `max-h-[${maxHeight}]`)}>
      <div className="space-y-1">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={cn(
              'p-4 border-l-4 hover:bg-gray-50 transition-colors',
              notification.read ? 'bg-white' : 'bg-blue-50',
              getPriorityColor(notification.priority)
            )}
          >
            <div className="flex items-start gap-3">
              <div className="text-xl">{getNotificationIcon(notification.type)}</div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <h4 className={cn(
                    'text-sm font-medium text-gray-900 truncate',
                    !notification.read && 'font-semibold'
                  )}>
                    {notification.title}
                  </h4>
                  
                  <div className="flex items-center gap-1 ml-2">
                    {!notification.read && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    )}
                    
                    {showActions && (
                      <div className="flex gap-1">
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => actions.markAsRead(notification.id)}
                            className="h-6 w-6 p-0"
                          >
                            <Check className="h-3 w-3" />
                          </Button>
                        )}
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => actions.archiveNotification(notification.id)}
                          className="h-6 w-6 p-0"
                        >
                          <Archive className="h-3 w-3" />
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => actions.deleteNotification(notification.id)}
                          className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                  {notification.message}
                </p>
                
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-500">
                    {format(new Date(notification.createdAt), 'MMM d, yyyy • h:mm a')}
                  </span>
                  
                  {notification.actionUrl && (
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="text-xs h-6"
                    >
                      <a href={notification.actionUrl}>
                        {notification.actionText || 'View'}
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};
```

## 🚀 Future Expansion: Email & Push Notifications

### Email Notification Service
```typescript
// services/EmailNotificationService.ts
interface EmailTemplate {
  id: string;
  subject: string;
  htmlBody: string;
  textBody: string;
  variables: string[];
}

class EmailNotificationService {
  private templates: Map<string, EmailTemplate> = new Map();

  constructor() {
    this.initializeTemplates();
  }

  private initializeTemplates() {
    // Email templates for different notification types
    const templates: EmailTemplate[] = [
      {
        id: 'visa_status_update',
        subject: 'Visa Status Update - {{stage}}',
        htmlBody: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Visa Status Update</h2>
            <p>Dear {{name}},</p>
            <p>Your visa application has moved to <strong>{{stage}}</strong> stage.</p>
            <div style="background-color: #f0f8ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3>What's Next?</h3>
              <p>{{nextStepsDescription}}</p>
            </div>
            <p>You can track your progress anytime in the app.</p>
            <a href="{{appUrl}}" style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
              View in App
            </a>
          </div>
        `,
        textBody: `
          Visa Status Update
          
          Dear {{name}},
          
          Your visa application has moved to {{stage}} stage.
          
          What's Next?
          {{nextStepsDescription}}
          
          You can track your progress anytime in the app: {{appUrl}}
        `,
        variables: ['name', 'stage', 'nextStepsDescription', 'appUrl']
      }
    ];

    templates.forEach(template => {
      this.templates.set(template.id, template);
    });
  }

  async sendEmail(
    to: string,
    templateId: string,
    variables: Record<string, string>
  ): Promise<void> {
    const template = this.templates.get(templateId);
    if (!template) {
      throw new Error(`Email template ${templateId} not found`);
    }

    const emailData = {
      to,
      subject: this.interpolateTemplate(template.subject, variables),
      htmlBody: this.interpolateTemplate(template.htmlBody, variables),
      textBody: this.interpolateTemplate(template.textBody, variables)
    };

    try {
      // This would integrate with your email service provider
      // Examples: SendGrid, AWS SES, Nodemailer, etc.
      await this.sendEmailViaProvider(emailData);
      console.log(`Email sent successfully to ${to}`);
    } catch (error) {
      console.error('Failed to send email:', error);
      throw error;
    }
  }

  private async sendEmailViaProvider(emailData: any): Promise<void> {
    // Implementation depends on your email service provider
    // Example with SendGrid:
    /*
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    
    const msg = {
      to: emailData.to,
      from: process.env.FROM_EMAIL,
      subject: emailData.subject,
      text: emailData.textBody,
      html: emailData.htmlBody,
    };
    
    await sgMail.send(msg);
    */
  }

  private interpolateTemplate(template: string, variables: Record<string, string>): string {
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return variables[key] || match;
    });
  }
}

export default new EmailNotificationService();
```

### Push Notification Service
```typescript
// services/PushNotificationService.ts
import { Expo } from 'expo-server-sdk';

class PushNotificationService {
  private expo: Expo;

  constructor() {
    this.expo = new Expo();
  }

  async sendPushNotification(
    pushToken: string,
    title: string,
    body: string,
    data?: Record<string, any>
  ): Promise<void> {
    if (!Expo.isExpoPushToken(pushToken)) {
      console.error(`Invalid push token: ${pushToken}`);
      return;
    }

    const message = {
      to: pushToken,
      sound: 'default',
      title,
      body,
      data,
      badge: 1,
      priority: 'high',
      channelId: 'default'
    };

    try {
      const ticket = await this.expo.sendPushNotificationsAsync([message]);
      console.log('Push notification sent:', ticket);
    } catch (error) {
      console.error('Failed to send push notification:', error);
      throw error;
    }
  }

  async sendBatchPushNotifications(
    notifications: Array<{
      pushToken: string;
      title: string;
      body: string;
      data?: Record<string, any>;
    }>
  ): Promise<void> {
    const messages = notifications
      .filter(n => Expo.isExpoPushToken(n.pushToken))
      .map(n => ({
        to: n.pushToken,
        sound: 'default',
        title: n.title,
        body: n.body,
        data: n.data,
        badge: 1,
        priority: 'high',
        channelId: 'default'
      }));

    if (messages.length === 0) {
      console.log('No valid push tokens found');
      return;
    }

    try {
      const chunks = this.expo.chunkPushNotifications(messages);
      const tickets = [];

      for (const chunk of chunks) {
        const ticketChunk = await this.expo.sendPushNotificationsAsync(chunk);
        tickets.push(...ticketChunk);
      }

      console.log(`Sent ${tickets.length} push notifications`);
    } catch (error) {
      console.error('Failed to send batch push notifications:', error);
      throw error;
    }
  }
}

export default new PushNotificationService();
```

### Multi-Channel Notification Hub
```typescript
// services/NotificationHub.ts
import NotificationService from './NotificationService';
import EmailNotificationService from './EmailNotificationService';
import PushNotificationService from './PushNotificationService';
import { NotificationChannel } from '../types/notification';

class NotificationHub {
  async sendNotification(
    userId: string,
    templateId: string,
    variables: Record<string, string>,
    channels: NotificationChannel[] = ['in_app']
  ): Promise<void> {
    const user = await this.getUserById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const promises = channels.map(channel => {
      switch (channel) {
        case 'in_app':
          return NotificationService.createNotification(userId, templateId, variables);
        
        case 'email':
          return EmailNotificationService.sendEmail(user.email, templateId, {
            ...variables,
            name: user.name,
            appUrl: process.env.APP_URL
          });
        
        case 'push':
          if (user.pushToken) {
            const template = this.getTemplate(templateId);
            return PushNotificationService.sendPushNotification(
              user.pushToken,
              template.title,
              template.message,
              { templateId, userId }
            );
          }
          return Promise.resolve();
        
        default:
          return Promise.resolve();
      }
    });

    await Promise.all(promises);
  }

  private async getUserById(userId: string): Promise<any> {
    // Implementation depends on your user service
    // This would fetch user data including email and push token
    return null;
  }

  private getTemplate(templateId: string): any {
    // Get template configuration
    return null;
  }
}

export default new NotificationHub();
```

## 🛠️ Integration with Django

### Django Notification Models
```python
# models.py
from django.db import models
from django.contrib.auth.models import User
import uuid

class NotificationTemplate(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    type = models.CharField(max_length=50)
    title = models.CharField(max_length=255)
    message = models.TextField()
    variables = models.JSONField(default=list)
    channels = models.JSONField(default=list)
    priority = models.CharField(max_length=20, default='medium')
    auto_expire = models.BooleanField(default=False)
    expires_in_hours = models.IntegerField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class Notification(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    template = models.ForeignKey(NotificationTemplate, on_delete=models.CASCADE, null=True, blank=True)
    
    title = models.CharField(max_length=255)
    message = models.TextField()
    type = models.CharField(max_length=50)
    priority = models.CharField(max_length=20, default='medium')
    
    read = models.BooleanField(default=False)
    read_at = models.DateTimeField(null=True, blank=True)
    archived = models.BooleanField(default=False)
    archived_at = models.DateTimeField(null=True, blank=True)
    
    delivered = models.BooleanField(default=False)
    delivered_at = models.DateTimeField(null=True, blank=True)
    delivery_method = models.CharField(max_length=50, default='in_app')
    
    expires_at = models.DateTimeField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class NotificationPreference(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    email_enabled = models.BooleanField(default=True)
    push_enabled = models.BooleanField(default=True)
    sms_enabled = models.BooleanField(default=False)
    
    notification_types = models.JSONField(default=dict)  # Type-specific preferences
    
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
from .models import Notification, NotificationPreference
from .serializers import NotificationSerializer

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_notifications(request):
    notifications = Notification.objects.filter(
        user=request.user,
        archived=False
    ).order_by('-created_at')
    
    serializer = NotificationSerializer(notifications, many=True)
    return Response(serializer.data)

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def mark_notification_read(request, notification_id):
    try:
        notification = Notification.objects.get(
            id=notification_id,
            user=request.user
        )
        notification.read = True
        notification.read_at = timezone.now()
        notification.save()
        
        return Response({'status': 'success'})
    except Notification.DoesNotExist:
        return Response(
            {'error': 'Notification not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_notification(request):
    serializer = NotificationSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(user=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
```

This comprehensive notification system provides a robust foundation for keeping users informed while maintaining the flexibility to expand to multiple channels as the application grows. 