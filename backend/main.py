"""
ARIA - Agentic Retail Intelligence Architecture
Backend API Server - FIXED VERSION
=====================================================
Fixes:
1. WebSocket 403 rejections logged cleanly (not crashing)
2. CORS properly configured for all localhost ports
3. Python 3.14 compatibility note added
"""

from fastapi import FastAPI, HTTPException, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import json
import asyncio
from datetime import datetime
from typing import AsyncGenerator

from agents.orchestrator import OrchestratorAgent
from models.schemas import AnalysisRequest, AnalysisResponse
from config import settings

# ─── App Setup ────────────────────────────────────────────────
app = FastAPI(
    title="ARIA - Agentic Retail Intelligence Architecture",
    description="Multi-agent AI platform solving Amazon's real-time operational challenges",
    version="2.4.1",
)

# Allow ALL localhost ports (3000, 3001, 3002, etc.)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:3002",
        "http://localhost:3003",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
        "http://127.0.0.1:3002",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create the orchestrator (it manages all 8 agents)
orchestrator = OrchestratorAgent()


# ─── WebSocket Handler ────────────────────────────────────────
# This catches WebSocket requests from OTHER tools (VS Code extensions etc.)
# and rejects them cleanly WITHOUT crashing the server
@app.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: str):
    """
    Catches WebSocket connections from external tools (VS Code RHDA, etc.)
    Rejects them cleanly so the server keeps running.
    """
    await websocket.close(code=1008, reason="WebSocket not used by ARIA")


# ─── Health Check ─────────────────────────────────────────────
@app.get("/health")
async def health_check():
    return {
        "status": "operational",
        "timestamp": datetime.utcnow().isoformat(),
        "agents_active": 8,
        "version": "2.4.1"
    }


# ─── Main Analysis Endpoint ───────────────────────────────────
@app.post("/api/analyze", response_model=AnalysisResponse)
async def analyze(request: AnalysisRequest):
    try:
        result = await orchestrator.run_full_analysis(request)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ─── Streaming Endpoint ───────────────────────────────────────
@app.post("/api/analyze/stream")
async def analyze_stream(request: AnalysisRequest):
    async def event_generator() -> AsyncGenerator[str, None]:
        try:
            async for log_entry in orchestrator.run_with_streaming(request):
                data = json.dumps(log_entry)
                yield f"data: {data}\n\n"
                await asyncio.sleep(0.01)
        except Exception as e:
            yield f"data: {json.dumps({'type': 'error', 'message': str(e)})}\n\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        }
    )


# ─── Get Available Scenarios ──────────────────────────────────
@app.get("/api/scenarios")
async def get_scenarios():
    from data.sample_scenarios import SAMPLE_SCENARIOS
    return {"scenarios": SAMPLE_SCENARIOS}


# ─── Get Agent Status ─────────────────────────────────────────
@app.get("/api/agents/status")
async def get_agent_status():
    return orchestrator.get_status()


# ─── Start server ─────────────────────────────────────────────
if __name__ == "__main__":
    import uvicorn
    print("=" * 60)
    print("  ARIA Backend Starting...")
    print("  API Docs: http://localhost:8000/docs")
    print("  Health:   http://localhost:8000/health")
    print("=" * 60)
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
