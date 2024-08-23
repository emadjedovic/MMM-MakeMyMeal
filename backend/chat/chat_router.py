from typing import List
from fastapi import APIRouter, Depends, HTTPException
from dependencies import get_db
from sqlalchemy.orm import Session
from .chat_crud import (
    create_message,
    create_chat,
    get_chat_messages,
    get_chats_of_user,
    get_name_from_chat,
    get_user_info_from_chat,
)
from .chat_schemas import MessageCreate, ChatCreate, Message, Chat

router = APIRouter()


@router.post("/chats/new/", response_model=ChatCreate)
def create_chat_endpoint(chat: ChatCreate, db: Session = Depends(get_db)):
    return create_chat(db=db, chat=chat)


@router.get("/chats/{user_id}", response_model=List[Chat])
def get_chats_of_user_endpoint(user_id: int, db: Session = Depends(get_db)):
    return get_chats_of_user(user_id=user_id, db=db)


@router.get("/chats/{chat_id}/{user_id}/name")
def get_name_from_chat_endpoint(
    user_id: int, chat_id: int, db: Session = Depends(get_db)
):
    return get_name_from_chat(user_id=user_id, chat_id=chat_id, db=db)


@router.get("/chats/{chat_id}/{user_id}/user-info")
def get_user_info_from_chat_endpoint(
    user_id: int, chat_id: int, db: Session = Depends(get_db)
):
    return get_user_info_from_chat(user_id=user_id, chat_id=chat_id, db=db)


@router.get("/chats/{chat_id}/messages/", response_model=List[Message])
def get_chat_messages_endpoint(chat_id: int, db: Session = Depends(get_db)):
    messages = get_chat_messages(db=db, chat_id=chat_id)
    if messages is None:
        raise HTTPException(status_code=404, detail="Chat not found")
    return messages


@router.post("/chats/{chat_id}/create-message/", response_model=Message)
def create_message_endpoint(
    chat_id: int, message: MessageCreate, db: Session = Depends(get_db)
):
    return create_message(db=db, chat_id=chat_id, message=message)
