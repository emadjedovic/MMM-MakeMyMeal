from sqlalchemy import Column, Integer, Float, ForeignKey, Date
from sqlalchemy.orm import relationship
from database import Base
from datetime import date


class DBPromotion(Base):
    __tablename__ = "promotions"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    discount_fraction = Column(Float, nullable=False)
    start_date = Column(Date, nullable=False, default=date.today)
    end_date = Column(Date, nullable=True)
    item_id = Column(Integer, ForeignKey("items.id"), nullable=False, unique=True)

    item = relationship(
        "DBItem", back_populates="promotion", uselist=False, foreign_keys=[item_id]
    )
