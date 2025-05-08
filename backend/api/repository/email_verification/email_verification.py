from itsdangerous import URLSafeTimedSerializer
from fastapi import Depends
import os 
from dotenv import load_dotenv
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from pydantic import EmailStr


load_dotenv()

serializer = URLSafeTimedSerializer(os.getenv('EMAIL_VERIFICATION_KEY'))

SMTP_SERVER = os.getenv("SMTP_SERVER", "")
SMTP_PORT = os.getenv("SMTP_PORT", "")
EMAIL_ADDRESS = os.getenv("EMAIL_ADDRESS", "")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD", "").encode("ascii", "ignore").decode("ascii").strip()


conf = ConnectionConfig(
    MAIL_USERNAME=EMAIL_ADDRESS,
    MAIL_PASSWORD=EMAIL_PASSWORD,
    MAIL_FROM=EMAIL_ADDRESS,
    MAIL_PORT=SMTP_PORT,
    MAIL_SERVER=SMTP_SERVER,
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True,
)


def generate_token(email: str):
    return serializer.dumps(email, salt="email-verification")

async def send_verification_email(email: EmailStr, token: str):
    if os.getenv("NEXTJS_ENV") == "production":
        verification_link = f"{os.getenv('BACKEND_SERVER')}/auth/verify-email?token={token}"
    else:
        verification_link = f"http://localhost/server/auth/verify-email?token={token}"
    message = MessageSchema(
        subject="Verify your email",
        recipients=[email],
        body=f"Click the link to verify your email: {verification_link}",
        subtype="html",
    )
    fm = FastMail(conf)
    await fm.send_message(message)
