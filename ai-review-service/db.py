from motor.motor_asyncio import AsyncIOMotorClient
from config import settings
from bson import ObjectId
from datetime import datetime

class MongoDB:
    client: AsyncIOMotorClient = None
    db = None

    async def connect(self):
        if self.client is None:
            self.client = AsyncIOMotorClient(settings.MONGODB_URL)
            self.db = self.client[settings.DATABASE_NAME]

    async def get_adoption_form(self, form_id: str):
        await self.connect()
        return await self.db.adoptionforms.find_one({"_id": ObjectId(form_id)})

    async def get_shelter_by_city(self, city: str):
        await self.connect()
        return await self.db.shelters.find_one({"city": city})

    async def update_adoption_status(self, form_id: str, status: str, ai_review: dict):
        await self.connect()
        await self.db.adoptionforms.update_one(
            {"_id": ObjectId(form_id)},
            {
                "$set": {
                    "status": status,
                    "aiReview": ai_review
                }
            }
        )

db = MongoDB()

# Deprecated functional wrapper for compatibility if needed elsewhere
async def get_db():
    await db.connect()
    return db.db
