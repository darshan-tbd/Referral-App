// API response creators
export const createApiResponse = (data, message = 'Success', statusCode = 200) => ({
  data,
  message,
  success: statusCode >= 200 && statusCode < 300,
  timestamp: new Date().toISOString(),
  statusCode,
});

export const createApiError = (message, statusCode = 500, path = '', details = {}) => ({
  message,
  error: 'ApiError',
  statusCode,
  timestamp: new Date().toISOString(),
  path,
  details,
});

export const createPaginatedResponse = (data, pagination) => ({
  data,
  pagination: {
    page: pagination.page || 1,
    limit: pagination.limit || 10,
    total: pagination.total || 0,
    pages: pagination.pages || 0,
    hasNext: pagination.hasNext || false,
    hasPrev: pagination.hasPrev || false,
  },
});

export const createApiRequestConfig = (config = {}) => ({
  baseURL: config.baseURL || '',
  timeout: config.timeout || 10000,
  headers: config.headers || {},
  withCredentials: config.withCredentials || false,
});

export const createValidationError = (field, message, code, value = null) => ({
  field,
  message,
  code,
  value,
});

export const createApiValidationError = (message, errors = [], statusCode = 400) => ({
  message,
  error: 'ValidationError',
  statusCode,
  timestamp: new Date().toISOString(),
  path: '',
  details: {},
  errors,
});

// Progress tracking creators
export const createProgressStep = (stepData) => ({
  id: stepData.id || '',
  stage: stepData.stage || '',
  title: stepData.title || '',
  description: stepData.description || '',
  status: stepData.status || 'pending',
  completedAt: stepData.completedAt || null,
  order: stepData.order || 0,
  isActive: stepData.isActive !== undefined ? stepData.isActive : false,
  requirements: stepData.requirements || [],
  documents: stepData.documents || [],
});

export const createProgressTracker = (trackerData) => ({
  userId: trackerData.userId || '',
  steps: trackerData.steps || [],
  currentStep: trackerData.currentStep || 0,
  overallProgress: trackerData.overallProgress || 0,
  estimatedCompletion: trackerData.estimatedCompletion || null,
  lastUpdated: trackerData.lastUpdated || new Date().toISOString(),
}); 