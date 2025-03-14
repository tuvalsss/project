import { ItemsService, LoginService, UsersService } from './client/sdk.gen'
import type { UserPublic, ItemPublic } from './client/types.gen'
import { OpenAPI } from './client/core/OpenAPI'
import type { ApiError } from './client/core/ApiError'
import { request } from './client/core/request'

export { ItemsService, LoginService, UsersService, OpenAPI }
export type { UserPublic, ItemPublic, ApiError }

// Enums
export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export enum Permission {
  READ = 'READ',
  WRITE = 'WRITE',
  DELETE = 'DELETE',
}

export interface RolePermissions {
  [UserRole.ADMIN]: Permission[]
  [UserRole.USER]: Permission[]
}

// Social Media Service
class SocialMediaServiceImpl {
  static async getFacebookCampaigns() {
    return request(OpenAPI, {
      method: "GET",
      url: "/api/v1/social/facebook/campaigns",
    })
  }

  static async getInstagramInsights() {
    return request(OpenAPI, {
      method: "GET",
      url: "/api/v1/social/instagram/insights",
    })
  }

  static async getGoogleAdsStats() {
    return request(OpenAPI, {
      method: "GET",
      url: "/api/v1/social/google-ads/stats",
    })
  }

  static async createCampaign(platform: string, data: any) {
    return request(OpenAPI, {
      method: "POST",
      url: `/api/v1/social/${platform}/campaigns`,
      body: data,
    })
  }

  static async updateCampaign(platform: string, campaignId: string, data: any) {
    return request(OpenAPI, {
      method: "PUT",
      url: `/api/v1/social/${platform}/campaigns/${campaignId}`,
      body: data,
    })
  }

  static async deleteCampaign(platform: string, campaignId: string) {
    return request(OpenAPI, {
      method: "DELETE",
      url: `/api/v1/social/${platform}/campaigns/${campaignId}`,
    })
  }

  static async getCampaignHistory(platform: string) {
    return request(OpenAPI, {
      method: "GET",
      url: `/api/v1/social/${platform}/history`,
    })
  }

  static async getIntegrationsStatus() {
    return request(OpenAPI, {
      method: "GET",
      url: "/api/v1/social/integrations/status",
    })
  }

  static async connectPlatform(platform: string) {
    return request(OpenAPI, {
      method: "POST",
      url: `/api/v1/social/integrations/${platform}/connect`,
    })
  }

  static async disconnectPlatform(platform: string) {
    return request(OpenAPI, {
      method: "POST",
      url: `/api/v1/social/integrations/${platform}/disconnect`,
    })
  }

  static async deletePost(platform: string, postId: string) {
    return request(OpenAPI, {
      method: "DELETE",
      url: `/api/v1/social/${platform}/posts/${postId}`,
    })
  }
}

export const SocialMediaService = SocialMediaServiceImpl

// Types for social media
export interface FacebookCampaign {
  id: string
  name: string
  status: string
  budget: number
  startDate: string
  endDate: string
  reach: number
  engagement: number
}

export interface InstagramInsight {
  id: string
  type: string
  value: number
  endTime: string
  title: string
  description: string
}

export interface GoogleAdsCampaign {
  id: string
  name: string
  status: string
  budget: number
  clicks: number
  impressions: number
  ctr: number
  conversions: number
}

export interface CampaignHistoryData {
  id: string
  date: string
  platform: string
  metrics: {
    reach: number
    engagement: number
    clicks: number
    conversions: number
  }
}

export interface IntegrationStatus {
  facebook: boolean
  instagram: boolean
  googleAds: boolean
}

// Affiliate Service
export interface ReferralData {
  referralLink: string
  referralCode: string
  activeReferrals: number
  earnings: number
}

export interface Referral {
  id: string
  name: string
  email: string
  date: string
  status: 'active' | 'pending' | 'inactive'
  commission: number
}

export interface Payment {
  id: string
  amount: number
  date: string
  status: 'pending' | 'completed' | 'failed'
  method: string
}

export interface AffiliateSettings {
  paymentMethod: string
  paymentDetails: {
    bankAccount?: string
    paypalEmail?: string
    cryptoWallet?: string
  }
  minimumPayout: number
  notifications: {
    email: boolean
    push: boolean
  }
}

