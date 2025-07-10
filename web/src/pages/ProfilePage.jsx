import React from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';

const ProfilePage = () => {
  const { user } = useAuth();

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Profile</h1>
        <p className="text-sm sm:text-base text-gray-600">Manage your account settings and preferences</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="space-y-6">
          {/* Profile Header */}
          <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 pb-6 border-b border-gray-200">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-blue-600 rounded-full flex items-center justify-center mx-auto sm:mx-0 flex-shrink-0">
              <span className="text-2xl sm:text-3xl font-bold text-white">
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </span>
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">{user?.name || 'User Name'}</h2>
              <p className="text-sm sm:text-base text-gray-600">{user?.email || 'user@example.com'}</p>
              <div className="mt-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Active Member
                </span>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div>
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <p className="text-sm sm:text-base text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                  {user?.name || 'John Doe'}
                </p>
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="text-sm sm:text-base text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                  {user?.email || 'john@example.com'}
                </p>
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <p className="text-sm sm:text-base text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                  {user?.phone || '+1 (555) 123-4567'}
                </p>
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Country</label>
                <p className="text-sm sm:text-base text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                  {user?.country || 'United States'}
                </p>
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Visa Type</label>
                <p className="text-sm sm:text-base text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                  {user?.visaType || 'Tourist Visa'}
                </p>
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Referral Code</label>
                <p className="text-sm sm:text-base text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                  {user?.referralCode || 'REF2024001'}
                </p>
              </div>
            </div>
          </div>

          {/* Account Stats */}
          <div>
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-4">Account Statistics</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <div className="text-xl sm:text-2xl font-bold text-blue-600">15</div>
                <div className="text-sm text-blue-600">Total Referrals</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <div className="text-xl sm:text-2xl font-bold text-green-600">$2,450</div>
                <div className="text-sm text-green-600">Total Earnings</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 text-center">
                <div className="text-xl sm:text-2xl font-bold text-purple-600">68%</div>
                <div className="text-sm text-purple-600">Success Rate</div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="pt-6 border-t border-gray-200">
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm font-medium">
                Edit Profile
              </button>
              <button className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 text-sm font-medium">
                Change Password
              </button>
              <button className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 text-sm font-medium">
                Privacy Settings
              </button>
            </div>
          </div>

          {/* Account Information */}
          <div className="pt-6 border-t border-gray-200">
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-4">Account Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Member Since</label>
                <p className="text-sm sm:text-base text-gray-900">January 15, 2024</p>
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Account Status</label>
                <p className="text-sm sm:text-base text-gray-900">Active</p>
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Last Login</label>
                <p className="text-sm sm:text-base text-gray-900">Today at 2:30 PM</p>
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Timezone</label>
                <p className="text-sm sm:text-base text-gray-900">UTC-5 (Eastern Time)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 