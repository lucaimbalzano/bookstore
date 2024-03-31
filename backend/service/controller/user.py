from fastapi.exceptions import HTTPException
from fastapi import Depends
from sqlalchemy.orm import Session
from model.user import UserModel, UserToken
from core.security import hash_password, verify_password, add_user_token_and_generate_token, verify_email_user, get_token_user, oauth2_scheme
from core.database import get_session
from model.user import UserModel as User
from datetime import datetime
from sqlalchemy.orm import joinedload



async def register(data, session, background_tasks):
    user = session.query(UserModel).filter(UserModel.email == data.email).first()
    if user:
        raise HTTPException(status_code=422, detail="Email is already registered with us.")

    new_user = UserModel(
        first_name=data.first_name,
        last_name=data.last_name,
        email=data.email,
        password=hash_password(data.password),
        is_active=True,
        is_verified=True,
        registered_at=datetime.now(),
        updated_at=datetime.now()
    )
    session.add(new_user)
    session.commit()
    session.refresh(new_user)
    return new_user


async def get_login_token(data, session):
    user = await verify_email_user(data.username, session)
    if not user:
        raise HTTPException(status_code=400, detail="Email is not registered with us.")
    
    if not verify_password(data.password, user.password):
        raise HTTPException(status_code=400, detail="Incorrect email or password.")
    
    if not user.verified_at:
        raise HTTPException(status_code=400, detail="Your account is not verified. Please check your email inbox to verify your account.")
    
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Your account has been dactivated. Please contact support.")
        
    # Generate the JWT Token
    return add_user_token_and_generate_token(user, session)


async def get_current_user(token: str = Depends(oauth2_scheme), dbSession: Session = Depends(get_session)):
    user = await get_token_user(token=token, dbSession=dbSession)
    if user:
        return user
    raise HTTPException(status_code=401, detail="You are not authorized.")

async def fetch_user_detail(pk, session):
    user = session.query(User).filter(User.id == pk).first()
    if user:
        return user
    raise HTTPException(status_code=400, detail="User does not exists.")

async def invalidate_token(user, dbSession):
    user_token = dbSession.query(UserToken).options(joinedload(UserToken.user)).filter(
                                                 UserToken.user_id == user.id,
                                                 ).first()
        
    user_token.expires_at = datetime.utcnow()
    user_token.refresh_key = ""
    dbSession.commit()
    dbSession.refresh(user_token)

    