export interface AffiliateEarnings {
  monthly_total: number
  average_per_affiliate: number
  active_affiliates: number
  top_affiliates: Array<{
    name: string
    earnings: number
  }>
}

class AffiliateServiceImpl {
  static async getReferralData(): Promise<ReferralData> {
    return request(OpenAPI, {
      method: "GET",
      url: "/api/v1/affiliates/referral-data",
    })
  }

  static async shareReferralLink(): Promise<void> {
    return request(OpenAPI, {
      method: "POST",
      url: "/api/v1/affiliates/share-link",
    })
  }

  static async getReferralsList(): Promise<Referral[]> {
    return request(OpenAPI, {
      method: "GET",
      url: "/api/v1/affiliates/referrals",
    })
  }

  static async getPaymentsHistory(): Promise<Payment[]> {
    return request(OpenAPI, {
      method: "GET",
      url: "/api/v1/affiliates/payments",
    })
  }

  static async getAffiliateSettings(): Promise<AffiliateSettings> {
    return request(OpenAPI, {
      method: "GET",
      url: "/api/v1/affiliates/settings",
    })
  }

  static async updateAffiliateSettings(settings: AffiliateSettings): Promise<void> {
    return request(OpenAPI, {
      method: "PUT",
      url: "/api/v1/affiliates/settings",
      body: settings,
    })
  }

  static async getEarnings(): Promise<AffiliateEarnings> {
    return request(OpenAPI, {
      method: "GET",
      url: "/api/v1/affiliates/earnings",
    })
  }
}

export const AffiliateService = AffiliateServiceImpl

// AI Service
export interface AiChatResponse {
  message: string
  timestamp: string
  suggestions?: string[]
  relatedData?: any
}

export interface AdOptimizationData {
  currentScore: number
  potentialImprovement: number
  recommendations: string[]
  suggestedTimes: string[]
  sentimentAnalysis: {
    positive: number
    negative: number
    neutral: number
  }
  contentSuggestions: {
    keywords: string[]
    hashtags: string[]
    topics: string[]
  }
  competitorAnalysis: {
    topPerformers: Array<{
      name: string
      engagement: number
      reach: number
    }>
    marketTrends: string[]
  }
}

class AiServiceImpl {
  static async chat(message: string): Promise<AiChatResponse> {
    return request(OpenAPI, {
      method: "POST",
      url: "/api/v1/ai/chat",
      body: { message },
    })
  }

  static async getOptimizationData(): Promise<AdOptimizationData> {
    return request(OpenAPI, {
      method: "GET",
      url: "/api/v1/ai/optimization",
    })
  }
}

export const AiService = AiServiceImpl

// Auth Service
class AuthServiceImpl {
  static async getCurrentUser() {
    return request(OpenAPI, {
      method: "GET",
      url: "/api/v1/auth/me",
    })
  }

  static async logout() {
    return request(OpenAPI, {
      method: "POST",
      url: "/api/v1/auth/logout",
    })
  }
}

export const AuthService = AuthServiceImpl

// Campaigns Service
export interface CampaignStats {
  totalCampaigns: number
  activeCampaigns: number
  completedCampaigns: number
  averageEngagement: number
  totalSpend: number
  roi: number
}

class CampaignsServiceImpl {
  static async getStats(): Promise<CampaignStats> {
    return request(OpenAPI, {
      method: "GET",
      url: "/api/v1/campaigns/stats",
    })
  }
}

export const CampaignsService = CampaignsServiceImpl

// User Service
export interface UserProfile {
  id: string
  name: string
  email: string
  role: string
  settings: {
    notifications: boolean
    theme: string
  }
}

class UserServiceImpl {
  static async getProfile(): Promise<UserProfile> {
    return request(OpenAPI, {
      method: "GET",
      url: "/api/v1/users/profile",
    })
  }

  static async updateProfile(profile: Partial<UserProfile>): Promise<UserProfile> {
    return request(OpenAPI, {
      method: "PUT",
      url: "/api/v1/users/profile",
      body: profile,
    })
  }
}

export const UserService = UserServiceImpl 