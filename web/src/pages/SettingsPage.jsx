import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';

const SettingsPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('notifications');
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      sms: false,
      push: true,
      referralUpdates: true,
      paymentNotifications: true,
      systemUpdates: false,
      marketingEmails: false,
      doNotDisturb: false,
      doNotDisturbStart: '22:00',
      doNotDisturbEnd: '08:00',
    },
    privacy: {
      profileVisibility: 'private',
      shareDataWithPartners: false,
      allowAnalytics: true,
      twoFactorAuth: false,
      loginNotifications: true,
      dataExportFormat: 'json',
    },
    general: {
      language: 'en',
      timezone: 'UTC',
      dateFormat: 'MM/DD/YYYY',
      timeFormat: '12h',
      currency: 'USD',
      autoSave: true,
      compactView: false,
    }
  });

  const tabs = [
    { id: 'notifications', name: 'Notifications', icon: '🔔' },
    { id: 'privacy', name: 'Privacy', icon: '🔒' },
    { id: 'general', name: 'General', icon: '⚙️' },
    { id: 'account', name: 'Account', icon: '👤' }
  ];

  const handleSettingChange = (category, setting, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }));
  };

  const handleSave = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error saving settings. Please try again.');
    }
  };

  const Toggle = ({ enabled, onChange, label, description }) => (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 sm:py-4 border-b border-gray-200 last:border-b-0">
      <div className="flex-1 mb-3 sm:mb-0">
        <label className="text-sm font-medium text-gray-900 block">{label}</label>
        {description && <p className="text-xs sm:text-sm text-gray-500 mt-1">{description}</p>}
      </div>
      <button
        onClick={() => onChange(!enabled)}
        className={`relative inline-flex items-center h-6 w-11 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
          enabled ? 'bg-blue-600' : 'bg-gray-200'
        }`}
      >
        <span
          className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
            enabled ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );

  const Select = ({ value, onChange, options, label, description }) => (
    <div className="py-3 sm:py-4 border-b border-gray-200 last:border-b-0">
      <label className="text-sm font-medium text-gray-900 block mb-2">{label}</label>
      {description && <p className="text-xs sm:text-sm text-gray-500 mb-3">{description}</p>}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );

  const TimeInput = ({ value, onChange, label, description }) => (
    <div className="py-3 sm:py-4 border-b border-gray-200 last:border-b-0">
      <label className="text-sm font-medium text-gray-900 block mb-2">{label}</label>
      {description && <p className="text-xs sm:text-sm text-gray-500 mb-3">{description}</p>}
      <input
        type="time"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
  );

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-sm sm:text-base text-gray-600">Manage your account preferences and privacy settings</p>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <nav className="flex space-x-4 sm:space-x-8 overflow-x-auto pb-2" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 flex-shrink-0`}
            >
              <span>{tab.icon}</span>
              <span className="hidden sm:inline">{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {activeTab === 'notifications' && (
          <div className="p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-4">Notification Preferences</h3>
            <div className="space-y-1">
              <Toggle
                enabled={settings.notifications.email}
                onChange={(value) => handleSettingChange('notifications', 'email', value)}
                label="Email Notifications"
                description="Receive notifications via email"
              />
              <Toggle
                enabled={settings.notifications.sms}
                onChange={(value) => handleSettingChange('notifications', 'sms', value)}
                label="SMS Notifications"
                description="Receive notifications via SMS"
              />
              <Toggle
                enabled={settings.notifications.push}
                onChange={(value) => handleSettingChange('notifications', 'push', value)}
                label="Push Notifications"
                description="Receive push notifications in your browser"
              />
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="text-sm sm:text-base font-medium text-gray-900 mb-4">Content Preferences</h4>
              <div className="space-y-1">
                <Toggle
                  enabled={settings.notifications.referralUpdates}
                  onChange={(value) => handleSettingChange('notifications', 'referralUpdates', value)}
                  label="Referral Updates"
                  description="Notifications about referral status changes"
                />
                <Toggle
                  enabled={settings.notifications.paymentNotifications}
                  onChange={(value) => handleSettingChange('notifications', 'paymentNotifications', value)}
                  label="Payment Notifications"
                  description="Notifications about commission payments"
                />
                <Toggle
                  enabled={settings.notifications.systemUpdates}
                  onChange={(value) => handleSettingChange('notifications', 'systemUpdates', value)}
                  label="System Updates"
                  description="Notifications about system maintenance and updates"
                />
                <Toggle
                  enabled={settings.notifications.marketingEmails}
                  onChange={(value) => handleSettingChange('notifications', 'marketingEmails', value)}
                  label="Marketing Emails"
                  description="Promotional emails and newsletters"
                />
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="text-sm sm:text-base font-medium text-gray-900 mb-4">Do Not Disturb</h4>
              <div className="space-y-1">
                <Toggle
                  enabled={settings.notifications.doNotDisturb}
                  onChange={(value) => handleSettingChange('notifications', 'doNotDisturb', value)}
                  label="Enable Do Not Disturb"
                  description="Disable notifications during specified hours"
                />
                {settings.notifications.doNotDisturb && (
                  <div className="pl-4 sm:pl-6 space-y-1">
                    <TimeInput
                      value={settings.notifications.doNotDisturbStart}
                      onChange={(value) => handleSettingChange('notifications', 'doNotDisturbStart', value)}
                      label="Start Time"
                      description="When to start Do Not Disturb"
                    />
                    <TimeInput
                      value={settings.notifications.doNotDisturbEnd}
                      onChange={(value) => handleSettingChange('notifications', 'doNotDisturbEnd', value)}
                      label="End Time"
                      description="When to end Do Not Disturb"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'privacy' && (
          <div className="p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-4">Privacy Settings</h3>
            <div className="space-y-1">
              <Select
                value={settings.privacy.profileVisibility}
                onChange={(value) => handleSettingChange('privacy', 'profileVisibility', value)}
                label="Profile Visibility"
                description="Control who can see your profile information"
                options={[
                  { value: 'public', label: 'Public - Anyone can view' },
                  { value: 'private', label: 'Private - Only you can view' },
                  { value: 'contacts', label: 'Contacts Only - Only your contacts can view' }
                ]}
              />
              <Toggle
                enabled={settings.privacy.shareDataWithPartners}
                onChange={(value) => handleSettingChange('privacy', 'shareDataWithPartners', value)}
                label="Share Data with Partners"
                description="Allow sharing anonymized data with trusted partners"
              />
              <Toggle
                enabled={settings.privacy.allowAnalytics}
                onChange={(value) => handleSettingChange('privacy', 'allowAnalytics', value)}
                label="Analytics & Performance"
                description="Help improve our service by sharing usage data"
              />
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="text-sm sm:text-base font-medium text-gray-900 mb-4">Security</h4>
              <div className="space-y-1">
                <Toggle
                  enabled={settings.privacy.twoFactorAuth}
                  onChange={(value) => handleSettingChange('privacy', 'twoFactorAuth', value)}
                  label="Two-Factor Authentication"
                  description="Add an extra layer of security to your account"
                />
                <Toggle
                  enabled={settings.privacy.loginNotifications}
                  onChange={(value) => handleSettingChange('privacy', 'loginNotifications', value)}
                  label="Login Notifications"
                  description="Get notified when someone logs into your account"
                />
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="text-sm sm:text-base font-medium text-gray-900 mb-4">Data Export</h4>
              <div className="space-y-1">
                <Select
                  value={settings.privacy.dataExportFormat}
                  onChange={(value) => handleSettingChange('privacy', 'dataExportFormat', value)}
                  label="Export Format"
                  description="Choose format for data export"
                  options={[
                    { value: 'json', label: 'JSON' },
                    { value: 'csv', label: 'CSV' },
                    { value: 'pdf', label: 'PDF' }
                  ]}
                />
                <div className="py-3 sm:py-4">
                  <button className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm">
                    Request Data Export
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'general' && (
          <div className="p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-4">General Settings</h3>
            <div className="space-y-1">
              <Select
                value={settings.general.language}
                onChange={(value) => handleSettingChange('general', 'language', value)}
                label="Language"
                description="Choose your preferred language"
                options={[
                  { value: 'en', label: 'English' },
                  { value: 'es', label: 'Spanish' },
                  { value: 'fr', label: 'French' },
                  { value: 'de', label: 'German' },
                  { value: 'it', label: 'Italian' },
                  { value: 'pt', label: 'Portuguese' }
                ]}
              />
              <Select
                value={settings.general.timezone}
                onChange={(value) => handleSettingChange('general', 'timezone', value)}
                label="Timezone"
                description="Select your timezone"
                options={[
                  { value: 'UTC', label: 'UTC' },
                  { value: 'America/New_York', label: 'Eastern Time' },
                  { value: 'America/Chicago', label: 'Central Time' },
                  { value: 'America/Denver', label: 'Mountain Time' },
                  { value: 'America/Los_Angeles', label: 'Pacific Time' },
                  { value: 'Europe/London', label: 'GMT' },
                  { value: 'Europe/Paris', label: 'Central European Time' },
                  { value: 'Asia/Tokyo', label: 'Japan Standard Time' }
                ]}
              />
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="text-sm sm:text-base font-medium text-gray-900 mb-4">Format Preferences</h4>
              <div className="space-y-1">
                <Select
                  value={settings.general.dateFormat}
                  onChange={(value) => handleSettingChange('general', 'dateFormat', value)}
                  label="Date Format"
                  description="How dates are displayed"
                  options={[
                    { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY (US)' },
                    { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY (EU)' },
                    { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD (ISO)' }
                  ]}
                />
                <Select
                  value={settings.general.timeFormat}
                  onChange={(value) => handleSettingChange('general', 'timeFormat', value)}
                  label="Time Format"
                  description="How time is displayed"
                  options={[
                    { value: '12h', label: '12-hour (AM/PM)' },
                    { value: '24h', label: '24-hour' }
                  ]}
                />
                <Select
                  value={settings.general.currency}
                  onChange={(value) => handleSettingChange('general', 'currency', value)}
                  label="Currency"
                  description="Currency for displaying amounts"
                  options={[
                    { value: 'USD', label: 'USD ($)' },
                    { value: 'EUR', label: 'EUR (€)' },
                    { value: 'GBP', label: 'GBP (£)' },
                    { value: 'CAD', label: 'CAD (C$)' },
                    { value: 'AUD', label: 'AUD (A$)' }
                  ]}
                />
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="text-sm sm:text-base font-medium text-gray-900 mb-4">Interface</h4>
              <div className="space-y-1">
                <Toggle
                  enabled={settings.general.autoSave}
                  onChange={(value) => handleSettingChange('general', 'autoSave', value)}
                  label="Auto Save"
                  description="Automatically save changes as you make them"
                />
                <Toggle
                  enabled={settings.general.compactView}
                  onChange={(value) => handleSettingChange('general', 'compactView', value)}
                  label="Compact View"
                  description="Show more content in less space"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'account' && (
          <div className="p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-4">Account Information</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={user?.name || 'John Doe'}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={user?.email || 'john@example.com'}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 text-sm"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value="+1 (555) 123-4567"
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Member Since</label>
                  <input
                    type="text"
                    value="January 15, 2024"
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Account Status</label>
                  <input
                    type="text"
                    value="Active"
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Referral Code</label>
                  <input
                    type="text"
                    value="REF2024001"
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="text-sm sm:text-base font-medium text-gray-900 mb-4">Account Actions</h4>
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                  <button className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm">
                    Change Password
                  </button>
                  <button className="w-full sm:w-auto bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 text-sm">
                    Update Profile
                  </button>
                </div>
                <div className="pt-3 border-t border-gray-200">
                  <button className="w-full sm:w-auto bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 text-sm">
                    Delete Account
                  </button>
                  <p className="text-xs text-gray-500 mt-2">
                    This action cannot be undone and will permanently delete your account.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Save Button */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex flex-col sm:flex-row sm:justify-end space-y-3 sm:space-y-0 sm:space-x-3">
          <button
            onClick={handleSave}
            className="w-full sm:w-auto bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm font-medium"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage; 