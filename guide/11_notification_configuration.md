# 11. Notification Configuration System

## Overview

This guide covers the implementation of a configurable notification system that allows both backend administrators and frontend users to control notification preferences while maintaining critical business notifications.

## 🔧 Backend Configuration (Django CRM)

### Notification Types

```python
# notifications/models.py
from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

class NotificationType(models.Model):
    TYPE_CHOICES = [
        ('blog', 'Blog Post'),
        ('news', 'News Update'),
        ('social', 'Social Media'),
        ('payment', 'Payment Reminder'),
        ('general', 'General Notification'),
        ('push', 'Push Notification'),
    ]
    
    name = models.CharField(max_length=50, choices=TYPE_CHOICES, unique=True)
    display_name = models.CharField(max_length=100)
    description = models.TextField()
    is_critical = models.BooleanField(default=False)  # Cannot be disabled
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.display_name

class NotificationTemplate(models.Model):
    notification_type = models.ForeignKey(NotificationType, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    content = models.TextField()
    email_template = models.TextField(blank=True)
    push_template = models.TextField(blank=True)
    whatsapp_template = models.TextField(blank=True)
    
    def __str__(self):
        return f"{self.notification_type.display_name} - {self.title}"

class ScheduledNotification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    notification_type = models.ForeignKey(NotificationType, on_delete=models.CASCADE)
    template = models.ForeignKey(NotificationTemplate, on_delete=models.CASCADE)
    scheduled_for = models.DateTimeField()
    is_sent = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['scheduled_for']
```

### User Notification Preferences

```python
# notifications/models.py
class UserNotificationPreference(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    blog_notifications = models.BooleanField(default=True)
    news_notifications = models.BooleanField(default=True)
    social_notifications = models.BooleanField(default=True)
    # Payment notifications are always enabled (critical)
    
    # Channel preferences
    email_enabled = models.BooleanField(default=True)
    push_enabled = models.BooleanField(default=True)
    whatsapp_enabled = models.BooleanField(default=False)
    
    def __str__(self):
        return f"{self.user.username} - Notification Preferences"
```

### Blog/News/Social Media Models

```python
# content/models.py
from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

class BlogPost(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    published_at = models.DateTimeField(null=True, blank=True)
    is_published = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def publish(self):
        self.is_published = True
        self.published_at = timezone.now()
        self.save()

class NewsUpdate(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    priority = models.CharField(max_length=20, choices=[
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
    ], default='medium')
    published_at = models.DateTimeField(auto_now_add=True)
    
class SocialMediaPost(models.Model):
    platform = models.CharField(max_length=50, choices=[
        ('facebook', 'Facebook'),
        ('instagram', 'Instagram'),
        ('twitter', 'Twitter'),
        ('linkedin', 'LinkedIn'),
    ])
    content = models.TextField()
    post_url = models.URLField()
    posted_at = models.DateTimeField(auto_now_add=True)
```

### Django Signals for Automatic Notifications

```python
# notifications/signals.py
from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from .models import NotificationType, ScheduledNotification
from .services import NotificationService
from content.models import BlogPost, NewsUpdate, SocialMediaPost

@receiver(post_save, sender=BlogPost)
def blog_post_published(sender, instance, created, **kwargs):
    if instance.is_published and instance.published_at:
        NotificationService.send_content_notification(
            content_type='blog',
            content_instance=instance,
            notification_type='blog'
        )

@receiver(post_save, sender=NewsUpdate)
def news_update_published(sender, instance, created, **kwargs):
    if created:
        NotificationService.send_content_notification(
            content_type='news',
            content_instance=instance,
            notification_type='news'
        )

@receiver(post_save, sender=SocialMediaPost)
def social_media_posted(sender, instance, created, **kwargs):
    if created:
        NotificationService.send_content_notification(
            content_type='social',
            content_instance=instance,
            notification_type='social'
        )

# Payment reminder scheduling
@receiver(post_save, sender='visa.VisaApplication')
def schedule_payment_reminders(sender, instance, **kwargs):
    if instance.status == 'payment_pending':
        NotificationService.schedule_payment_reminders(instance)
```

### Notification Service

