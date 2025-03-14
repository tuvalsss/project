import axios from 'axios'

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
})

export interface ReferralData {
  referralLink: string
  referralCode: string
  activeReferrals: number
  earnings: number
}

export interface AffiliateService {
  getReferralData(): Promise<ReferralData>
  shareReferralLink(): Promise<void>
  getReferralsList(): Promise<Referral[]>
  getPaymentsHistory(): Promise<Payment[]>
  updateAffiliateSettings(settings: AffiliateSettings): Promise<void>
  getEarnings(): Promise<AffiliateEarnings>
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

export interface ChatResponse {
  message: string
  timestamp: string
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

export interface AffiliateEarnings {
  monthly_total: number
  average_per_affiliate: number
  active_affiliates: number
  top_affiliates: Array<{
    name: string
    earnings: number
  }>
}

export class AffiliateService {
  static async getReferralData(): Promise<ReferralData> {
    const response = await fetch('/api/v1/affiliates/referral-data')
    if (!response.ok) {
      throw new Error('Failed to fetch referral data')
    }
    return response.json()
  }

  static async shareReferralLink(): Promise<void> {
    const response = await fetch('/api/v1/affiliates/share-link', {
      method: 'POST',
    })
    if (!response.ok) {
      throw new Error('Failed to share referral link')
    }
  }

  static async getReferralsList(): Promise<Referral[]> {
    const response = await fetch('/api/v1/affiliates/referrals')
    if (!response.ok) {
      throw new Error('Failed to fetch referrals list')
    }
    return response.json()
  }

  static async getPaymentsHistory(): Promise<Payment[]> {
    const response = await fetch('/api/v1/affiliates/payments')
    if (!response.ok) {
      throw new Error('Failed to fetch payments history')
    }
    return response.json()
  }

  static async getAffiliateSettings(): Promise<AffiliateSettings> {
    const response = await fetch('/api/v1/affiliates/settings')
    if (!response.ok) {
      throw new Error('Failed to fetch affiliate settings')
    }
    return response.json()
  }

  static async updateAffiliateSettings(settings: AffiliateSettings): Promise<void> {
    const response = await fetch('/api/v1/affiliates/settings', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(settings),
    })
    if (!response.ok) {
      throw new Error('Failed to update affiliate settings')
    }
  }

  static async getEarnings(): Promise<AffiliateEarnings> {
    const response = await fetch('/api/v1/affiliates/earnings')
    if (!response.ok) {
      throw new Error('Failed to fetch affiliate earnings')
    }
    return response.json()
  }
}

export interface AiChatResponse {
  message: string
  timestamp: string
  suggestions?: string[]
  relatedData?: any
}

export interface AiAnalysisResult {
  performanceScore: number
  recommendations: string[]
  optimalPostingTimes: string[]
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
    marketShare: number
    topPerformers: Array<{
      name: string
      engagement: number
      reach: number
    }>
    trends: string[]
  }
}

export class AiService {
  static async getAdOptimization(): Promise<AdOptimizationData> {
    const response = await fetch('/api/v1/ai/ad-optimization')
    if (!response.ok) {
      throw new Error('Failed to fetch ad optimization data')
    }
    return response.json()
  }

  static async optimizeAds(): Promise<void> {
    const response = await fetch('/api/v1/ai/optimize-ads', {
      method: 'POST',
    })
    if (!response.ok) {
      throw new Error('Failed to optimize ads')
    }
  }

  static async getOptimalPostingTimes(platform: string): Promise<string[]> {
    const response = await fetch(`/api/v1/ai/optimal-times/${platform}`)
    if (!response.ok) {
      throw new Error('שגיאה בקבלת זמני פרסום אופטימליים')
    }
    return response.json()
  }

