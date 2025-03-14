import { OpenAPI } from "../client/core/OpenAPI"
import { request } from "../client/core/request"
import type { CancelablePromise } from "../client/core/CancelablePromise"
import type { FacebookCampaign, InstagramInsight, GoogleAdsCampaign, CampaignHistoryData, CampaignStats } from "../types/campaigns"

export class SocialMediaService {
  public static getCampaignStats(): CancelablePromise<CampaignStats> {
    return request(OpenAPI, {
      method: "GET",
      url: "/api/v1/social/stats",
    })
  }

  public static getFacebookCampaigns(): CancelablePromise<FacebookCampaign[]> {
    return request(OpenAPI, {
      method: "GET",
      url: "/api/v1/social/facebook/campaigns",
    })
  }

  public static getInstagramInsights(): CancelablePromise<InstagramInsight[]> {
    return request(OpenAPI, {
      method: "GET",
      url: "/api/v1/social/instagram/insights",
    })
  }

  public static getGoogleAdsCampaigns(): CancelablePromise<GoogleAdsCampaign[]> {
    return request(OpenAPI, {
      method: "GET",
      url: "/api/v1/social/google-ads/campaigns",
    })
  }

  public static getCampaignHistory(
    platform: string,
    campaignId: string,
    startDate: string,
    endDate: string,
  ): CancelablePromise<CampaignHistoryData[]> {
    return request(OpenAPI, {
      method: "GET",
      url: `/api/v1/social/${platform}/campaigns/${campaignId}/history`,
      query: {
        start_date: startDate,
        end_date: endDate,
      },
    })
  }

  public static deleteCampaign(
    platform: string,
    campaignId: string,
  ): CancelablePromise<void> {
    return request(OpenAPI, {
      method: "DELETE",
      url: `/api/v1/social/${platform}/campaigns/${campaignId}`,
    })
  }
} 