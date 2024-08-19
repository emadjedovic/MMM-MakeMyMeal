from typing import List
from fastapi import WebSocket, WebSocketDisconnect, APIRouter, Depends, HTTPException
from dependencies import get_current_user, get_db
from sqlalchemy.orm import Session
from .chat_crud import create_message, get_chat, create_chat, get_chat_messages, get_chats_of_user, get_name_from_chat
from .chat_schemas import MessageCreate, ChatCreate, Message, Chat
from schemas.user import User

router = APIRouter()

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)

manager = ConnectionManager()

@router.websocket("/ws/chat/{chat_id}")
async def websocket_endpoint(websocket: WebSocket, chat_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    await manager.connect(websocket)
    chat = get_chat(db, chat_id)  # Fetch chat from the database
    if not chat:
        # Handle case where chat does not exist
        await websocket.close()
        return

    try:
        while True:
            data = await websocket.receive_text()
            message_data = MessageCreate(sender_id=current_user.id, content=data)
            create_message(db, message_data, chat_id=chat_id)
            await manager.broadcast(f"{current_user.first_name}: {data}")
    except WebSocketDisconnect:
        manager.disconnect(websocket)
        await manager.broadcast(f"{current_user.first_name} left the chat")


@router.post("/chats/", response_model=ChatCreate)
def create_chat_endpoint(chat: ChatCreate, db: Session = Depends(get_db)):
    return create_chat(db=db, chat=chat)

@router.get("/chats/{user_id}", response_model=List[Chat])
def get_chats_of_user_endpoint(user_id: int, db: Session = Depends(get_db)):
    return get_chats_of_user(user_id=user_id, db=db)

@router.get("/chats/{chat_id}/{user_id}/name")
def get_name_from_chat_endpoint(user_id: int, chat_id: int, db: Session = Depends(get_db)):
    return get_name_from_chat(user_id=user_id, chat_id=chat_id, db=db)


@router.get("/chats/{chat_id}/messages/", response_model=List[Message])
def get_chat_messages_endpoint(chat_id: int, db: Session = Depends(get_db)):
    messages = get_chat_messages(db=db, chat_id=chat_id)
    if messages is None:
        raise HTTPException(status_code=404, detail="Chat not found")
    return messages

@router.post("/chats/{chat_id}/messages/", response_model=Message)
def create_message_endpoint(chat_id: int, message: MessageCreate, db: Session = Depends(get_db)):
    return create_message(db=db, chat_id=chat_id, message=message)



