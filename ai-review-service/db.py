from motor.motor_asyncio import AsyncIOMotorClient
from config import settings

class MongoDB:
    client: AsyncIOMotorClient = None

db = MongoDB()

async def get_db():
    if db.client is None:
        db.client = AsyncIOMotorClient(settings.MONGODB_URL)
    return db.client[settings.DATABASE_NAME]

async def get_application(app_id: str):
    database = await get_db()
    from bson import ObjectId
    return await database.adoptionforms.find_one({"_id": ObjectId(app_id)})

async def update_status(app_id: str, verdict: str, reason: str):
    database = await get_db()
    from bson import ObjectId
    from datetime import datetime
    
    await database.adoptionforms.update_one(
        {"_id": ObjectId(app_id)},
        {
            "$set": {
                "status": verdict,
                "aiReview": {
                    "verdict": verdict,
                    "reason": reason,
                    "reviewedAt": datetime.utcnow()
                }
            }
        }
    )
