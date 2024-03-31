from dataclasses import asdict
from fastapi.exceptions import HTTPException
from model.book import BookModel, FavoriteBooksModel
from core.security import get_token_user
import sqlalchemy.orm as _orm

async def createBook(data,user, dbSession):
    book = dbSession.query(BookModel).filter(BookModel.isbn == data.isbn).first()
    if book:
        raise HTTPException(status_code=422, detail="Book already registered.")        
    
    new_book = BookModel()
    new_book.author = data.author
    new_book.title = data.title
    new_book.isbn = data.isbn
    new_book.publicationYear = data.publicationYear
    new_book.user_id = user.id

    dbSession.add(new_book)
    dbSession.commit()
    dbSession.refresh(new_book)
    return new_book

async def add_favorite(book_id, user, dbSession):
    favoriteBook = dbSession.query(FavoriteBooksModel).filter(FavoriteBooksModel.user_id == user.id, FavoriteBooksModel.book_id == book_id).first()
    if favoriteBook:
        raise HTTPException(status_code=500, detail="Book is already favorited.")        
    new_favoriteBook = FavoriteBooksModel()
    new_favoriteBook.user_id = user.id
    new_favoriteBook.book_id = book_id
    dbSession.add(new_favoriteBook)
    dbSession.commit()
    dbSession.refresh(new_favoriteBook)

async def deleteFavoriteBook(book_id, user, dbSession):
    favoriteBook = dbSession.query(FavoriteBooksModel).filter(FavoriteBooksModel.user_id == user.id, FavoriteBooksModel.book_id == book_id).first()
    if not favoriteBook:
        raise HTTPException(status_code=404, detail="Favorite book not found.")        
    dbSession.delete(favoriteBook)
    dbSession.commit()

async def getFavoriteBooks(user, dbSession):
    favoriteBooks = dbSession.query(FavoriteBooksModel).filter(FavoriteBooksModel.user_id == user.id).all()
    if not favoriteBooks:
        raise HTTPException(status_code=404, detail="No favorite books for this user.")  
    return [{'user_id': book.user_id, 'book_id': book.book_id} for book in favoriteBooks]
    
async def updateBook(book_id, data, user, dbSession):
    book =  await getBook(book_id, dbSession)
    if not book:
        raise HTTPException(status_code=404, detail="Book not found.")        
    book.author = data.author
    book.isbn = data.isbn
    book.title = data.title
    book.publicationYear = data.publicationYear
    dbSession.commit()
    dbSession.refresh(book)
    return

async def getBooks(user, dbSession):
    books = dbSession.query(BookModel).filter_by(user_id=user.id)
    if not books:
        raise HTTPException(status_code=401, detail="Not Authenticated.")        
    return [BookModel(
        id=str(book.id),
        user_id=book.user_id,
        title=book.title,
        author=book.author,
        isbn=book.isbn,
        publicationYear=str(book.publicationYear)
    ) for book in books]

async def getAllBooks(dbSession):
    books = dbSession.query(BookModel).all()
    if not books:
        raise HTTPException(status_code=401, detail="Not Authenticated.")        
    return [BookModel(
        id=str(book.id),
        user_id=book.user_id,
        title=book.title,
        author=book.author,
        isbn=book.isbn,
        publicationYear=str(book.publicationYear)
    ) for book in books]

async def getBook(book_id, dbSession):
    book = dbSession.query(BookModel).filter(BookModel.id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book, Not found.")
    book.publicationYear = str(book.publicationYear)
    book.id = str(book.id)
    return book

async def getBookByIsbn(isbn, user, dbSession):
    book = dbSession.query(BookModel).filter_by(user_id=user.id).filter(BookModel.isbn == isbn).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book, Not found.")
    book.publicationYear = str(book.publicationYear)
    return book

async def deleteBook(book_id, user, dbSession):
    book = await getBook(book_id, dbSession)
    dbSession.delete(book)
    dbSession.commit()


async def deleteBookByIsbn(isbn, user, dbSession):
    book = await getBookByIsbn(str(isbn), user, dbSession)
    dbSession.delete(book)
    dbSession.commit()