import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';

const SettingsPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('notifications');
  const [saving, setSaving] = useState(false);
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
    { 
      id: 'notifications', 
      name: 'Notifications', 
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM5 7h14l-7-7 7 7H5z" />
        </svg>
      )
    },
    { 
      id: 'privacy', 
      name: 'Privacy', 
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      )
    },
    { 
      id: 'general', 
      name: 'General', 
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
    { 
      id: 'account', 
      name: 'Account', 
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    }
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
    setSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Here you would save to your backend
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setSaving(false);
    }
  };

  const Toggle = ({ enabled, onChange, label, description, disabled = false }) => (
    <div className="flex items-center justify-between py-4 border-b border-gray-100 last:border-b-0">
      <div className="flex-1 mr-4">
        <label className="text-sm font-semibold text-gray-900 block">{label}</label>
        {description && <p className="text-sm text-gray-600 mt-1">{description}</p>}
      </div>
      <button
        onClick={() => !disabled && onChange(!enabled)}
        disabled={disabled}
        className={`relative inline-flex items-center h-6 w-11 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
          enabled ? 'bg-blue-600' : 'bg-gray-200'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <span
          className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform shadow-lg ${
            enabled ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );

  const Select = ({ value, onChange, options, label, description }) => (
    <div className="py-4 border-b border-gray-100 last:border-b-0">
      <label className="text-sm font-semibold text-gray-900 block mb-2">{label}</label>
      {description && <p className="text-sm text-gray-600 mb-3">{description}</p>}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
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
    <div className="py-4 border-b border-gray-100 last:border-b-0">
      <label className="text-sm font-semibold text-gray-900 block mb-2">{label}</label>
      {description && <p className="text-sm text-gray-600 mb-3">{description}</p>}
      <input
        type="time"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
      />
    </div>
  );

  const SettingsSection = ({ title, children, icon, gradient }) => (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center space-x-3 mb-6">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${gradient}`}>
          {icon}
        </div>
        <h3 className="text-xl font-bold text-gray-900">{title}</h3>
      </div>
      <div className="space-y-0">
        {children}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header with Gradient */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 pb-16">
        <div className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div className="text-white">
              <h1 className="text-2xl sm:text-3xl font-bold break-words">Settings</h1>
              <p className="text-blue-100 mt-1 text-sm sm:text-base break-words">Manage your account preferences and privacy settings</p>
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-6 py-3 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              {saving && (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              <span>{saving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 -mt-8">
        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg p-2 mb-8">
          <nav className="flex space-x-2" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                } px-4 py-3 rounded-xl font-medium text-sm flex items-center space-x-2 flex-1 justify-center transition-all duration-200`}
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {activeTab === 'notifications' && (
            <>
              <SettingsSection
                title="Communication Preferences"
                icon={<svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>}
                gradient="bg-gradient-to-br from-blue-400 to-blue-600"
              >
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
              </SettingsSection>

              <SettingsSection
                title="Content Preferences"
                icon={<svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-10 0a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2" />
                </svg>}
                gradient="bg-gradient-to-br from-green-400 to-green-600"
              >
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
              </SettingsSection>

              <SettingsSection
                title="Do Not Disturb"
                icon={<svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>}
                gradient="bg-gradient-to-br from-purple-400 to-purple-600"
              >
                <Toggle
                  enabled={settings.notifications.doNotDisturb}
                  onChange={(value) => handleSettingChange('notifications', 'doNotDisturb', value)}
                  label="Enable Do Not Disturb"
                  description="Disable notifications during specified hours"
                />
                {settings.notifications.doNotDisturb && (
                  <div className="ml-6 space-y-0 border-l-2 border-purple-200 pl-4">
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
              </SettingsSection>
            </>
          )}

          {activeTab === 'privacy' && (
            <>
              <SettingsSection
                title="Profile & Data"
                icon={<svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>}
                gradient="bg-gradient-to-br from-red-400 to-red-600"
              >
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
                  label="Analytics"
                  description="Help us improve by sharing usage analytics"
                />
              </SettingsSection>

              <SettingsSection
                title="Security"
                icon={<svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>}
                gradient="bg-gradient-to-br from-orange-400 to-orange-600"
              >
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
              </SettingsSection>

              <SettingsSection
                title="Data Management"
                icon={<svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                </svg>}
                gradient="bg-gradient-to-br from-teal-400 to-teal-600"
              >
                <Select
                  value={settings.privacy.dataExportFormat}
                  onChange={(value) => handleSettingChange('privacy', 'dataExportFormat', value)}
                  label="Data Export Format"
                  description="Choose format for data export"
                  options={[
                    { value: 'json', label: 'JSON' },
                    { value: 'csv', label: 'CSV' },
                    { value: 'pdf', label: 'PDF' }
                  ]}
                />
                <div className="py-4 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-semibold text-gray-900 block">Export Your Data</label>
                      <p className="text-sm text-gray-600 mt-1">Download a copy of your account data</p>
                    </div>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors text-sm font-medium">
                      Export
                    </button>
                  </div>
                </div>
                <div className="py-4 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-semibold text-red-600 block">Delete Account</label>
                      <p className="text-sm text-gray-600 mt-1">Permanently delete your account and all data</p>
                    </div>
                    <button className="bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700 transition-colors text-sm font-medium">
                      Delete
                    </button>
                  </div>
                </div>
              </SettingsSection>
            </>
          )}

          {activeTab === 'general' && (
            <>
              <SettingsSection
                title="Language & Region"
                icon={<svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>}
                gradient="bg-gradient-to-br from-indigo-400 to-indigo-600"
              >
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
                    { value: 'zh', label: 'Chinese' }
                  ]}
                />
                <Select
                  value={settings.general.timezone}
                  onChange={(value) => handleSettingChange('general', 'timezone', value)}
                  label="Timezone"
                  description="Your local timezone"
                  options={[
                    { value: 'UTC', label: 'UTC' },
                    { value: 'EST', label: 'Eastern Time' },
                    { value: 'PST', label: 'Pacific Time' },
                    { value: 'GMT', label: 'Greenwich Mean Time' },
                    { value: 'JST', label: 'Japan Standard Time' }
                  ]}
                />
                <Select
                  value={settings.general.currency}
                  onChange={(value) => handleSettingChange('general', 'currency', value)}
                  label="Currency"
                  description="Default currency for monetary values"
                  options={[
                    { value: 'USD', label: 'US Dollar ($)' },
                    { value: 'EUR', label: 'Euro (€)' },
                    { value: 'GBP', label: 'British Pound (£)' },
                    { value: 'JPY', label: 'Japanese Yen (¥)' },
                    { value: 'CAD', label: 'Canadian Dollar (C$)' }
                  ]}
                />
              </SettingsSection>

              <SettingsSection
                title="Date & Time"
                icon={<svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>}
                gradient="bg-gradient-to-br from-pink-400 to-pink-600"
              >
                <Select
                  value={settings.general.dateFormat}
                  onChange={(value) => handleSettingChange('general', 'dateFormat', value)}
                  label="Date Format"
                  description="How dates are displayed"
                  options={[
                    { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
                    { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
                    { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
                    { value: 'DD MMM YYYY', label: 'DD MMM YYYY' }
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
              </SettingsSection>

              <SettingsSection
                title="Interface"
                icon={<svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>}
                gradient="bg-gradient-to-br from-yellow-400 to-yellow-600"
              >
                <Toggle
                  enabled={settings.general.autoSave}
                  onChange={(value) => handleSettingChange('general', 'autoSave', value)}
                  label="Auto-Save"
                  description="Automatically save changes as you make them"
                />
                <Toggle
                  enabled={settings.general.compactView}
                  onChange={(value) => handleSettingChange('general', 'compactView', value)}
                  label="Compact View"
                  description="Display more content on screen by reducing spacing"
                />
              </SettingsSection>
            </>
          )}

          {activeTab === 'account' && (
            <>
              <SettingsSection
                title="Account Information"
                icon={<svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>}
                gradient="bg-gradient-to-br from-gray-400 to-gray-600"
              >
                <div className="py-4 border-b border-gray-100">
                  <label className="text-sm font-semibold text-gray-900 block">Email Address</label>
                  <p className="text-sm text-gray-600 mt-1">{user?.email || 'user@example.com'}</p>
                </div>
                <div className="py-4 border-b border-gray-100">
                  <label className="text-sm font-semibold text-gray-900 block">Account Created</label>
                  <p className="text-sm text-gray-600 mt-1">January 15, 2024</p>
                </div>
                <div className="py-4 border-b border-gray-100">
                  <label className="text-sm font-semibold text-gray-900 block">Account Type</label>
                  <p className="text-sm text-gray-600 mt-1">Premium Member</p>
                </div>
                <div className="py-4 border-b border-gray-100">
                  <label className="text-sm font-semibold text-gray-900 block">Referral Code</label>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-sm text-gray-600">{user?.referralCode || 'REF2024001'}</p>
                    <button 
                      onClick={() => navigator.clipboard.writeText(user?.referralCode || 'REF2024001')}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              </SettingsSection>

              <SettingsSection
                title="Account Actions"
                icon={<svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                </svg>}
                gradient="bg-gradient-to-br from-red-400 to-red-600"
              >
                <div className="py-4 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-semibold text-gray-900 block">Change Password</label>
                      <p className="text-sm text-gray-600 mt-1">Update your account password</p>
                    </div>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors text-sm font-medium">
                      Change
                    </button>
                  </div>
                </div>
                <div className="py-4 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-semibold text-gray-900 block">Download Data</label>
                      <p className="text-sm text-gray-600 mt-1">Export all your account data</p>
                    </div>
                    <button className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition-colors text-sm font-medium">
                      Download
                    </button>
                  </div>
                </div>
                <div className="py-4 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-semibold text-gray-900 block">Deactivate Account</label>
                      <p className="text-sm text-gray-600 mt-1">Temporarily disable your account</p>
                    </div>
                    <button className="bg-yellow-600 text-white px-4 py-2 rounded-xl hover:bg-yellow-700 transition-colors text-sm font-medium">
                      Deactivate
                    </button>
                  </div>
                </div>
                <div className="py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-semibold text-red-600 block">Delete Account</label>
                      <p className="text-sm text-gray-600 mt-1">Permanently delete your account and all data</p>
                    </div>
                    <button className="bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700 transition-colors text-sm font-medium">
                      Delete
                    </button>
                  </div>
                </div>
              </SettingsSection>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage; 