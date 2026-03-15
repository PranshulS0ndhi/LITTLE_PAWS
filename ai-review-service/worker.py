import asyncio
import logging
from redis_client import get_redis
from db import db
from ai_reviewer import ai_reviewer
from datetime import datetime

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def process_queue():
    """Background task to process adoption applications from Redis queue."""
    logger.info("AI Review Worker started. Listening for applications...")
    redis = await get_redis()
    
    while True:
        try:
            # BLPOP is blocking; it waits until an item is available
            # Returns (queue_name, item)
            result = await redis.blpop("adoption_queue", timeout=0)
            if not result:
                continue
            
            _, app_id = result
            logger.info(f"Processing application: {app_id}")
            
            # 1. Fetch full application from DB
            application = await db.get_adoption_form(app_id)
            if not application:
                logger.error(f"Application {app_id} not found in database.")
                continue
            
            # Perform AI Review
            # 1. Fetch shelter mode
            shelter = await db.get_shelter_by_city(application.get("city"))
            review_mode = "complete"
            if shelter:
                review_mode = shelter.get("aiReviewMode", "complete")
            
            if review_mode == "partial":
                # Spam check only
                spam_result = await ai_reviewer.spam_check(application)
                if spam_result.get("is_spam"):
                    status = "rejected"
                    verdict = "rejected"
                    reason = f"Spam detected: {spam_result.get('reason')}"
                else:
                    status = "under-manual-review"
                    verdict = "accepted (passed spam check)"
                    reason = "Application looks valid. Sent for manual review by shelter admin."
            else:
                # Full AI review
                review_result = await ai_reviewer.review(application)
                verdict = review_result.get("verdict", "rejected")
                reason = review_result.get("reason", "No reason provided")
                status = "ai-reviewed" # Using intermediate status for complete mode visibility

            # Update database
            ai_review_data = {
                "verdict": verdict,
                "reason": reason,
                "reviewType": review_mode,
                "reviewedAt": datetime.utcnow()
            }
            await db.update_adoption_status(app_id, status, ai_review_data)
            logger.info(f"AI Review completed for {app_id}: {verdict} (Mode: {review_mode})")
            
        except Exception as e:
            logger.error(f"Error in worker loop: {e}")
            await asyncio.sleep(5)  # Backoff on error
