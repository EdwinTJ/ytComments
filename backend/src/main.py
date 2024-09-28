from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


###
from routes import auth,channels,comments,videos,users

app = FastAPI()


origins = [
    "http://localhost:5173",
    "http://localhost",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(comments.router, prefix="/comments", tags=["Comments"])
app.include_router(videos.router, prefix="/videos", tags=["Videos"])
app.include_router(users.router, prefix="/users", tags=["Users"])
app.include_router(channels.router, prefix="/channels", tags=["Channels"])

# API Endpoints

# 0. Root endpoint
@app.get("/")
async def read_root():
    return {"Hello": "World"}