```python
# notifications/services.py
import logging
from datetime import datetime, timedelta
from django.contrib.auth.models import User
from django.utils import timezone
from .models import NotificationType, ScheduledNotification, UserNotificationPreference
from .tasks import send_notification_task

logger = logging.getLogger(__name__)

class NotificationService:
    @staticmethod
    def send_content_notification(content_type, content_instance, notification_type):
        """Send notifications for new content (blog, news, social)"""
        try:
            notification_type_obj = NotificationType.objects.get(name=notification_type)
            
            # Get users who have this notification type enabled
            users_to_notify = User.objects.filter(
                is_active=True,
                usernotificationpreference__isnull=False
            )
            
            # Filter based on preference
            if notification_type == 'blog':
                users_to_notify = users_to_notify.filter(
                    usernotificationpreference__blog_notifications=True
                )
            elif notification_type == 'news':
                users_to_notify = users_to_notify.filter(
                    usernotificationpreference__news_notifications=True
                )
            elif notification_type == 'social':
                users_to_notify = users_to_notify.filter(
                    usernotificationpreference__social_notifications=True
                )
            
            for user in users_to_notify:
                NotificationService._create_notification(
                    user=user,
                    notification_type=notification_type_obj,
                    content_instance=content_instance
                )
                
        except Exception as e:
            logger.error(f"Error sending content notification: {str(e)}")
    
    @staticmethod
    def schedule_payment_reminders(visa_application):
        """Schedule payment reminder notifications"""
        try:
            notification_type = NotificationType.objects.get(name='payment')
            
            # Schedule reminders at 10 days, 5 days, and 1 day before due
            reminder_days = [10, 5, 1]
            
            for days in reminder_days:
                reminder_date = visa_application.payment_due_date - timedelta(days=days)
                
                if reminder_date > timezone.now():
                    ScheduledNotification.objects.create(
                        user=visa_application.user,
                        notification_type=notification_type,
                        scheduled_for=reminder_date,
                        content_object=visa_application
                    )
                    
        except Exception as e:
            logger.error(f"Error scheduling payment reminders: {str(e)}")
    
    @staticmethod
    def _create_notification(user, notification_type, content_instance):
        """Create and send immediate notification"""
        from .tasks import send_notification_task
        
        # Create notification record
        notification = ScheduledNotification.objects.create(
            user=user,
            notification_type=notification_type,
            scheduled_for=timezone.now()
        )
        
        # Send via Celery task (or synchronously if Celery not available)
        send_notification_task.delay(notification.id)
```

### Celery Tasks for Async Processing

```python
# notifications/tasks.py
from celery import shared_task
from django.contrib.auth.models import User
from .models import ScheduledNotification
from .utils import send_email, send_push_notification, send_whatsapp

@shared_task
def send_notification_task(notification_id):
    """Send notification via configured channels"""
    try:
        notification = ScheduledNotification.objects.get(id=notification_id)
        user = notification.user
        preferences = user.usernotificationpreference
        
        # Send via enabled channels
        if preferences.email_enabled:
            send_email(user, notification)
        
        if preferences.push_enabled:
            send_push_notification(user, notification)
        
        if preferences.whatsapp_enabled:
            send_whatsapp(user, notification)
        
        # Mark as sent
        notification.is_sent = True
        notification.save()
        
    except Exception as e:
        logger.error(f"Error sending notification {notification_id}: {str(e)}")

@shared_task
def process_scheduled_notifications():
    """Process notifications scheduled for now"""
    pending_notifications = ScheduledNotification.objects.filter(
        scheduled_for__lte=timezone.now(),
        is_sent=False
    )
    
    for notification in pending_notifications:
        send_notification_task.delay(notification.id)
```

### Admin Configuration Interface

```python
# notifications/admin.py
from django.contrib import admin
from .models import NotificationType, NotificationTemplate, ScheduledNotification

@admin.register(NotificationType)
class NotificationTypeAdmin(admin.ModelAdmin):
    list_display = ['name', 'display_name', 'is_critical', 'is_active']
    list_filter = ['is_critical', 'is_active']
    
@admin.register(NotificationTemplate)
class NotificationTemplateAdmin(admin.ModelAdmin):
    list_display = ['notification_type', 'title']
    list_filter = ['notification_type']
    
@admin.register(ScheduledNotification)
class ScheduledNotificationAdmin(admin.ModelAdmin):
    list_display = ['user', 'notification_type', 'scheduled_for', 'is_sent']
    list_filter = ['notification_type', 'is_sent', 'scheduled_for']
    readonly_fields = ['created_at']
```

