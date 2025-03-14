from typing import Dict, Optional
import facebook
import requests
from google.ads.googleads.client import GoogleAdsClient
from app.core.config import settings
from app.models import Campaign

class FacebookAPI:
    def __init__(self):
        self.graph = facebook.GraphAPI(access_token=settings.FACEBOOK_ACCESS_TOKEN)
    
    async def create_campaign(self, campaign: Campaign) -> Dict:
        """
        יצירת קמפיין בפייסבוק
        """
        try:
            # יצירת קמפיין
            campaign_data = {
                "name": campaign.name,
                "objective": "REACH",
                "status": "PAUSED",
                "special_ad_categories": [],
                "budget_remaining": str(campaign.budget)
            }
            
            response = self.graph.post(
                path="act_{}/campaigns".format(settings.FACEBOOK_APP_ID),
                params=campaign_data
            )
            
            return {
                "platform_id": response["id"],
                "status": "created",
                "details": response
            }
            
        except Exception as e:
            return {
                "error": str(e),
                "status": "failed"
            }

class InstagramAPI:
    def __init__(self):
        self.fb_api = FacebookAPI()  # אינסטגרם משתמש ב-API של פייסבוק
    
    async def create_campaign(self, campaign: Campaign) -> Dict:
        """
        יצירת קמפיין באינסטגרם
        """
        try:
            # הוספת הגדרות ספציפיות לאינסטגרם
            campaign_data = await self.fb_api.create_campaign(campaign)
            campaign_data["platform"] = "instagram"
            
            return campaign_data
            
        except Exception as e:
            return {
                "error": str(e),
                "status": "failed"
            }

class GoogleAdsAPI:
    def __init__(self):
        self.client = GoogleAdsClient.load_from_storage()
    
    async def create_campaign(self, campaign: Campaign) -> Dict:
        """
        יצירת קמפיין בגוגל
        """
        try:
            # הגדרת הקמפיין
            campaign_service = self.client.get_service("CampaignService")
            campaign_operation = self.client.get_type("CampaignOperation")
            
            # יצירת הקמפיין
            campaign_obj = campaign_operation.create
            campaign_obj.name = campaign.name
            campaign_obj.advertising_channel_type = self.client.enums.AdvertisingChannelTypeEnum.SEARCH
            
            # הגדרת התקציב
            campaign_budget_service = self.client.get_service("CampaignBudgetService")
            campaign_budget_operation = self.client.get_type("CampaignBudgetOperation")
            campaign_budget = campaign_budget_operation.create
            campaign_budget.name = f"{campaign.name}_budget"
            campaign_budget.amount_micros = int(campaign.budget * 1000000)
            
            # שמירת הקמפיין
            response = campaign_service.mutate_campaigns(
                customer_id=settings.GOOGLE_ADS_CUSTOMER_ID,
                operations=[campaign_operation]
            )
            
            return {
                "platform_id": response.results[0].resource_name,
                "status": "created",
                "details": response.results[0]
            }
            
        except Exception as e:
            return {
                "error": str(e),
                "status": "failed"
            }

# פונקציות עזר ליצירת קמפיינים
async def create_facebook_campaign(campaign: Campaign) -> Optional[Dict]:
    """
    יצירת קמפיין בפייסבוק
    """
    fb_api = FacebookAPI()
    return await fb_api.create_campaign(campaign)

async def create_instagram_campaign(campaign: Campaign) -> Optional[Dict]:
    """
    יצירת קמפיין באינסטגרם
    """
    ig_api = InstagramAPI()
    return await ig_api.create_campaign(campaign)

async def create_google_campaign(campaign: Campaign) -> Optional[Dict]:
    """
    יצירת קמפיין בגוגל
    """
    google_api = GoogleAdsAPI()
    return await google_api.create_campaign(campaign) 