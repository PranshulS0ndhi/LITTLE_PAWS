import redis.asyncio as redis
from .config import settings

class RedisClient:
    _client = None

    @classmethod
    async def get_client(cls):
        if cls._client is None:
            cls._client = await redis.from_url(settings.REDIS_URL, decode_responses=True)
        return cls._client

async def get_redis():
    return await RedisClient.get_client()
