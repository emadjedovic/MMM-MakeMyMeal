from sqlalchemy.orm import Session
from .chat_models import DBChat, DBMessage
from .chat_schemas import ChatCreate, MessageCreate
from crud.user import crud_get_user_by_id
from sqlalchemy import or_


def create_chat(db: Session, chat: ChatCreate):
    db_chat = DBChat(
        first_user_id=chat.first_user_id, second_user_id=chat.second_user_id
    )
    db.add(db_chat)
    db.commit()
    db.refresh(db_chat)
    return db_chat


def get_chat_messages(db: Session, chat_id: int):
    return db.query(DBMessage).filter(DBMessage.chat_id == chat_id).all()


def create_message(db: Session, chat_id: int, message: MessageCreate):
    db_message = DBMessage(
        chat_id=chat_id, sender_id=message.sender_id, content=message.content
    )
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    return db_message


def get_chat(db: Session, chat_id: int):
    return db.query(DBChat).filter(DBChat.id == chat_id).first()


def get_chats_of_user(user_id: int, db: Session):
    return (
        db.query(DBChat)
        .filter(or_(DBChat.first_user_id == user_id, DBChat.second_user_id == user_id))
        .all()
    )


def get_name_from_chat(user_id: int, chat_id, db: Session):
    chat = db.query(DBChat).filter(DBChat.id == chat_id).first()
    if chat.first_user_id == user_id:
        another_name = crud_get_user_by_id(db=db, id=chat.second_user_id).first_name
        return another_name
    else:
        another_name = crud_get_user_by_id(db=db, id=chat.first_user_id).first_name
        return another_name


def get_user_info_from_chat(user_id: int, chat_id, db: Session):
    chat = db.query(DBChat).filter(DBChat.id == chat_id).first()
    if chat.first_user_id == user_id:
        user = crud_get_user_by_id(db=db, id=chat.second_user_id)
    else:
        user = crud_get_user_by_id(db=db, id=chat.first_user_id)

    return {
        "first_name": user.first_name,
        "last_name": user.last_name,
        "role": user.role,
        "id": user.id,
    }