## 📱 Frontend Configuration (Client App)

### Settings Context

```typescript
// src/contexts/SettingsContext.tsx
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { settingsService } from '../services/settingsService';

interface NotificationSettings {
  blogNotifications: boolean;
  newsNotifications: boolean;
  socialNotifications: boolean;
  emailEnabled: boolean;
  pushEnabled: boolean;
  whatsappEnabled: boolean;
}

interface SettingsState {
  notifications: NotificationSettings;
  isLoading: boolean;
  error: string | null;
}

interface SettingsContextValue {
  settings: SettingsState;
  updateNotificationSetting: (key: keyof NotificationSettings, value: boolean) => Promise<void>;
  resetSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

const initialState: SettingsState = {
  notifications: {
    blogNotifications: true,
    newsNotifications: true,
    socialNotifications: true,
    emailEnabled: true,
    pushEnabled: true,
    whatsappEnabled: false,
  },
  isLoading: false,
  error: null,
};

type SettingsAction = 
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_NOTIFICATIONS'; payload: NotificationSettings }
  | { type: 'UPDATE_NOTIFICATION_SETTING'; payload: { key: keyof NotificationSettings; value: boolean } };

const settingsReducer = (state: SettingsState, action: SettingsAction): SettingsState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_NOTIFICATIONS':
      return { ...state, notifications: action.payload };
    case 'UPDATE_NOTIFICATION_SETTING':
      return {
        ...state,
        notifications: {
          ...state.notifications,
          [action.payload.key]: action.payload.value,
        },
      };
    default:
      return state;
  }
};

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, dispatch] = useReducer(settingsReducer, initialState);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const userSettings = await settingsService.getUserSettings();
      dispatch({ type: 'SET_NOTIFICATIONS', payload: userSettings.notifications });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load settings' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const updateNotificationSetting = async (key: keyof NotificationSettings, value: boolean) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await settingsService.updateNotificationSetting(key, value);
      dispatch({ type: 'UPDATE_NOTIFICATION_SETTING', payload: { key, value } });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update setting' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const resetSettings = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await settingsService.resetSettings();
      dispatch({ type: 'SET_NOTIFICATIONS', payload: initialState.notifications });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to reset settings' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  return (
    <SettingsContext.Provider value={{ settings, updateNotificationSetting, resetSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};
```

### Settings Service

```typescript
// src/services/settingsService.ts
import { apiClient } from './apiClient';
import { NotificationSettings } from '../contexts/SettingsContext';

interface UserSettings {
  notifications: NotificationSettings;
}

export const settingsService = {
  async getUserSettings(): Promise<UserSettings> {
    const response = await apiClient.get('/settings/');
    return response.data;
  },

  async updateNotificationSetting(key: keyof NotificationSettings, value: boolean): Promise<void> {
    await apiClient.patch('/settings/notifications/', {
      [key]: value,
    });
  },

  async resetSettings(): Promise<void> {
    await apiClient.post('/settings/reset/');
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await apiClient.post('/auth/change-password/', {
      current_password: currentPassword,
      new_password: newPassword,
    });
  },
};
```

### React Native Settings Screen

