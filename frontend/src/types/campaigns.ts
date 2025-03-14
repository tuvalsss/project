export interface FacebookCampaign {
  id: string
  name: string
  status: 'active' | 'paused' | 'deleted'
  budget: number
  spent: number
  reach: number
  impressions: number
  clicks: number
  conversions: number
}

export interface InstagramInsight {
  id: string
  postId: string
  likes: number
  comments: number
  shares: number
  reach: number
  impressions: number
  engagement_rate: number
}

export interface GoogleAdsCampaign {
  id: string
  name: string
  status: 'enabled' | 'paused' | 'removed'
  budget: number
  clicks: number
  impressions: number
  ctr: number
  conversions: number
  cost_per_conversion: number
}

export interface CampaignStats {
  active_campaigns: number
  active_growth: number
  total_conversions: number
  conversion_growth: number
  average_roi: number
  roi_growth: number
  monthly_budget: number
  budget_usage: number
}

export interface CampaignHistoryData {
  date: string
  impressions: number
  clicks: number
  conversions: number
  cost: number
  revenue: number
} 