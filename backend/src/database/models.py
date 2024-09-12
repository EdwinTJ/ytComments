from sqlalchemy import Column, Integer, String,ForeignKey
from sqlalchemy.orm import relationship
from .database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String, nullable=False) 

    # realtionship with ChannelInfo table
    channels = relationship("ChannelInfo", back_populates="owner")

class ChannelInfo(Base):
    __tablename__ = 'channel_info'

    id = Column(Integer, primary_key=True, index=True)
    channel_id = Column(String, index=True, nullable=False)
    user_id = Column(Integer, ForeignKey('users.id'))

    # reference to the User table
    owner = relationship("User", back_populates="channels")