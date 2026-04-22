# Cập nhật phần import ở main.py
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import asyncio

from app.api.routes import router as api_router
from app.websockets.stream import manager
from app.services.log_parser import windows_monitor # Import module mới

app = FastAPI(title="Security Dashboard API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api")

# --- LUỒNG QUÉT LOG WINDOWS ---
async def poll_windows_logs():
    print("Bắt đầu giám sát Windows Security Logs...")
    while True:
        new_events = windows_monitor.get_new_events()
        
        # Sắp xếp lại để hiển thị từ cũ -> mới trên dashboard
        new_events.reverse() 
        
        for event in new_events:
            await manager.broadcast_alert(event)
            
        # Quét log mỗi 2 giây (đủ nhanh cho realtime)
        await asyncio.sleep(2)

@app.on_event("startup")
async def startup_event():
    # Khởi động luồng chạy ngầm
    asyncio.create_task(poll_windows_logs())

# --- END LUỒNG QUÉT LOG ---

@app.websocket("/ws/alerts")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)