  static async analyzeContent(content: string): Promise<{
    sentiment: number
    keywords: string[]
    hashtags: string[]
    topics: string[]
  }> {
    const response = await fetch('/api/v1/ai/analyze-content', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content }),
    })
    if (!response.ok) {
      throw new Error('Failed to analyze content')
    }
    return response.json()
  }

  static async getCompetitorInsights(
    platform: 'facebook' | 'instagram' | 'google-ads',
    competitors: string[]
  ): Promise<{
    marketShare: number
    topPerformers: Array<{
      name: string
      engagement: number
      reach: number
    }>
    trends: string[]
  }> {
    const response = await fetch(`/api/v1/ai/competitor-insights/${platform}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ competitors }),
    })
    if (!response.ok) {
      throw new Error('Failed to fetch competitor insights')
    }
    return response.json()
  }

  static async generateContentSuggestions(topic: string): Promise<{
    headlines: string[]
    descriptions: string[]
    hashtags: string[]
  }> {
    const response = await fetch('/api/v1/ai/generate-content', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ topic }),
    })
    if (!response.ok) {
      throw new Error('שגיאה ביצירת הצעות תוכן')
    }
    return response.json()
  }

  static async chat(message: string, context?: any): Promise<{
    response: string
    suggestions: string[]
    relatedData: any
  }> {
    const response = await fetch('/api/v1/ai/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message, context }),
    })
    if (!response.ok) {
      throw new Error('שגיאה בשליחת הודעה')
    }
    return response.json()
  }

  static async analyzeCampaign(campaignId: string): Promise<AiAnalysisResult> {
    const response = await fetch(`/api/v1/ai/analyze-campaign/${campaignId}`)
    if (!response.ok) {
      throw new Error('שגיאה בניתוח הקמפיין')
    }
    return response.json()
  }
}

export interface CampaignStats {
  active_campaigns: number
  total_conversions: number
  average_roi: number
  monthly_budget: number
  budget_usage: number
  active_growth: number
  conversion_growth: number
  roi_growth: number
}

export class CampaignsService {
  static async getCampaignStats(): Promise<CampaignStats> {
    const response = await fetch('/api/v1/campaigns/stats')
    if (!response.ok) {
      throw new Error('Failed to fetch campaign stats')
    }
    return response.json()
  }
}

export enum UserRole {
  GUEST = 'guest',
  REGISTERED = 'registered',
  STARTER = 'starter',
  ADVANCED = 'advanced',
  PRO = 'pro',
  VIP = 'vip',
  ADMIN_LOW = 'admin_low',
  ADMIN_MEDIUM = 'admin_medium',
  ADMIN_HIGH = 'admin_high'
}

export interface UserSubscription {
  role: UserRole
  features: string[]
  integrations: {
    facebook: boolean
    instagram: boolean
    googleAds: boolean
    linkedin: boolean
    twitter: boolean
    tiktok: boolean
    snapchat: boolean
    pinterest: boolean
  }
  limits: {
    campaigns: number
    teamMembers: number
    storage: number
    apiCalls: number
  }
}

export interface UserPublic {
  id: string
  email: string
  full_name?: string
  role: UserRole
  subscription: UserSubscription
}

export interface UserRegister {
  email: string
  password: string
  full_name?: string
}

export interface Body_login_login_access_token {
  username: string
  password: string
}

export interface ApiError {
  detail: string
}

export interface OAuthConfig {
  google: {
    clientId: string
    redirectUri: string
  }
  facebook: {
    appId: string
    redirectUri: string
  }
}

export interface AuthToken {
  access_token: string
  refresh_token: string
  expires_in: number
  token_type: string
  scope: string
}

export class AuthService {
  private static readonly TOKEN_KEY = 'auth_token'
  private static readonly REFRESH_TOKEN_KEY = 'refresh_token'

  static async loginWithEmail(email: string, password: string): Promise<AuthToken> {
    const response = await fetch('/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
    if (!response.ok) {
      throw new Error('שגיאה בהתחברות')
    }
    const token = await response.json()
    this.setTokens(token)
    return token
  }

  static async loginWithGoogle(): Promise<void> {
    const response = await fetch('/api/v1/auth/google/config')
    if (!response.ok) {
      throw new Error('שגיאה בטעינת הגדרות Google')
    }
    const config = await response.json()
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${config.clientId}&redirect_uri=${config.redirectUri}&response_type=code&scope=email profile`
  }

  static async loginWithFacebook(): Promise<void> {
    const response = await fetch('/api/v1/auth/facebook/config')
    if (!response.ok) {
      throw new Error('שגיאה בטעינת הגדרות Facebook')
    }
    const config = await response.json()
    window.location.href = `https://www.facebook.com/v12.0/dialog/oauth?client_id=${config.appId}&redirect_uri=${config.redirectUri}&scope=email public_profile`
  }

  static async handleOAuthCallback(provider: 'google' | 'facebook', code: string): Promise<AuthToken> {
    const response = await fetch(`/api/v1/auth/${provider}/callback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    })
    if (!response.ok) {
      throw new Error('שגיאה בהשלמת התחברות OAuth')
    }
    const token = await response.json()
    this.setTokens(token)
    return token
  }

  static async refreshToken(): Promise<AuthToken> {
    const refreshToken = localStorage.getItem(this.REFRESH_TOKEN_KEY)
    if (!refreshToken) {
      throw new Error('אין טוקן רענון זמין')
    }

    const response = await fetch('/api/v1/auth/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    })
    if (!response.ok) {
      throw new Error('שגיאה ברענון הטוקן')
    }
    const token = await response.json()
    this.setTokens(token)
    return token
  }

  static async logout(): Promise<void> {
    const response = await fetch('/api/v1/auth/logout', {
      method: 'POST',
    })
    if (!response.ok) {
      throw new Error('שגיאה בהתנתקות')
    }
    this.clearTokens()
  }

  static getAuthToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY)
  }

  private static setTokens(token: AuthToken): void {
    localStorage.setItem(this.TOKEN_KEY, token.access_token)
    localStorage.setItem(this.REFRESH_TOKEN_KEY, token.refresh_token)
  }

  private static clearTokens(): void {
    localStorage.removeItem(this.TOKEN_KEY)
    localStorage.removeItem(this.REFRESH_TOKEN_KEY)
  }

  static isAuthenticated(): boolean {
    return !!this.getAuthToken()
  }
}

export interface UserProfile {
  firstName: string
  lastName: string
  email: string
  phone?: string
  avatarUrl?: string
  notifications: boolean
  twoFactorAuth: boolean
}

export class UserService {
  static async getProfile(): Promise<UserProfile> {
    const response = await fetch('/api/v1/users/profile', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    })
    if (!response.ok) {
      throw new Error('Failed to fetch user profile')
    }
    return response.json()
  }

  static async updateProfile(profile: Partial<UserProfile>): Promise<UserProfile> {
    const response = await fetch('/api/v1/users/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
      body: JSON.stringify(profile),
    })
    if (!response.ok) {
      throw new Error('Failed to update user profile')
    }
    return response.json()
  }

  static async uploadAvatar(file: File): Promise<{ url: string }> {
    const formData = new FormData()
    formData.append('avatar', file)

    const response = await fetch('/api/v1/users/avatar', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
      body: formData,
    })
    if (!response.ok) {
      throw new Error('Failed to upload avatar')
    }
    return response.json()
  }

  static async updatePassword(currentPassword: string, newPassword: string): Promise<void> {
    const response = await fetch('/api/v1/users/password', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    })
    if (!response.ok) {
      throw new Error('Failed to update password')
    }
  }

  static async enableTwoFactorAuth(): Promise<{ secret: string; qrCode: string }> {
    const response = await fetch('/api/v1/users/2fa/enable', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    })
    if (!response.ok) {
      throw new Error('Failed to enable 2FA')
    }
    return response.json()
  }

  static async verifyTwoFactorAuth(code: string): Promise<void> {
    const response = await fetch('/api/v1/users/2fa/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
      body: JSON.stringify({ code }),
    })
    if (!response.ok) {
      throw new Error('Failed to verify 2FA code')
    }
  }

  static async disableTwoFactorAuth(): Promise<void> {
    const response = await fetch('/api/v1/users/2fa/disable', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    })
    if (!response.ok) {
      throw new Error('Failed to disable 2FA')
    }
  }
}

export type Permission = 
  | 'canViewPublicStats'
  | 'canCreateCampaign'
  | 'canEditOwnCampaign'
  | 'canDeleteOwnCampaign'
  | 'canAccessBasicAnalytics'
  | 'canAccessAdvancedAnalytics'
  | 'canManageTeam'
  | 'canAccessAdmin'
  | 'canAccessIntegrations'
  | 'canAccessReports'
  | 'canAccessAffiliate'
  | 'canAccessPrioritySupport'
  | 'canAccessExclusiveFeatures'
  | 'canManageUsers'
  | 'canViewSystemStats'
  | 'canManageSystem'
  | 'canManageSubscriptions'
  | 'canManageAdmins'
  | 'canAccessAllFeatures'

export interface RolePermissionSet {
  canViewPublicStats: boolean
  canCreateCampaign: boolean
  canEditOwnCampaign?: boolean
  canDeleteOwnCampaign?: boolean
  canAccessBasicAnalytics?: boolean
  canAccessAdvancedAnalytics?: boolean
  canManageTeam?: boolean
  canAccessAdmin?: boolean
  canAccessIntegrations?: boolean
  canAccessReports?: boolean
  canAccessAffiliate?: boolean
  canAccessPrioritySupport?: boolean
  canAccessExclusiveFeatures?: boolean
  canManageUsers?: boolean
  canViewSystemStats?: boolean
  canManageSystem?: boolean
  canManageSubscriptions?: boolean
  canManageAdmins?: boolean
  canAccessAllFeatures?: boolean
}

export const RolePermissions: Record<UserRole, RolePermissionSet> = {
  [UserRole.GUEST]: {
    canViewPublicStats: true,
    canCreateCampaign: false,
    canEditOwnCampaign: false,
    canDeleteOwnCampaign: false,
    canAccessBasicAnalytics: false,
    canManageTeam: false,
    canAccessAdmin: false,
    canAccessIntegrations: false,
    canAccessReports: false,
    canAccessAffiliate: false
  },
  [UserRole.REGISTERED]: {
    canViewPublicStats: true,
    canCreateCampaign: true,
    canEditOwnCampaign: true,
    canDeleteOwnCampaign: true,
    canAccessBasicAnalytics: true,
    canManageTeam: false,
    canAccessAdmin: false,
    canAccessIntegrations: true,
    canAccessReports: false,
    canAccessAffiliate: false
  },
  [UserRole.STARTER]: {
    canViewPublicStats: true,
    canCreateCampaign: true,
    canEditOwnCampaign: true,
    canDeleteOwnCampaign: true,
    canAccessBasicAnalytics: true,
    canManageTeam: false,
    canAccessAdmin: false,
    canAccessIntegrations: true,
    canAccessReports: true,
    canAccessAffiliate: true
  },
  [UserRole.ADVANCED]: {
    canViewPublicStats: true,
    canCreateCampaign: true,
    canEditOwnCampaign: true,
    canDeleteOwnCampaign: true,
    canAccessAdvancedAnalytics: true,
    canManageTeam: true,
    canAccessAdmin: false,
    canAccessIntegrations: true,
    canAccessReports: true,
    canAccessAffiliate: true
  },
  [UserRole.PRO]: {
    canViewPublicStats: true,
    canCreateCampaign: true,
    canEditOwnCampaign: true,
    canDeleteOwnCampaign: true,
    canAccessAdvancedAnalytics: true,
    canManageTeam: true,
    canAccessAdmin: false,
    canAccessIntegrations: true,
    canAccessReports: true,
    canAccessAffiliate: true,
    canAccessPrioritySupport: true
  },
  [UserRole.VIP]: {
    canViewPublicStats: true,
    canCreateCampaign: true,
    canEditOwnCampaign: true,
    canDeleteOwnCampaign: true,
    canAccessAdvancedAnalytics: true,
    canManageTeam: true,
    canAccessAdmin: false,
    canAccessIntegrations: true,
    canAccessReports: true,
    canAccessAffiliate: true,
    canAccessPrioritySupport: true,
    canAccessExclusiveFeatures: true
  },
  [UserRole.ADMIN_LOW]: {
    canViewPublicStats: true,
    canCreateCampaign: true,
    canEditOwnCampaign: true,
    canDeleteOwnCampaign: true,
    canAccessAdvancedAnalytics: true,
    canManageTeam: true,
    canAccessAdmin: true,
    canAccessIntegrations: true,
    canAccessReports: true,
    canAccessAffiliate: true,
    canAccessPrioritySupport: true,
    canAccessExclusiveFeatures: true,
    canManageUsers: true,
    canViewSystemStats: true
  },
  [UserRole.ADMIN_MEDIUM]: {
    canViewPublicStats: true,
    canCreateCampaign: true,
    canEditOwnCampaign: true,
    canDeleteOwnCampaign: true,
    canAccessAdvancedAnalytics: true,
    canManageTeam: true,
    canAccessAdmin: true,
    canAccessIntegrations: true,
    canAccessReports: true,
    canAccessAffiliate: true,
    canAccessPrioritySupport: true,
    canAccessExclusiveFeatures: true,
    canManageUsers: true,
    canViewSystemStats: true,
    canManageSystem: true,
    canManageSubscriptions: true
  },
  [UserRole.ADMIN_HIGH]: {
    canViewPublicStats: true,
    canCreateCampaign: true,
    canEditOwnCampaign: true,
    canDeleteOwnCampaign: true,
    canAccessAdvancedAnalytics: true,
    canManageTeam: true,
    canAccessAdmin: true,
    canAccessIntegrations: true,
    canAccessReports: true,
    canAccessAffiliate: true,
    canAccessPrioritySupport: true,
    canAccessExclusiveFeatures: true,
    canManageUsers: true,
    canViewSystemStats: true,
    canManageSystem: true,
    canManageSubscriptions: true,
    canManageAdmins: true,
    canAccessAllFeatures: true
  }
}

export interface PaymentMethod {
  id: string
  type: 'credit_card' | 'paypal' | 'bank_transfer'
  details: {
    last4?: string
    brand?: string
    expiry?: string
    bankName?: string
    accountNumber?: string
  }
  isDefault: boolean
}

export interface Transaction {
  id: string
  amount: number
  currency: string
  status: 'pending' | 'completed' | 'failed'
  type: 'payment' | 'refund' | 'commission'
  date: string
  description: string
  metadata: Record<string, any>
}

export class PaymentService {
  static async getPaymentMethods(): Promise<PaymentMethod[]> {
    const response = await fetch('/api/v1/payments/methods')
    if (!response.ok) {
      throw new Error('שגיאה בטעינת אמצעי תשלום')
    }
    return response.json()
  }

  static async addPaymentMethod(method: Omit<PaymentMethod, 'id'>): Promise<PaymentMethod> {
    const response = await fetch('/api/v1/payments/methods', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(method),
    })
    if (!response.ok) {
      throw new Error('שגיאה בהוספת אמצעי תשלום')
    }
    return response.json()
  }

  static async removePaymentMethod(methodId: string): Promise<void> {
    const response = await fetch(`/api/v1/payments/methods/${methodId}`, {
      method: 'DELETE',
    })
    if (!response.ok) {
      throw new Error('שגיאה בהסרת אמצעי תשלום')
    }
  }

  static async getTransactions(): Promise<Transaction[]> {
    const response = await fetch('/api/v1/payments/transactions')
    if (!response.ok) {
      throw new Error('שגיאה בטעינת היסטוריית תשלומים')
    }
    return response.json()
  }

  static async processPayment(amount: number, methodId: string): Promise<Transaction> {
    const response = await fetch('/api/v1/payments/process', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount, methodId }),
    })
    if (!response.ok) {
      throw new Error('שגיאה בעיבוד התשלום')
    }
    return response.json()
  }

  static async requestRefund(transactionId: string, reason: string): Promise<Transaction> {
    const response = await fetch(`/api/v1/payments/refund/${transactionId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ reason }),
    })
    if (!response.ok) {
      throw new Error('שגיאה בבקשת החזר')
    }
    return response.json()
  }
}

