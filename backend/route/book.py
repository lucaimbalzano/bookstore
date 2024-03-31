from fastapi import APIRouter, status, Depends
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from service.request.book import RegisterBookRequest, RegisterBookTokenRequest
from service.response.book import ModelBookResponse, ModelFavouriteBooksResponse
from service.controller.user import get_current_user
from core.database import get_session
from model.user import UserModel 
from service.controller import book as bookController
from typing import List


bookRouter = APIRouter(
    prefix="/book",
    tags=["Book"],
    responses={404: {"description": "Not found"}},
)   


@bookRouter.post('/add', status_code=status.HTTP_202_ACCEPTED)
async def create_book(data:RegisterBookRequest,  user: UserModel = Depends(get_current_user), dbSession: Session = Depends(get_session)):
    await bookController.createBook(data, user, dbSession);
    payload = {"message": "Book has been succesfully created."}
    return JSONResponse(content=payload)

@bookRouter.put('/update/{book_id}', status_code=status.HTTP_202_ACCEPTED)
async def update_book(book_id: int, data:RegisterBookRequest, user: UserModel = Depends(get_current_user), dbSession: Session = Depends(get_session)):
    await bookController.updateBook(book_id, data, user, dbSession);
    payload = {"message": "Book has been succesfully updated."}
    return JSONResponse(content=payload)

@bookRouter.get("/books", response_model=List[ModelBookResponse])
async def get_books(user: UserModel = Depends(get_current_user), dbSession: Session = Depends(get_session)):
    return await bookController.getBooks(user=user, dbSession=dbSession)

@bookRouter.get("/get-all-books", response_model=List[ModelBookResponse])
async def get_books(dbSession: Session = Depends(get_session)):
    return await bookController.getAllBooks(dbSession=dbSession)

@bookRouter.get("/{book_id}", response_model=ModelBookResponse)
async def get_books(book_id: int, dbSession: Session = Depends(get_session)):
    return await bookController.getBook(book_id=book_id, dbSession=dbSession)

@bookRouter.delete("/delete/{book_id}", status_code=status.HTTP_202_ACCEPTED)
async def delete_book(book_id: int, user: UserModel = Depends(get_current_user), dbSession: Session = Depends(get_session)):
    await bookController.deleteBook(book_id=book_id, user=user, dbSession=dbSession)
    return {"message": "Book has been succesfully deleted."}
            
@bookRouter.delete("/delete-isbn/{isbn}", status_code=status.HTTP_202_ACCEPTED)
async def delete_book(isbn: str, user: UserModel = Depends(get_current_user), dbSession: Session = Depends(get_session)):
    await bookController.deleteBookByIsbn(isbn=isbn, user=user, dbSession=dbSession)
    return {"message": "Book has been succesfully deleted."}

@bookRouter.post("/favorite/{book_id}", status_code=status.HTTP_202_ACCEPTED)
async def add_favorite(book_id: str, user: UserModel = Depends(get_current_user), dbSession: Session = Depends(get_session)):
    await bookController.add_favorite(book_id=book_id, user=user, dbSession=dbSession)
    return {"message": "Book has been succesfully added on favourites."}

@bookRouter.delete("/delete-favorite/{book_id}", status_code=status.HTTP_202_ACCEPTED)
async def delete_book(book_id: str, user: UserModel = Depends(get_current_user), dbSession: Session = Depends(get_session)):
    await bookController.deleteFavoriteBook(book_id=book_id, user=user, dbSession=dbSession)
    return {"message": "Favorite book has been succesfully deleted."}
                        
@bookRouter.get("/get/favorite-books", status_code=status.HTTP_202_ACCEPTED)
async def getFavoriteBooks(user: UserModel = Depends(get_current_user), dbSession: Session = Depends(get_session)):
    return await bookController.getFavoriteBooks(user,dbSession=dbSession)