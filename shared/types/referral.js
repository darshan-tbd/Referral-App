// Referral status options
export const REFERRAL_STATUS = [
  'pending',
  'contacted',
  'qualified',
  'converted',
  'completed',
  'rejected'
];

export const createReferral = (referralData) => ({
  id: referralData.id || '',
  referrerId: referralData.referrerId || '',
  
  // Referred person details
  referredName: referralData.referredName || '',
  referredEmail: referralData.referredEmail || '',
  referredPhone: referralData.referredPhone || null,
  referredCountry: referralData.referredCountry || null,
  visaType: referralData.visaType || null,
  
  // Referral tracking
  referralLink: referralData.referralLink || null,
  referralCode: referralData.referralCode || null,
  status: referralData.status || 'pending',
  convertedAt: referralData.convertedAt || null,
  conversionType: referralData.conversionType || null,
  
  // Metadata
  notes: referralData.notes || null,
  source: referralData.source || 'manual_form',
  utmSource: referralData.utmSource || null,
  utmMedium: referralData.utmMedium || null,
  utmCampaign: referralData.utmCampaign || null,
  
  // Audit fields
  createdAt: referralData.createdAt || new Date().toISOString(),
  updatedAt: referralData.updatedAt || new Date().toISOString(),
});

export const createReferralFormData = (formData) => ({
  referrerId: formData.referrerId || '',
  referredName: formData.referredName || '',
  referredEmail: formData.referredEmail || '',
  referredPhone: formData.referredPhone || null,
  referredCountry: formData.referredCountry || null,
  visaType: formData.visaType || null,
  notes: formData.notes || null,
  source: formData.source || 'manual_form',
});

export const createReferralStats = (statsData) => ({
  total: statsData.total || 0,
  pending: statsData.pending || 0,
  contacted: statsData.contacted || 0,
  qualified: statsData.qualified || 0,
  converted: statsData.converted || 0,
  rejected: statsData.rejected || 0,
  conversionRate: statsData.conversionRate || 0,
  totalEarnings: statsData.totalEarnings || 0,
  recentReferrals: statsData.recentReferrals || [],
});

export const createReferralLink = (linkData) => ({
  id: linkData.id || '',
  referrerId: linkData.referrerId || '',
  code: linkData.code || '',
  url: linkData.url || '',
  clicks: linkData.clicks || 0,
  conversions: linkData.conversions || 0,
  isActive: linkData.isActive !== undefined ? linkData.isActive : true,
  expiresAt: linkData.expiresAt || null,
  createdAt: linkData.createdAt || new Date().toISOString(),
  updatedAt: linkData.updatedAt || new Date().toISOString(),
}); 