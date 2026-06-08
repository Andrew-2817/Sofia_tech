from app.database import SessionLocal
from app.models import User
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def main():
    db = SessionLocal()
    email = "aaaadmin@sofia.com"
    password = "admin123"
    hashed = pwd_context.hash(password)
    user = User(
        name="Администратор",
        email=email,
        password_hash=hashed,
        is_admin=True,
        is_active=True
    )
    db.add(user)
    db.commit()
    print("Администратор создан")

if __name__ == "__main__":
    main()