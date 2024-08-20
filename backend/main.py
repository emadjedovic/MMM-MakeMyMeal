# main.py

from fastapi import FastAPI, Cookie, WebSocket, WebSocketDisconnect, Depends, status, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
import json
from routers import (
    auth,
    users,
    restaurants,
    restaurant_types,
    food_types,
    items,
    promotions,
    orders,
    notifications,
)
from database import engine, Base
from chat import chat_router
from typing import List
from dependencies import get_current_user, get_db
from sqlalchemy.orm import Session
from chat.chat_crud import create_message, get_chat
from chat.chat_schemas import MessageCreate
from schemas.user import User
from starlette.datastructures import Headers
from chat.chat_models import DBMessage


def create_application():
    app = FastAPI()
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    return app


app = create_application()


# from helpers.create_users import create_admin, create_customer, create_delivery_personnel, create_restaurant_admin


def startup_event():
    Base.metadata.create_all(bind=engine)
    """
    create_admin()
    create_customer()
    create_restaurant_admin()
    create_delivery_personnel()"""


app.add_event_handler("startup", startup_event)

app.mount("/assets", StaticFiles(directory="assets"), name="assets")
# http://localhost:8000/assets/item-images/itemDefault.png


@app.get("/", tags=["Default"])
def read_root():
    return {"hello": "world"}


app.include_router(auth.router, prefix="/api", tags=["Auth"])
app.include_router(users.router, prefix="/api", tags=["Users"])
app.include_router(restaurants.router, prefix="/api", tags=["Restaurants"])
app.include_router(restaurant_types.router, prefix="/api", tags=["Restaurant Types"])
app.include_router(food_types.router, prefix="/api", tags=["Food Types"])
app.include_router(items.router, prefix="/api", tags=["Items"])
app.include_router(promotions.router, prefix="/api", tags=["Promotions"])
app.include_router(orders.router, prefix="/api", tags=["Orders"])
app.include_router(notifications.router, prefix="/api", tags=["Notifications"])
app.include_router(chat_router.router, prefix="/api", tags=["Chat"])


class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def send_personal_message(self, message: str, websocket: WebSocket):
        print("send personal message: ", message)
        await websocket.send_text(message)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)


manager = ConnectionManager()

"""
WebSocket connections might not always provide the same context as HTTP requests. 
Extract the token from a WebSocket request instead of an HTTP request.
"""

# Function to extract token from WebSocket query parameters
# Function to extract token from WebSocket query parameters
def extract_token_from_ws(ws: WebSocket):
    token = ws.query_params.get("token")
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token not found",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return token

# Custom class to mock Request
class MockRequest:
    def __init__(self, headers: Headers):
        self.headers = headers

@app.websocket("/ws/chat/{chat_id}")
async def websocket_endpoint(
    websocket: WebSocket,
    chat_id: int,
    db: Session = Depends(get_db),
):
    print("Attempting to accept WebSocket connection...")
    
    try:
        # Extract token from query parameters
        token = extract_token_from_ws(websocket)
        
        # Create a mock request object with the token in headers
        headers = Headers({"Authorization": f"Bearer {token}"})
        mock_request = MockRequest(headers=headers)

        # Retrieve current user based on the mock request
        current_user = await get_current_user(mock_request, db)
        if not current_user:
            print("Invalid token")
            await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
            return

        # Accept the WebSocket connection
        await websocket.accept()
        print(f"WebSocket connection accepted for chat_id: {chat_id}")

        # Fetch chat from the database
        chat = get_chat(db, chat_id)
        if not chat:
            print(f"Chat with ID {chat_id} not found.")
            await websocket.close()
            return

        # Add connection to manager
        print("Connecting WebSocket to manager...")
        manager.connect(websocket)
        print("WebSocket connection added to manager")

        try:
            while True:
                data = await websocket.receive_text()
                print(f"Received message: {data} (a bug could be hidden here)")

                # Assuming the message data contains the full message object
                message_data = {
                        'content': data.strip('"'),  # Remove surrounding quotes
                        'sender_id': current_user.id,
                        'chat_id': chat_id
                    }
                print("message_data: ", message_data)
                
                # Check if message is already in the database before saving
                existing_message = db.query(DBMessage).filter(
                    DBMessage.content == message_data['content'],
                    DBMessage.sender_id == message_data['sender_id'],
                    DBMessage.chat_id == chat_id
                ).first()

                if existing_message is None:
                    # Create a new message entry in the database
                    message_data = MessageCreate(sender_id=message_data['sender_id'], content=message_data['content'])
                    print("message_data (MessageCreate): ", message_data)
                    create_message(db=db, chat_id=chat_id, message=message_data)
                    
                    # Broadcast the message to all connected clients
                    await manager.broadcast(f"{message_data['sender_id']}: {message_data['content']}")
                    print("data: ", data)
                else:
                    print("Message already exists, not saving to database.")

        except WebSocketDisconnect:
            print("WebSocket disconnected")
            manager.disconnect(websocket)
            await manager.broadcast(f"{current_user.first_name} left the chat")

            # theres a bug here
        except Exception as e:
            print(f"An error occurred: {e}")
            await websocket.close()

    except Exception as e:
        print(f"An error occurred during WebSocket setup: {e}")
        await websocket.close()