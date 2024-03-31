from fastapi import APIRouter, status, BackgroundTasks, Depends, Request
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from core.database import get_session
from service.request.user import RegisterUserRequest
from service.controller import user as userController
from service.response import user as userResponse
from core.security import oauth2_scheme


userRouter = APIRouter(
    prefix="/users",
    tags=["Users"],
    responses={404: {"description": "Not found"}},
)

userAuthRouter = APIRouter(
    prefix="/auth",
    tags=["Auth"],
    responses={404: {"description": "Not found"}},
)   

@userRouter.post('/register', status_code=status.HTTP_201_CREATED)
async def user_register(data: RegisterUserRequest, background_tasks: BackgroundTasks, session: Session = Depends(get_session)):
    await userController.register(data=data,session=session,background_tasks=background_tasks)
    payload = {"message": "User account has been succesfully created."}
    return JSONResponse(content=payload)


@userAuthRouter.post('/login', status_code=status.HTTP_200_OK, response_model=userResponse.LoginResponse)
async def user_login(data: OAuth2PasswordRequestForm = Depends(), session: Session = Depends(get_session)):
    return await userController.get_login_token(data, session)
