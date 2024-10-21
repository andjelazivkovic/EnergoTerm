from sqlalchemy import Column, Float, String, DateTime
from .database import Base

class Measurement(Base):
    __tablename__ = "measurement"

    datetime = Column(DateTime, primary_key=True, index=True)
    location = Column(String, primary_key=True, index=True)
    t_amb = Column(Float)
    t_ref = Column(Float)
    t_sup_prim = Column(Float)
    t_ret_prim = Column(Float)
    t_sup_sec = Column(Float)
    t_ret_sec = Column(Float)
    e = Column(Float)
    pe = Column(Float)
