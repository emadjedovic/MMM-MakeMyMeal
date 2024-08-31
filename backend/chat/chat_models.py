from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base
from config import local_tz


class DBChat(Base):
    __tablename__ = "chats"

    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(DateTime, default=datetime.now(local_tz))
    first_user_id = Column(Integer, ForeignKey("users.id"))
    second_user_id = Column(Integer, ForeignKey("users.id"))

    first_user = relationship("DBUser", foreign_keys=[first_user_id])
    second_user = relationship("DBUser", foreign_keys=[second_user_id])
    messages = relationship("DBMessage", back_populates="chat")


class DBMessage(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    chat_id = Column(Integer, ForeignKey("chats.id"))
    sender_id = Column(Integer)
    content = Column(String)
    timestamp = Column(DateTime, default=datetime.now(local_tz))

    chat = relationship("DBChat", back_populates="messages")
