// Export all auth types
export * from './auth.js';

// Export all referral types
export * from './referral.js';

// Export all notification types
export * from './notification.js';

// Export all API types
export * from './api.js';

// Common utility types
export const createBaseEntity = (data) => ({
  id: data.id || '',
  createdAt: data.createdAt || new Date().toISOString(),
  updatedAt: data.updatedAt || new Date().toISOString(),
});

export const createSelectOption = (label, value) => ({
  label,
  value,
});

export const createCountry = (countryData) => ({
  code: countryData.code || '',
  name: countryData.name || '',
  dialCode: countryData.dialCode || '',
  flag: countryData.flag || '',
});

export const createVisaTypeOption = (optionData) => ({
  id: optionData.id || '',
  name: optionData.name || '',
  description: optionData.description || '',
  category: optionData.category || '',
  processingTime: optionData.processingTime || '',
  requirements: optionData.requirements || [],
}); 