```tsx
// src/screens/SettingsScreen.tsx
import React, { useState } from 'react';
import {
  VStack,
  HStack,
  Text,
  Switch,
  Button,
  Input,
  FormControl,
  ScrollView,
  Alert,
  Divider,
  useToast,
} from 'native-base';
import { useSettings } from '../contexts/SettingsContext';
import { settingsService } from '../services/settingsService';

export const SettingsScreen: React.FC = () => {
  const { settings, updateNotificationSetting } = useSettings();
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const toast = useToast();

  const handleToggleNotification = async (key: keyof NotificationSettings, value: boolean) => {
    try {
      await updateNotificationSetting(key, value);
      toast.show({
        title: 'Setting updated successfully',
        status: 'success',
      });
    } catch (error) {
      toast.show({
        title: 'Failed to update setting',
        status: 'error',
      });
    }
  };

  const handlePasswordChange = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.show({
        title: 'Passwords do not match',
        status: 'error',
      });
      return;
    }

    try {
      await settingsService.changePassword(passwordForm.currentPassword, passwordForm.newPassword);
      toast.show({
        title: 'Password changed successfully',
        status: 'success',
      });
      setShowPasswordForm(false);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.show({
        title: 'Failed to change password',
        status: 'error',
      });
    }
  };

  return (
    <ScrollView flex={1} bg="white" p={4}>
      <VStack space={6}>
        <Text fontSize="2xl" fontWeight="bold">Settings</Text>
        
        {/* Notification Preferences */}
        <VStack space={4}>
          <Text fontSize="lg" fontWeight="semibold">Notification Preferences</Text>
          
          <HStack justifyContent="space-between" alignItems="center">
            <VStack flex={1}>
              <Text fontWeight="medium">Blog Notifications</Text>
              <Text fontSize="sm" color="gray.600">
                Get notified about new blog posts
              </Text>
            </VStack>
            <Switch
              value={settings.notifications.blogNotifications}
              onValueChange={(value) => handleToggleNotification('blogNotifications', value)}
            />
          </HStack>

          <HStack justifyContent="space-between" alignItems="center">
            <VStack flex={1}>
              <Text fontWeight="medium">News Updates</Text>
              <Text fontSize="sm" color="gray.600">
                Receive latest news and updates
              </Text>
            </VStack>
            <Switch
              value={settings.notifications.newsNotifications}
              onValueChange={(value) => handleToggleNotification('newsNotifications', value)}
            />
          </HStack>

          <HStack justifyContent="space-between" alignItems="center">
            <VStack flex={1}>
              <Text fontWeight="medium">Social Media Alerts</Text>
              <Text fontSize="sm" color="gray.600">
                Notifications for social media posts
              </Text>
            </VStack>
            <Switch
              value={settings.notifications.socialNotifications}
              onValueChange={(value) => handleToggleNotification('socialNotifications', value)}
            />
          </HStack>

          <HStack justifyContent="space-between" alignItems="center">
            <VStack flex={1}>
              <Text fontWeight="medium">Payment Reminders</Text>
              <Text fontSize="sm" color="gray.600">
                Critical payment notifications (cannot be disabled)
              </Text>
            </VStack>
            <Switch
              value={true}
              isDisabled={true}
              opacity={0.5}
            />
          </HStack>
        </VStack>

        <Divider />

        {/* Notification Channels */}
        <VStack space={4}>
          <Text fontSize="lg" fontWeight="semibold">Notification Channels</Text>
          
          <HStack justifyContent="space-between" alignItems="center">
            <Text fontWeight="medium">Email Notifications</Text>
            <Switch
              value={settings.notifications.emailEnabled}
              onValueChange={(value) => handleToggleNotification('emailEnabled', value)}
            />
          </HStack>

          <HStack justifyContent="space-between" alignItems="center">
            <Text fontWeight="medium">Push Notifications</Text>
            <Switch
              value={settings.notifications.pushEnabled}
              onValueChange={(value) => handleToggleNotification('pushEnabled', value)}
            />
          </HStack>

          <HStack justifyContent="space-between" alignItems="center">
            <Text fontWeight="medium">WhatsApp Notifications</Text>
            <Switch
              value={settings.notifications.whatsappEnabled}
              onValueChange={(value) => handleToggleNotification('whatsappEnabled', value)}
            />
          </HStack>
        </VStack>

        <Divider />

        {/* Password Section */}
        <VStack space={4}>
          <Text fontSize="lg" fontWeight="semibold">Security</Text>
          
          {!showPasswordForm ? (
            <Button
              variant="outline"
              onPress={() => setShowPasswordForm(true)}
            >
              Change Password
            </Button>
          ) : (
            <VStack space={3}>
              <FormControl>
                <FormControl.Label>Current Password</FormControl.Label>
                <Input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChangeText={(text) => setPasswordForm({ ...passwordForm, currentPassword: text })}
                />
              </FormControl>

              <FormControl>
                <FormControl.Label>New Password</FormControl.Label>
                <Input
                  type="password"
                  value={passwordForm.newPassword}
                  onChangeText={(text) => setPasswordForm({ ...passwordForm, newPassword: text })}
                />
              </FormControl>

              <FormControl>
                <FormControl.Label>Confirm New Password</FormControl.Label>
                <Input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChangeText={(text) => setPasswordForm({ ...passwordForm, confirmPassword: text })}
                />
              </FormControl>

              <HStack space={2}>
                <Button flex={1} onPress={handlePasswordChange}>
                  Change Password
                </Button>
                <Button
                  flex={1}
                  variant="outline"
                  onPress={() => setShowPasswordForm(false)}
                >
                  Cancel
                </Button>
              </HStack>
            </VStack>
          )}
        </VStack>
      </VStack>
    </ScrollView>
  );
};
```