export interface Notification {
  id: string
  type: 'campaign' | 'payment' | 'system' | 'ai'
  title: string
  message: string
  timestamp: string
  read: boolean
  data?: any
}

export class NotificationService {
  private static ws: WebSocket | null = null
  private static listeners: ((notification: Notification) => void)[] = []

  static connect(): void {
    if (this.ws) return

    this.ws = new WebSocket(process.env.REACT_APP_WS_URL || 'ws://localhost:8000/ws')
    
    this.ws.onmessage = (event) => {
      const notification: Notification = JSON.parse(event.data)
      this.listeners.forEach(listener => listener(notification))
    }

    this.ws.onclose = () => {
      setTimeout(() => this.connect(), 5000)
    }
  }

  static disconnect(): void {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
  }

  static subscribe(listener: (notification: Notification) => void): () => void {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener)
    }
  }

  static async getNotifications(): Promise<Notification[]> {
    const response = await fetch('/api/v1/notifications')
    if (!response.ok) {
      throw new Error('שגיאה בטעינת התראות')
    }
    return response.json()
  }

  static async markAsRead(notificationId: string): Promise<void> {
    const response = await fetch(`/api/v1/notifications/${notificationId}/read`, {
      method: 'PUT',
    })
    if (!response.ok) {
      throw new Error('שגיאה בסימון התראה כנקראה')
    }
  }

  static async markAllAsRead(): Promise<void> {
    const response = await fetch('/api/v1/notifications/read-all', {
      method: 'PUT',
    })
    if (!response.ok) {
      throw new Error('שגיאה בסימון כל ההתראות כנקראו')
    }
  }

  static async deleteNotification(notificationId: string): Promise<void> {
    const response = await fetch(`/api/v1/notifications/${notificationId}`, {
      method: 'DELETE',
    })
    if (!response.ok) {
      throw new Error('שגיאה במחיקת התראה')
    }
  }
}

