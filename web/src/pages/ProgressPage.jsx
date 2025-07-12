import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { VISA_STAGES } from '../../../shared/constants/config.js';

const ProgressPage = () => {
  const { user } = useAuth();
  const [selectedStage, setSelectedStage] = useState(null);

  const getStageStatus = (stageId) => {
    const stages = ['enquiry', 'detailed_enquiry', 'assessment', 'application', 'payment', 'completed'];
    const currentIndex = stages.indexOf(user?.currentVisaStage || 'enquiry');
    const stageIndex = stages.indexOf(stageId);
    
    if (stageIndex < currentIndex) return 'completed';
    if (stageIndex === currentIndex) return 'current';
    return 'upcoming';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'current': return 'bg-blue-500';
      default: return 'bg-gray-300';
    }
  };

  const getStatusGradient = (status) => {
    switch (status) {
      case 'completed': return 'bg-gradient-to-br from-green-400 to-green-600';
      case 'current': return 'bg-gradient-to-br from-blue-400 to-blue-600';
      default: return 'bg-gradient-to-br from-gray-300 to-gray-400';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return (
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'current':
        return (
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return <div className="w-3 h-3 bg-white rounded-full"></div>;
    }
  };

  const StatCard = ({ title, value, subtitle, gradient, icon }) => (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${gradient}`}>
          {icon}
        </div>
      </div>
    </div>
  );

  const StageCard = ({ stageId, stage, index }) => {
    const status = getStageStatus(stageId);
    const isLast = index === Object.keys(VISA_STAGES).length - 1;
    
    return (
      <div className="relative">
        <div 
          className={`bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer ${
            status === 'current' ? 'border-2 border-blue-500' : ''
          }`}
          onClick={() => setSelectedStage({ stageId, stage, status })}
        >
          <div className="flex items-start space-x-4">
            <div className={`flex items-center justify-center w-12 h-12 rounded-full ${getStatusGradient(status)} shadow-lg relative z-10 flex-shrink-0`}>
              {getStatusIcon(status)}
              {status === 'current' && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full shadow-lg">
                  <div className="w-full h-full bg-orange-500 rounded-full animate-ping"></div>
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-2">
                <h4 className={`text-lg font-bold break-words ${status === 'current' ? 'text-blue-600' : 'text-gray-900'}`}>
                  {stage.name}
                </h4>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 ${
                  status === 'completed' ? 'bg-green-100 text-green-800' :
                  status === 'current' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {status === 'completed' ? 'Completed' : status === 'current' ? 'In Progress' : 'Upcoming'}
                </span>
              </div>
              <p className="text-gray-600 mb-3 break-words leading-relaxed">{stage.description}</p>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm">
                <span className="text-gray-500 break-words">Duration: {stage.estimatedDuration}</span>
                {status === 'completed' && (
                  <span className="text-green-600 font-medium whitespace-nowrap">✓ Completed</span>
                )}
                {status === 'current' && (
                  <span className="text-blue-600 font-medium whitespace-nowrap">⏳ Processing</span>
                )}
              </div>
            </div>
          </div>
        </div>
        {!isLast && (
          <div className="flex justify-center my-4">
            <div className={`w-0.5 h-8 ${status === 'completed' ? 'bg-green-500' : 'bg-gray-200'}`}></div>
          </div>
        )}
      </div>
    );
  };

  const ProgressRing = ({ percentage }) => {
    const circumference = 2 * Math.PI * 40;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="relative w-32 h-32">
        <svg className="transform -rotate-90 w-32 h-32">
          <circle
            cx="64"
            cy="64"
            r="40"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-gray-200"
          />
          <circle
            cx="64"
            cy="64"
            r="40"
            stroke="url(#gradient)"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#8B5CF6" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{Math.round(percentage)}%</div>
            <div className="text-sm text-gray-600">Complete</div>
          </div>
        </div>
      </div>
    );
  };

  const completedStages = Object.entries(VISA_STAGES).filter(([stageId]) => getStageStatus(stageId) === 'completed').length;
  const currentStages = Object.entries(VISA_STAGES).filter(([stageId]) => getStageStatus(stageId) === 'current').length;
  const upcomingStages = Object.entries(VISA_STAGES).filter(([stageId]) => getStageStatus(stageId) === 'upcoming').length;
  const overallProgress = (completedStages / Object.keys(VISA_STAGES).length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header with Gradient */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 pb-16">
        <div className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div className="text-white">
              <h1 className="text-2xl sm:text-3xl font-bold break-words">Visa Progress</h1>
              <p className="text-blue-100 mt-1 text-sm sm:text-base break-words">Track your application journey step by step</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 text-sm sm:text-base">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Download Report</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 -mt-8">
        {/* Application Overview Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0 lg:space-x-8">
            <div className="flex-1 min-w-0">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 break-words">
                {user?.visaType || 'Visa Application'}
              </h3>
              <p className="text-gray-600 mb-4 break-words text-sm sm:text-base">
                Application ID: <span className="font-mono font-medium break-all">{user?.visaApplicationNumber || 'VA-2024-001'}</span>
              </p>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-blue-100 text-blue-800 break-words">
                  {user?.currentVisaStage?.replace('_', ' ')?.toUpperCase() || 'INITIAL ENQUIRY'}
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-green-100 text-green-800 whitespace-nowrap">
                  Active Application
                </span>
              </div>
            </div>
            <div className="flex flex-col items-center lg:flex-shrink-0">
              <ProgressRing percentage={overallProgress} />
              <p className="text-sm text-gray-600 mt-4 text-center whitespace-nowrap">
                Overall Progress
              </p>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <StatCard
            title="Completed"
            value={completedStages}
            subtitle="stages"
            gradient="bg-gradient-to-br from-green-400 to-green-600"
            icon={<svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>}
          />
          <StatCard
            title="In Progress"
            value={currentStages}
            subtitle="stage"
            gradient="bg-gradient-to-br from-blue-400 to-blue-600"
            icon={<svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>}
          />
          <StatCard
            title="Remaining"
            value={upcomingStages}
            subtitle="stages"
            gradient="bg-gradient-to-br from-orange-400 to-orange-600"
            icon={<svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>}
          />
          <StatCard
            title="Estimated Days"
            value="14"
            subtitle="remaining"
            gradient="bg-gradient-to-br from-purple-400 to-purple-600"
            icon={<svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Stages Timeline */}
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Application Timeline</h3>
            <div className="space-y-0">
              {Object.entries(VISA_STAGES).map(([stageId, stage], index) => (
                <StageCard key={stageId} stageId={stageId} stage={stage} index={index} />
              ))}
            </div>
          </div>

          {/* Next Steps & Help */}
          <div className="space-y-6">
            {/* Next Steps */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h4 className="text-xl font-bold text-gray-900">Next Steps</h4>
              </div>
              <div className="space-y-3">
                <p className="text-gray-600 leading-relaxed">
                  {user?.currentVisaStage === 'completed' 
                    ? 'Congratulations! Your visa application has been completed successfully.' 
                    : 'We will notify you once your application progresses to the next stage. Please ensure all required documents are submitted.'}
                </p>
                <div className="pt-4 border-t border-gray-100">
                  <h5 className="font-semibold text-gray-900 mb-2">What's happening now:</h5>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Your documents are being reviewed</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Background verification in progress</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                      <span>Interview scheduling (if required)</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Progress Summary */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h4 className="text-xl font-bold text-gray-900">Summary</h4>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Application Started</span>
                  <span className="text-sm text-gray-900">Jan 15, 2024</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Expected Completion</span>
                  <span className="text-sm text-gray-900">Mar 1, 2024</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Days Elapsed</span>
                  <span className="text-sm text-gray-900">32 days</span>
                </div>
                <div className="pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between text-lg font-semibold">
                    <span className="text-gray-900">Overall Progress</span>
                    <span className="text-blue-600">{Math.round(overallProgress)}%</span>
                  </div>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${overallProgress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Help Section */}
            <div className="bg-blue-50 rounded-2xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="text-xl font-bold text-gray-900">Need Help?</h4>
              </div>
              <p className="text-gray-600 mb-4">
                Have questions about your application progress? Our team is here to help.
              </p>
              <button className="w-full bg-blue-600 text-white px-4 py-3 rounded-xl hover:bg-blue-700 transition-colors font-medium">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stage Details Modal */}
      {selectedStage && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Stage Details</h3>
              <button
                onClick={() => setSelectedStage(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="flex items-center space-x-4 mb-6">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getStatusGradient(selectedStage.status)}`}>
                {getStatusIcon(selectedStage.status)}
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-900">{selectedStage.stage.name}</h4>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  selectedStage.status === 'completed' ? 'bg-green-100 text-green-800' :
                  selectedStage.status === 'current' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {selectedStage.status === 'completed' ? 'Completed' : 
                   selectedStage.status === 'current' ? 'In Progress' : 'Upcoming'}
                </span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h5 className="font-semibold text-gray-900 mb-2">Description</h5>
                <p className="text-gray-600">{selectedStage.stage.description}</p>
              </div>
              <div>
                <h5 className="font-semibold text-gray-900 mb-2">Estimated Duration</h5>
                <p className="text-gray-600">{selectedStage.stage.estimatedDuration}</p>
              </div>
              {selectedStage.status === 'current' && (
                <div className="bg-blue-50 p-4 rounded-xl">
                  <h5 className="font-semibold text-blue-900 mb-2">Current Status</h5>
                  <p className="text-blue-800 text-sm">This stage is currently being processed. We'll notify you of any updates.</p>
                </div>
              )}
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedStage(null)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressPage; 