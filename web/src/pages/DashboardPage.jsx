import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { mockDashboardStats, mockReferrals, mockNotifications, mockApiResponse } from '../services/mockData.js';

const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentReferrals, setRecentReferrals] = useState([]);
  const [recentNotifications, setRecentNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsResponse, referralsResponse, notificationsResponse] = await Promise.all([
          mockApiResponse(mockDashboardStats),
          mockApiResponse(mockReferrals.slice(0, 5)),
          mockApiResponse(mockNotifications.slice(0, 5))
        ]);

        setStats(statsResponse.data);
        setRecentReferrals(referralsResponse.data);
        setRecentNotifications(notificationsResponse.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timeRange]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'badge-success';
      case 'rejected': return 'badge-error';
      case 'pending': return 'badge-warning';
      case 'in_progress': return 'badge-primary';
      default: return 'badge-gray';
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>;
      case 'warning':
        return <svg className="w-4 h-4 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>;
      case 'error':
        return <svg className="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>;
      default:
        return <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>;
    }
  };

  // Modern Metric Card Component
  const MetricCard = ({ title, value, subtitle, trend, icon, gradient, link }) => (
    <div className="card-elevated group">
      <div className="card-body relative overflow-hidden">
        {/* Background Gradient */}
        <div className={`absolute top-0 right-0 w-20 h-20 ${gradient} opacity-10 rounded-full transform translate-x-8 -translate-y-8`} />
        
        <div className="flex items-center justify-between mb-4">
          <div className={`w-12 h-12 ${gradient} rounded-xl flex items-center justify-center shadow-lg`}>
            {icon}
          </div>
          {trend && (
            <div className={`flex items-center space-x-1 text-sm font-medium ${trend.direction === 'up' ? 'text-green-600' : 'text-red-600'}`}>
              <svg className={`w-4 h-4 ${trend.direction === 'up' ? 'transform rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
              <span>{trend.value}</span>
            </div>
          )}
        </div>

        <div className="space-y-1">
          <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
        </div>

        {link && (
          <Link to={link} className="absolute inset-0 group-hover:bg-gray-50 transition-colors duration-200 opacity-0 group-hover:opacity-5" />
        )}
      </div>
    </div>
  );

  // Enhanced Welcome Card
  const WelcomeCard = () => (
    <div className="relative overflow-hidden bg-gradient-primary rounded-2xl text-white p-8 mb-8">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='m20 20 20-20H20v20z'/%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {user?.name || 'User'}! 👋
            </h1>
            <p className="text-blue-100 text-lg mb-6 lg:mb-0">
              Here's what's happening with your referrals today
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2">
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span>All systems operational</span>
              </div>
            </div>
            <Link
              to="/referrals"
              className="btn bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white border-white/30 hover:border-white/50"
            >
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Referral
            </Link>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full" />
      <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-white/5 rounded-full" />
    </div>
  );

  // Quick Action Card
  const QuickActionCard = ({ title, description, icon, color, link, onClick }) => (
    <div className="card hover:shadow-lg transition-all duration-300 group cursor-pointer" onClick={onClick}>
      <div className="card-body">
        <div className="flex items-center space-x-4">
          <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
            {icon}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{title}</h3>
            <p className="text-sm text-gray-600">{description}</p>
          </div>
          <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
      {link && <Link to={link} className="absolute inset-0" />}
    </div>
  );

  // Loading State
  if (loading) {
    return (
      <div className="p-8 animate-fade-in">
        <div className="animate-pulse space-y-8">
          {/* Header Skeleton */}
          <div className="h-32 bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl" />
          
          {/* Metrics Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl" />
            ))}
          </div>
          
          {/* Content Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <div className="h-64 bg-gray-200 rounded-xl" />
            </div>
            <div className="space-y-4">
              <div className="h-48 bg-gray-200 rounded-xl" />
              <div className="h-48 bg-gray-200 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 animate-fade-in">
      {/* Welcome Section */}
      <WelcomeCard />

      {/* Time Range Selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">Time range:</span>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="input input-sm border-gray-300"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Referrals"
          value={stats?.totalReferrals || 0}
          subtitle="all time"
          trend={{ direction: 'up', value: '+12%' }}
          gradient="bg-gradient-to-br from-blue-500 to-blue-600"
          icon={<svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>}
          link="/referrals"
        />
        <MetricCard
          title="Total Earnings"
          value={`$${stats?.totalEarnings || 0}`}
          subtitle="commission earned"
          trend={{ direction: 'up', value: '+8%' }}
          gradient="bg-gradient-to-br from-green-500 to-green-600"
          icon={<svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>}
        />
        <MetricCard
          title="Success Rate"
          value={`${stats?.conversionRate || 0}%`}
          subtitle="approval rate"
          trend={{ direction: 'up', value: '+3%' }}
          gradient="bg-gradient-to-br from-purple-500 to-purple-600"
          icon={<svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>}
          link="/progress"
        />
        <MetricCard
          title="Pending Review"
          value={stats?.pendingReferrals || 0}
          subtitle="need attention"
          gradient="bg-gradient-to-br from-orange-500 to-orange-600"
          icon={<svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Referrals */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <div className="card-header">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">Recent Referrals</h3>
                <Link to="/referrals" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  View all →
                </Link>
              </div>
            </div>
            <div className="card-body">
              <div className="space-y-4">
                {recentReferrals.map((referral, index) => (
                  <div key={referral.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                        <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{referral.refereeName}</p>
                        <p className="text-sm text-gray-600">{referral.visaType} • {referral.country}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`badge ${getStatusColor(referral.status)}`}>
                        {referral.status}
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(referral.submissionDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-bold text-gray-900">Quick Actions</h3>
            </div>
            <div className="card-body">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <QuickActionCard
                  title="Submit New Referral"
                  description="Add a new visa referral"
                  icon={<svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>}
                  color="bg-blue-500"
                  link="/referrals"
                />
                <QuickActionCard
                  title="Check Progress"
                  description="View application status"
                  icon={<svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>}
                  color="bg-green-500"
                  link="/progress"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Recent Activity */}
          <div className="card">
            <div className="card-header">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
                <Link to="/notifications" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  View all →
                </Link>
              </div>
            </div>
            <div className="card-body">
              <div className="space-y-4">
                {recentNotifications.map((notification, index) => (
                  <div key={notification.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="flex-shrink-0 mt-0.5">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {notification.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(notification.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Performance Summary */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-bold text-gray-900">This Month</h3>
            </div>
            <div className="card-body">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Referrals Submitted</span>
                  <span className="text-sm font-bold text-gray-900">12</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Approved</span>
                  <span className="text-sm font-bold text-green-600">8</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Commission Earned</span>
                  <span className="text-sm font-bold text-gray-900">$1,240</span>
                </div>
                <div className="pt-3 border-t">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-gray-600">Goal Progress</span>
                    <span className="text-xs font-medium text-gray-600">67%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '67%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage; 