### React Web Settings Component

```tsx
// src/components/SettingsPage.tsx
import React, { useState } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { settingsService } from '../services/settingsService';

export const SettingsPage: React.FC = () => {
  const { settings, updateNotificationSetting } = useSettings();
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleToggleNotification = async (key: keyof NotificationSettings, value: boolean) => {
    try {
      await updateNotificationSetting(key, value);
      setMessage({ type: 'success', text: 'Setting updated successfully' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update setting' });
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }

    try {
      await settingsService.changePassword(passwordForm.currentPassword, passwordForm.newPassword);
      setMessage({ type: 'success', text: 'Password changed successfully' });
      setShowPasswordForm(false);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to change password' });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
      
      {message && (
        <div className={`mb-6 p-4 rounded-md ${
          message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
        }`}>
          {message.text}
        </div>
      )}

      {/* Notification Preferences */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Notification Preferences</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h3 className="font-medium">Blog Notifications</h3>
              <p className="text-sm text-gray-600">Get notified about new blog posts</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifications.blogNotifications}
                onChange={(e) => handleToggleNotification('blogNotifications', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h3 className="font-medium">News Updates</h3>
              <p className="text-sm text-gray-600">Receive latest news and updates</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifications.newsNotifications}
                onChange={(e) => handleToggleNotification('newsNotifications', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h3 className="font-medium">Social Media Alerts</h3>
              <p className="text-sm text-gray-600">Notifications for social media posts</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifications.socialNotifications}
                onChange={(e) => handleToggleNotification('socialNotifications', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg opacity-50">
            <div>
              <h3 className="font-medium">Payment Reminders</h3>
              <p className="text-sm text-gray-600">Critical payment notifications (cannot be disabled)</p>
            </div>
            <div className="w-11 h-6 bg-blue-600 rounded-full relative">
              <div className="absolute top-[2px] right-[2px] bg-white border border-gray-300 rounded-full h-5 w-5"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Channels */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Notification Channels</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <span className="font-medium">Email Notifications</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifications.emailEnabled}
                onChange={(e) => handleToggleNotification('emailEnabled', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <span className="font-medium">Push Notifications</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifications.pushEnabled}
                onChange={(e) => handleToggleNotification('pushEnabled', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <span className="font-medium">WhatsApp Notifications</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifications.whatsappEnabled}
                onChange={(e) => handleToggleNotification('whatsappEnabled', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Password Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Security</h2>
        {!showPasswordForm ? (
          <button
            onClick={() => setShowPasswordForm(true)}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Change Password
          </button>
        ) : (
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Password
              </label>
              <input
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <input
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Change Password
              </button>
              <button
                type="button"
                onClick={() => setShowPasswordForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
```

## 🔄 Backend API Endpoints

