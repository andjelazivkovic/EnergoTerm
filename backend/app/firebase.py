import firebase_admin
from firebase_admin import credentials, auth
import requests
from dotenv import load_dotenv
import os

load_dotenv()

FIREBASE_WEB_API_KEY = os.getenv('FIREBASE_WEB_API_KEY')
#FIREBASE_CREDENTIALS_PATH = os.getenv('FIREBASE_CREDENTIALS_PATH')

cred = credentials.Certificate('/app/firebase-adminsdk.json')
firebase_admin.initialize_app(cred)

def register_user(email: str, password: str):
    try:
        user = auth.create_user(email=email, password=password)
        print(f"Uspešno dodat novi korisnik!: {user.uid}")

    except Exception as e:
        print(f"Error creating user: {e}")
        return {"error": str(e)}

def login_user(email: str, password: str):
    try:
        url = f"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={FIREBASE_WEB_API_KEY}"
        
        payload = {
            "email": email,
            "password": password,
            "returnSecureToken": True
        }

        response = requests.post(url, json=payload)

        if response.status_code == 200:
            user_data = response.json()
            return {
                "uid": user_data['localId'],
                "email": user_data['email'],
                "id_token": user_data['idToken'],
                "refresh_token": user_data['refreshToken'],
                "expires_in": user_data['expiresIn']
            }
        else:
            return {"error": response.json().get("error", {}).get("message", "Email adresa ili lozinka nisu validni.")}

    except Exception as e:
        print(f"Error logging in user: {e}")
        return {"error": str(e)}

def verify_user_token(id_token: str):
    try:
        decoded_token = auth.verify_id_token(id_token)
        return decoded_token

    except Exception as e:
        print(f"Error verifying token: {e}")
        raise Exception(f"Invalid token: {e}")
    
def logout_user(uid: str):
    try:
        auth.revoke_refresh_tokens(uid) 
        return {"message": "Uspešno ste se prijavili"}

    except Exception as e:
        print(f"Greška : {e}")
        return {"Greška": str(e)}

def change_user_password(uid: str, new_password: str):
    try:
        auth.update_user(uid, password=new_password)
        return {"message": "Uspešno ste promenili lozinku!"}

    except Exception as e:
        print(f"Error changing user password: {e}")
        return {"Greška pri promeni lozinke": str(e)}