export class UsersService {
  static async getAllUsers(): Promise<UserPublic[]> {
    const response = await fetch('/api/v1/users', {
      headers: {
        Authorization: `Bearer ${AuthService.getAuthToken()}`,
      },
    })
    if (!response.ok) {
      throw new Error('שגיאה בטעינת משתמשים')
    }
    return response.json()
  }

  static async updateUserRole(userId: string, role: UserRole): Promise<void> {
    const response = await fetch(`/api/v1/users/${userId}/role`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${AuthService.getAuthToken()}`,
      },
      body: JSON.stringify({ role }),
    })
    if (!response.ok) {
      throw new Error('שגיאה בעדכון תפקיד המשתמש')
    }
  }

  static async deleteUser(userId: string): Promise<void> {
    const response = await fetch(`/api/v1/users/${userId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${AuthService.getAuthToken()}`,
      },
    })
    if (!response.ok) {
      throw new Error('שגיאה במחיקת משתמש')
    }
  }

  static async updateUserPermissions(userId: string, permissions: Partial<RolePermissionSet>): Promise<void> {
    const response = await fetch(`/api/v1/users/${userId}/permissions`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${AuthService.getAuthToken()}`,
      },
      body: JSON.stringify({ permissions }),
    })
    if (!response.ok) {
      throw new Error('שגיאה בעדכון הרשאות המשתמש')
    }
  }

  static async getUserStats(userId: string): Promise<{
    totalCampaigns: number
    activeCampaigns: number
    totalSpent: number
    averageROI: number
    lastActivity: string
  }> {
    const response = await fetch(`/api/v1/users/${userId}/stats`, {
      headers: {
        Authorization: `Bearer ${AuthService.getAuthToken()}`,
      },
    })
    if (!response.ok) {
      throw new Error('שגיאה בטעינת סטטיסטיקות משתמש')
    }
    return response.json()
  }

  static async getUserActivity(userId: string): Promise<Array<{
    type: string
    description: string
    timestamp: string
    metadata: any
  }>> {
    const response = await fetch(`/api/v1/users/${userId}/activity`, {
      headers: {
        Authorization: `Bearer ${AuthService.getAuthToken()}`,
      },
    })
    if (!response.ok) {
      throw new Error('שגיאה בטעינת פעילות המשתמש')
    }
    return response.json()
  }
} 