from sqlalchemy.orm import Session
from .chat_models import DBChat, DBMessage
from .chat_schemas import ChatCreate, MessageCreate

def create_chat(db: Session, chat: ChatCreate):
    db_chat = DBChat(first_user_id=chat.first_user_id, second_user_id=chat.second_user_id)
    db.add(db_chat)
    db.commit()
    db.refresh(db_chat)
    return db_chat

def get_chat_messages(db: Session, chat_id: int):
    return db.query(DBMessage).filter(DBMessage.chat_id == chat_id).all()

def create_message(db: Session, chat_id: int, message: MessageCreate):
    db_message = DBMessage(chat_id=chat_id, sender_id=message.sender_id, content=message.content)
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    return db_message

def get_chat(db: Session, chat_id: int):
    return db.query(DBChat).filter(DBChat.id == chat_id).first()

def get_chats(db: Session, skip: int = 0, limit: int = 10):
    return db.query(DBChat).offset(skip).limit(limit).all()


