from fastapi import FastAPI
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from route.user import userRouter, userAuthRouter
from route.auth import authRouter, oauthRouter
from route.book import bookRouter
# from starlette.middleware.authentication import AuthenticationMiddleware


app = FastAPI()
app.include_router(userRouter)
app.include_router(userAuthRouter)
app.include_router(authRouter)
app.include_router(oauthRouter)
app.include_router(bookRouter)

app.add_middleware(CORSMiddleware,
                   allow_methods=["*"],
                   allow_credentials=True,
                   allow_origins=["http://localhost:5173/"])
# app.add_middleware(AuthenticationMiddleware, backend=JWTAuth())


@app.get('/')
def run_check():
    return JSONResponse(content={"status": "Running!"})