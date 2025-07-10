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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
            <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Visa Consultancy
          </h1>
          <p className="text-lg text-gray-600">
            Your trusted visa application partner
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        {renderAuthForm()}
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">
          Need help?{' '}
          <a href="mailto:support@visaconsultancy.com" className="text-blue-600 hover:text-blue-800 font-medium">
            Contact Support
          </a>
        </p>
      </div>
    </div>
  );
};

export default AuthPage; 