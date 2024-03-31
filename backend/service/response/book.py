from pydantic import BaseModel
from typing import Union

class ModelBookResponse(BaseModel):
    id: str
    title: str
    author: str
    isbn: str
    publicationYear: str

class ModelFavouriteBooksResponse(BaseModel):
    id: int
    user_id: int
    book_id: int