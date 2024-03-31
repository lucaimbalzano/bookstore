from sqlalchemy.orm import joinedload
from fastapi.exceptions import HTTPException
from datetime import datetime, timedelta
from service.response.auth import TokenResponse
from model.user import UserModel, UserToken
from core.config import get_settings
from core.security import add_user_token_and_generate_token, get_token_payload, verify_password, str_decode

settings = get_settings()


async def  get_refresh_token(refresh_token, dbSession):   
    token_payload =  get_token_payload(refresh_token, settings.SECRET_KEY, settings.JWT_ALGORITHM)
    if not token_payload:
        raise HTTPException(
            status_code=401,
            detail="Invalid refresh token.",
            headers={"WWW-Authenticate": "Bearer"},
    )
    
    refresh_key = token_payload.get('t')
    access_key = token_payload.get('a')
    user_id = str_decode(token_payload.get('sub'))
    user_token = dbSession.query(UserToken).options(joinedload(UserToken.user)).filter(
                                                 UserToken.refresh_key == refresh_key,
                                                 UserToken.access_key == access_key,
                                                 UserToken.user_id == user_id,
                                                 UserToken.expires_at > datetime.utcnow()
                                                 ).first()
    if not user_token:
        raise HTTPException(status_code=400, detail="Invalid Request.")
    
    user_token.expires_at = datetime.utcnow()
    dbSession.add(user_token)
    dbSession.commit()
    return add_user_token_and_generate_token(user_token.user, dbSession)

     
    
def _verify_user_access(user: UserModel):
    if not user.is_active:
        raise HTTPException(
            status_code=400,
            detail="Your account is inactive. Please contact support.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.is_verified:
        # Trigger user account verification email
        raise HTTPException(
            status_code=400,
            detail="Your account is unverified. We have resend the account verification email.",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
        
    