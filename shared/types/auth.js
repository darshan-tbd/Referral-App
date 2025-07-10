// User schema and validation
export const VISA_STAGES = [
  'enquiry',
  'detailed_enquiry',
  'assessment',
  'application',
  'payment',
  'completed'
];

export const createUser = (userData) => ({
  id: userData.id || '',
  email: userData.email || '',
  name: userData.name || '',
  phone: userData.phone || null,
  country: userData.country || null,
  isActive: userData.isActive !== undefined ? userData.isActive : true,
  emailVerified: userData.emailVerified !== undefined ? userData.emailVerified : false,
  createdAt: userData.createdAt || new Date().toISOString(),
  updatedAt: userData.updatedAt || new Date().toISOString(),
  lastLogin: userData.lastLogin || null,
  profilePictureUrl: userData.profilePictureUrl || null,
  preferredLanguage: userData.preferredLanguage || 'en',
  timezone: userData.timezone || 'UTC',
  
  // Visa-specific fields
  visaApplicationNumber: userData.visaApplicationNumber || null,
  currentVisaStage: userData.currentVisaStage || 'enquiry',
  visaType: userData.visaType || null,
  applicationDate: userData.applicationDate || null,
  
  // Referral tracking
  referredBy: userData.referredBy || null,
  referralCode: userData.referralCode || null,
});

export const createAuthState = (initialState = {}) => ({
  user: initialState.user || null,
  token: initialState.token || null,
  refreshToken: initialState.refreshToken || null,
  isAuthenticated: initialState.isAuthenticated || false,
  isLoading: initialState.isLoading || false,
  error: initialState.error || null,
});

export const createLoginCredentials = (email, password) => ({
  email,
  password,
});

export const createRegisterData = (userData) => ({
  name: userData.name || '',
  email: userData.email || '',
  password: userData.password || '',
  phone: userData.phone || null,
  country: userData.country || null,
  visaType: userData.visaType || null,
  referralCode: userData.referralCode || null,
});

export const createAuthResponse = (responseData) => ({
  user: responseData.user || null,
  token: responseData.token || '',
  refreshToken: responseData.refreshToken || '',
  expiresAt: responseData.expiresAt || '',
});

export const createTokenPayload = (tokenData) => ({
  user_id: tokenData.user_id || '',
  email: tokenData.email || '',
  name: tokenData.name || '',
  role: tokenData.role || 'client',
  exp: tokenData.exp || 0,
  iat: tokenData.iat || 0,
}); 