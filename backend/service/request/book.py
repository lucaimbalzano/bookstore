from pydantic import BaseModel

class RegisterBookRequest(BaseModel):
    title: str
    author: str
    isbn: str
    publicationYear: str
    
class RegisterBookTokenRequest(BaseModel):
    title: str
    author: str
    isbn: str
    publicationYear: str
    at_payload: str


