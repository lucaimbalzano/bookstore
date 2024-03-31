from fastapi import APIRouter, status, Depends, Header
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from core.database import get_session
from core.security import oauth2_scheme
from service.controller.user import get_current_user, fetch_user_detail, invalidate_token
from service.controller.auth import get_refresh_token
from service.response import user as userResponse

authRouter = APIRouter(
    prefix="/auth",
    tags=["Auth"],
    responses={404: {"description": "Not found"}},
)

oauthRouter = APIRouter(
    prefix="/users",
    tags=["Users"],
    responses={404: {"description": "Not found"}},
    dependencies=[Depends(oauth2_scheme), Depends(get_current_user)]
)

    #Depends(oauth2_scheme) --> header auth is valid
    #Depends(get_current_user)] --> token is valid


@authRouter.post("/refresh", status_code=status.HTTP_200_OK, response_model=userResponse.LoginResponse)
async def refresh_access_token(refresh_token: str = Header(), session: Session = Depends(get_session)):
    return await get_refresh_token(refresh_token=refresh_token, dbSession=session)


@oauthRouter.get("/me", status_code=status.HTTP_200_OK, response_model=userResponse.UserResponse)
async def fetch_user(user = Depends(get_current_user)):
    return user

@oauthRouter.get("/invalidate-token", status_code=status.HTTP_200_OK)
async def fetch_user(user = Depends(get_current_user), dbSession: Session = Depends(get_session)):
    await invalidate_token(user=user, dbSession=dbSession)
    return {"message" : "Unauthenticated with success"}

@oauthRouter.get("/{pk}", status_code=status.HTTP_200_OK, response_model=userResponse.UserResponse)
async def get_user_info(pk, session: Session = Depends(get_session)):
    return await fetch_user_detail(pk, session)