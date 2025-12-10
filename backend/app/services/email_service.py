from fastapi_mail import FastMail, MessageSchema, ConnectionConfig, MessageType
from backend.app.core.config import settings
from pydantic import EmailStr
import logging

logger = logging.getLogger(__name__)

# Configure email connection
conf = ConnectionConfig(
    MAIL_USERNAME=settings.MAIL_USERNAME,
    MAIL_PASSWORD=settings.MAIL_PASSWORD,
    MAIL_FROM=settings.MAIL_FROM,
    MAIL_PORT=settings.MAIL_PORT,
    MAIL_SERVER=settings.MAIL_SERVER,
    MAIL_STARTTLS=settings.MAIL_STARTTLS,
    MAIL_SSL_TLS=settings.MAIL_SSL_TLS,
    USE_CREDENTIALS=settings.USE_CREDENTIALS,
    VALIDATE_CERTS=settings.VALIDATE_CERTS
)

async def send_welcome_email(email_to: EmailStr, username: str):
    """
    Sends a welcome email to a new user.
    """
    html = f"""
    <p>Hi {username},</p>
    <p>Welcome to Aspiria! We're excited to help you navigate your career journey.</p>
    <p>Get started by completing your profile and chatting with your AI advisor.</p>
    <br>
    <p>Best regards,</p>
    <p>The Aspiria Team</p>
    """

    message = MessageSchema(
        subject="Welcome to Aspiria!",
        recipients=[email_to],
        body=html,
        subtype=MessageType.html
    )

    fm = FastMail(conf)
    try:
        await fm.send_message(message)
        logger.info(f"Welcome email sent to {email_to}")
    except Exception as e:
        logger.error(f"Failed to send welcome email to {email_to}: {e}")