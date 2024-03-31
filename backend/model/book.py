from sqlalchemy import Boolean, Column, DateTime, Integer, String, func, ForeignKey
from sqlalchemy.orm import mapped_column, relationship
from core.database import Base

class BookModel(Base):
    __tablename__ = "book"
    id = Column(Integer, primary_key=True, index=True)
    user_id = mapped_column(ForeignKey('users.id'))
    title = Column(String(100))
    author = Column(String(100))
    isbn = Column(String(13))
    publicationYear = Column(Integer)

user = relationship("UserModel", back_populates="tokens")

class FavoriteBooksModel(Base):
    __tablename__ = "favorite_books"
    user_id = Column(Integer, ForeignKey('users.id'), primary_key=True)
    book_id = Column(Integer, ForeignKey('book.id'), primary_key=True)