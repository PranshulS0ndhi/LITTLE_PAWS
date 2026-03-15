from fastapi import FastAPI
from contextlib import asynccontextmanager
import asyncio
from .worker import process_queue
from .config import settings

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Start the worker as a background task
    worker_task = asyncio.create_task(process_queue())
    yield
    # Cleanup (e.g., cancel worker)
    worker_task.cancel()
    try:
        await worker_task
    except asyncio.CancelledError:
        pass

app = FastAPI(title="AI Pet Adoption Review Service", lifespan=lifespan)

@app.get("/health")
async def health_check():
    return {"status": "ok", "service": "ai-review-service"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=settings.AI_REVIEW_PORT)
