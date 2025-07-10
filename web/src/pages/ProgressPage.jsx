import React from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { VISA_STAGES } from '../../../shared/constants/config.js';

const ProgressPage = () => {
  const { user } = useAuth();

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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return (
          <svg className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'current':
        return (
          <svg className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return <div className="w-2 h-2 sm:w-3 sm:h-3 bg-white rounded-full"></div>;
    }
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Visa Progress</h1>
        <p className="text-sm sm:text-base text-gray-600">Track your visa application progress</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            <div>
              <h3 className="text-base sm:text-lg font-medium text-gray-900">{user?.visaType || 'Visa Application'}</h3>
              <p className="text-sm text-gray-600">Application ID: {user?.visaApplicationNumber || 'N/A'}</p>
            </div>
            <div className="sm:text-right">
              <p className="text-sm font-medium text-gray-900">Current Stage</p>
              <p className="text-sm text-gray-600 capitalize">{user?.currentVisaStage?.replace('_', ' ')}</p>
            </div>
          </div>
        </div>

        <div className="relative">
          {Object.entries(VISA_STAGES).map(([stageId, stage], index) => {
            const status = getStageStatus(stageId);
            const isLast = index === Object.keys(VISA_STAGES).length - 1;
            
            return (
              <div key={stageId} className="relative">
                <div className="flex items-start">
                  <div className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full ${getStatusColor(status)} relative z-10 flex-shrink-0`}>
                    {getStatusIcon(status)}
                  </div>
                  <div className="ml-3 sm:ml-4 flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div className="mb-2 sm:mb-0">
                        <h4 className={`text-sm sm:text-base font-medium ${status === 'current' ? 'text-blue-600' : 'text-gray-900'}`}>
                          {stage.name}
                        </h4>
                        <p className="text-xs sm:text-sm text-gray-500 mt-1">{stage.description}</p>
                      </div>
                      <div className="sm:text-right sm:ml-4 flex-shrink-0">
                        <p className="text-xs sm:text-sm text-gray-500">{stage.estimatedDuration}</p>
                        {status === 'completed' && (
                          <p className="text-xs sm:text-sm text-green-600 font-medium">Completed</p>
                        )}
                        {status === 'current' && (
                          <p className="text-xs sm:text-sm text-blue-600 font-medium">In Progress</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                {!isLast && (
                  <div className={`absolute left-4 sm:left-5 top-8 sm:top-10 w-0.5 h-12 sm:h-16 ${status === 'completed' ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-blue-50 rounded-lg">
          <h4 className="text-sm sm:text-base font-medium text-blue-900 mb-2">Next Steps</h4>
          <p className="text-sm sm:text-base text-blue-800">
            {user?.currentVisaStage === 'completed' 
              ? 'Your visa application has been completed successfully!'
              : 'We will update you once your application progresses to the next stage.'}
          </p>
        </div>

        {/* Progress Summary */}
        <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <div className="text-lg sm:text-xl font-bold text-gray-900">
              {Object.entries(VISA_STAGES).filter(([stageId]) => getStageStatus(stageId) === 'completed').length}
            </div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <div className="text-lg sm:text-xl font-bold text-blue-600">
              {Object.entries(VISA_STAGES).filter(([stageId]) => getStageStatus(stageId) === 'current').length}
            </div>
            <div className="text-sm text-blue-600">In Progress</div>
          </div>
          <div className="bg-orange-50 rounded-lg p-4 text-center">
            <div className="text-lg sm:text-xl font-bold text-orange-600">
              {Object.entries(VISA_STAGES).filter(([stageId]) => getStageStatus(stageId) === 'upcoming').length}
            </div>
            <div className="text-sm text-orange-600">Upcoming</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6 sm:mt-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Overall Progress</span>
            <span className="text-sm font-medium text-gray-700">
              {Math.round((Object.entries(VISA_STAGES).filter(([stageId]) => getStageStatus(stageId) === 'completed').length / Object.keys(VISA_STAGES).length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ 
                width: `${(Object.entries(VISA_STAGES).filter(([stageId]) => getStageStatus(stageId) === 'completed').length / Object.keys(VISA_STAGES).length) * 100}%` 
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressPage; 