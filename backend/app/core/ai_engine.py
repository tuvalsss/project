from typing import Dict, List
import openai
from app.core.config import settings
from app.models import Campaign

# הגדרת ה-API key של OpenAI
openai.api_key = settings.OPENAI_API_KEY

async def analyze_campaign_performance(campaign: Campaign) -> Dict:
    """
    ניתוח ביצועי קמפיין באמצעות OpenAI
    """
    # יצירת הטקסט לניתוח
    analysis_prompt = f"""
    Analyze the following marketing campaign and provide insights:
    
    Campaign Name: {campaign.name}
    Platform: {campaign.platform}
    Budget: ${campaign.budget}
    Target Audience: {campaign.target_audience}
    Performance Metrics: {campaign.performance_metrics}
    
    Please provide:
    1. Key insights about the campaign performance
    2. Specific recommendations for improvement
    3. Performance score (0-100)
    4. Areas that need improvement
    """
    
    try:
        # שליחת הבקשה ל-OpenAI
        response = await openai.ChatCompletion.acreate(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a marketing analytics expert."},
                {"role": "user", "content": analysis_prompt}
            ]
        )
        
        # עיבוד התשובה
        analysis_text = response.choices[0].message.content
        
        # חילוץ התובנות מהטקסט
        insights = {}
        recommendations = []
        improvement_areas = []
        performance_score = 0.0
        
        # כאן יש להוסיף לוגיקה לחילוץ המידע מהטקסט
        # לדוגמה:
        insights = {
            "engagement_rate": "High",
            "cost_per_click": "Below average",
            "conversion_rate": "Needs improvement"
        }
        recommendations = [
            "Increase budget allocation for best performing ad sets",
            "Refine targeting parameters",
            "Test different ad creatives"
        ]
        improvement_areas = [
            "Conversion optimization",
            "Ad creative diversity",
            "Audience targeting"
        ]
        performance_score = 75.5
        
        return {
            "insights": insights,
            "recommendations": recommendations,
            "performance_score": performance_score,
            "improvement_areas": improvement_areas
        }
        
    except Exception as e:
        # במקרה של שגיאה, נחזיר ניתוח בסיסי
        return {
            "insights": {"error": str(e)},
            "recommendations": ["Unable to generate recommendations"],
            "performance_score": 0.0,
            "improvement_areas": ["System error"]
        }

async def generate_campaign_suggestions(
    platform: str,
    target_audience: str,
    budget: float
) -> List[Dict]:
    """
    יצירת הצעות לקמפיינים חדשים באמצעות AI
    """
    suggestion_prompt = f"""
    Generate 3 campaign suggestions for:
    Platform: {platform}
    Target Audience: {target_audience}
    Budget: ${budget}
    
    For each campaign, provide:
    1. Campaign name
    2. Key message
    3. Targeting strategy
    4. Budget allocation
    5. Expected outcomes
    """
    
    try:
        response = await openai.ChatCompletion.acreate(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a creative marketing strategist."},
                {"role": "user", "content": suggestion_prompt}
            ]
        )
        
        # עיבוד התשובה ויצירת הצעות
        suggestions = []
        # כאן יש להוסיף לוגיקה לעיבוד התשובה
        
        return suggestions
        
    except Exception as e:
        return [{"error": str(e)}] 