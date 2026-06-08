import asyncio
from app.database import async_session_maker
from app.models import User
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

async def main():
    async with async_session_maker() as session:
        email = "admin@sofia.com"
        password = "admin123"
        hashed = pwd_context.hash(password)
        user = User(
            name="Администратор",
            email=email,
            password_hash=hashed,
            is_admin=True,
            is_active=True
        )
        session.add(user)
        await session.commit()
        print("Администратор создан")

asyncio.run(main())