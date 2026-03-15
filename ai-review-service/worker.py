import asyncio
import logging
from redis_client import get_redis
from db import get_application, update_status
from ai_reviewer import ai_reviewer

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
            application = await get_application(app_id)
            if not application:
                logger.error(f"Application {app_id} not found in database.")
                continue
            
            # 2. Get AI review
            ai_result = await ai_reviewer.review(application)
            logger.info(f"AI Review completed for {app_id}: {ai_result['verdict']}")
            
            # 3. Update DB
            await update_status(app_id, ai_result['verdict'], ai_result['reason'])
            logger.info(f"Database updated for {app_id}.")
            
        except Exception as e:
            logger.error(f"Error in worker loop: {e}")
            await asyncio.sleep(5)  # Backoff on error