```python
# notifications/views.py
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import UserNotificationPreference
from .serializers import UserNotificationPreferenceSerializer

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_settings(request):
    """Get user notification preferences"""
    try:
        preferences = UserNotificationPreference.objects.get(user=request.user)
        serializer = UserNotificationPreferenceSerializer(preferences)
        return Response({
            'notifications': serializer.data
        })
    except UserNotificationPreference.DoesNotExist:
        # Create default preferences
        preferences = UserNotificationPreference.objects.create(user=request.user)
        serializer = UserNotificationPreferenceSerializer(preferences)
        return Response({
            'notifications': serializer.data
        })

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_notification_settings(request):
    """Update notification preferences"""
    try:
        preferences = UserNotificationPreference.objects.get(user=request.user)
        serializer = UserNotificationPreferenceSerializer(preferences, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except UserNotificationPreference.DoesNotExist:
        return Response({'error': 'Preferences not found'}, status=status.HTTP_404_NOT_FOUND)
```

## 🚀 Future Enhancements

### Multi-Language Support

```python
# notifications/models.py
class NotificationTemplate(models.Model):
    notification_type = models.ForeignKey(NotificationType, on_delete=models.CASCADE)
    language = models.CharField(max_length=10, default='en')
    title = models.CharField(max_length=200)
    content = models.TextField()
    
    class Meta:
        unique_together = ['notification_type', 'language']
```

### Notification History

```typescript
// Add to SettingsContext
interface NotificationHistory {
  id: string;
  type: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}

// New endpoint for history
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_notification_history(request):
    """Get user's notification history"""
    notifications = UserNotification.objects.filter(user=request.user).order_by('-created_at')
    return Response(notifications.values())
```

### Advanced Scheduling

```python
# notifications/models.py
class NotificationSchedule(models.Model):
    FREQUENCY_CHOICES = [
        ('once', 'Once'),
        ('daily', 'Daily'),
        ('weekly', 'Weekly'),
        ('monthly', 'Monthly'),
    ]
    
    notification_type = models.ForeignKey(NotificationType, on_delete=models.CASCADE)
    frequency = models.CharField(max_length=20, choices=FREQUENCY_CHOICES)
    time = models.TimeField()
    days_of_week = models.JSONField(default=list)  # [0,1,2,3,4,5,6]
    is_active = models.BooleanField(default=True)
```

## 🧪 Testing

```python
# tests/test_notifications.py
from django.test import TestCase
from django.contrib.auth.models import User
from notifications.models import NotificationType, UserNotificationPreference
from notifications.services import NotificationService

class NotificationConfigurationTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpass')
        self.notification_type = NotificationType.objects.create(
            name='blog',
            display_name='Blog Post',
            description='New blog post notifications'
        )
        
    def test_default_preferences_created(self):
        """Test that default preferences are created for new users"""
        preferences = UserNotificationPreference.objects.get(user=self.user)
        self.assertTrue(preferences.blog_notifications)
        self.assertTrue(preferences.news_notifications)
        self.assertTrue(preferences.social_notifications)
        
    def test_preference_filtering(self):
        """Test that notifications respect user preferences"""
        # Disable blog notifications
        preferences = UserNotificationPreference.objects.get(user=self.user)
        preferences.blog_notifications = False
        preferences.save()
        
        # Send blog notification
        NotificationService.send_content_notification(
            content_type='blog',
            content_instance=None,
            notification_type='blog'
        )
        
        # Verify no notification was sent
        # Add assertion logic here
```

## 📝 Implementation Checklist

### Backend Tasks
- [ ] Create notification models and migrations
- [ ] Set up Django signals for content notifications
- [ ] Implement notification service with scheduling
- [ ] Create admin interface for template management
- [ ] Add API endpoints for settings management
- [ ] Set up Celery for async processing
- [ ] Implement multi-channel sending (email, push, WhatsApp)

### Frontend Tasks
- [ ] Create settings context and service
- [ ] Build settings screens for mobile and web
- [ ] Implement toggle controls with validation
- [ ] Add password change functionality
- [ ] Create notification preference sync
- [ ] Add error handling and user feedback
- [ ] Implement settings persistence

### Testing & Deployment
- [ ] Write unit tests for notification logic
- [ ] Test user preference enforcement
- [ ] Validate critical notification handling
- [ ] Test multi-channel delivery
- [ ] Performance test with high notification volume
- [ ] Deploy notification infrastructure

This comprehensive notification configuration system provides flexible, user-controlled notifications while maintaining critical business requirements and supporting future enhancements. 