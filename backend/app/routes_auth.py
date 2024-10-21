from fastapi import APIRouter, HTTPException, Depends, Header
from pydantic import BaseModel
from .firebase import change_user_password, logout_user, register_user, verify_user_token, login_user
import firebase_admin

router1 = APIRouter()

class RegisterUserModel(BaseModel):
    email: str
    password: str

class LoginUserModel(BaseModel):
    email: str
    password: str

class ChangePasswordModel(BaseModel):
    uid: str
    new_password: str

@router1.post("/register")
async def register(user: RegisterUserModel):
    try:
        result = register_user(user.email, user.password)
        if "error" in result:
            raise HTTPException(status_code=400, detail=result["error"])
        return {"message": "Već postoji korisnik sa istom email adresom!"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router1.post("/login")
async def login(user: LoginUserModel):
    try:
        if not user.email or not user.password:
            raise HTTPException(status_code=400, detail="Email i lozinka su obavezna polja!")

        user_data = login_user(user.email, user.password)

        if user_data.get("error"):
            raise HTTPException(status_code=401, detail=user_data["error"])

        return {"message": "Uspešna prijava!", "user_data": user_data}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router1.post("/logout")
async def logout(id_token: str = Header(None)):
    try:
        if id_token is None:
            raise HTTPException(status_code=400, detail="ID token is required")

        decoded_token = verify_user_token(id_token)
        uid = decoded_token["uid"]

        result = logout_user(uid)
        if "error" in result:
            raise HTTPException(status_code=400, detail=result["error"])

        return {"message": result["message"]}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router1.post("/change-password")
async def change_password(data: ChangePasswordModel):
    try:
        result = change_user_password(data.uid, data.new_password)
        if "error" in result:
            raise HTTPException(status_code=400, detail=result["error"])

        return {"message": result["message"]}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))