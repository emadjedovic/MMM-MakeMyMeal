from pydantic import BaseModel
from datetime import datetime


class ChatBase(BaseModel):
    first_user_id: int
    second_user_id: int


class ChatCreate(ChatBase):
    pass


class Chat(ChatBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


class MessageBase(BaseModel):
    sender_id: int
    content: str


class MessageCreate(MessageBase):
    pass


class Message(MessageBase):
    id: int
    chat_id: int
    timestamp: datetime

    class Config:
        from_attributes = True
