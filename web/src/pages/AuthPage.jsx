import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import LoginForm from '../components/auth/LoginForm.jsx';
import ForgotPasswordForm from '../components/auth/ForgotPasswordForm.jsx';

const AUTH_MODES = {
  LOGIN: 'login',
  FORGOT_PASSWORD: 'forgot-password',
};

const AuthPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [authMode, setAuthMode] = useState(AUTH_MODES.LOGIN);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSwitchToLogin = () => {
    setAuthMode(AUTH_MODES.LOGIN);
  };

  const handleSwitchToForgotPassword = () => {
    setAuthMode(AUTH_MODES.FORGOT_PASSWORD);
  };

  const renderAuthForm = () => {
    switch (authMode) {
      case AUTH_MODES.LOGIN:
        return (
          <LoginForm
            onForgotPassword={handleSwitchToForgotPassword}
          />
        );
      case AUTH_MODES.FORGOT_PASSWORD:
        return (
          <ForgotPasswordForm
            onBackToLogin={handleSwitchToLogin}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-primary relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-12 py-16 text-white">
          <div className="max-w-md mx-auto text-center">
            {/* Logo */}
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-8">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>

            <h1 className="text-4xl font-bold mb-4">
              Welcome to Visa Consultancy
            </h1>
            <p className="text-lg text-blue-100 mb-8 leading-relaxed">
              Streamline your visa application process with our comprehensive referral platform. 
              Track progress, manage referrals, and boost your earnings all in one place.
            </p>

            {/* Features */}
            <div className="space-y-4">
              {[
                { icon: '🎯', text: 'Smart Referral Tracking' },
                { icon: '📊', text: 'Real-time Analytics' },
                { icon: '💰', text: 'Commission Management' },
                { icon: '🚀', text: 'Automated Workflows' },
              ].map((feature, index) => (
                <div key={index} className="flex items-center space-x-3 text-blue-100">
                  <span className="text-2xl">{feature.icon}</span>
                  <span className="text-sm font-medium">{feature.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24" />
      </div>

      {/* Right Side - Auth Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto w-full">
          {/* Header */}
          <div className="text-center mb-8">
            {/* Mobile Logo */}
            <div className="lg:hidden inline-flex items-center justify-center w-12 h-12 bg-gradient-primary rounded-xl mb-6">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {authMode === AUTH_MODES.LOGIN ? 'Welcome back' : 'Reset password'}
            </h2>
            <p className="text-gray-600">
              {authMode === AUTH_MODES.LOGIN 
                ? 'Sign in to your account to continue' 
                : 'Enter your email to receive reset instructions'
              }
            </p>
          </div>

          {/* Auth Form */}
          <div className="animate-fade-in">
            {renderAuthForm()}
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Protected by industry-standard security measures
            </p>
            <div className="flex items-center justify-center space-x-4 mt-4">
              <div className="flex items-center space-x-1 text-xs text-gray-400">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <span>SSL Encrypted</span>
              </div>
              <div className="flex items-center space-x-1 text-xs text-gray-400">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Privacy Protected</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage; 