from fastapi import FastAPI
from sqlalchemy import text
from . import model
from .routes import router
from .routes_auth import router1
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
origins = [
    "http://0.0.0.0:5173",  
    "http://0.0.0.0:5432",
    "http://172.18.0.4:5173",
    "http://localhost:5173"  
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

app.include_router(router)
app.include_router(router1)



# .\venv\Scripts\activate
# uvicorn app.main:app --reload

