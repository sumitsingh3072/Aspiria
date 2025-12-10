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

async def send_email(subject: str, recipients: list[EmailStr], html_body: str):

    message = MessageSchema(
        subject=subject,
        recipients=recipients,
        body=html_body,
        subtype=MessageType.html
    )

    fm = FastMail(conf)
    try:
        await fm.send_message(message)
        logger.info(f"Email '{subject}' sent to {recipients}")
        return True
    except Exception as e:
        logger.error(f"Failed to send email to {recipients}: {e}")
        raise e

async def send_welcome_email(email_to: EmailStr, username: str):
    """
    Sends a welcome email to a new user.
    """
    html = f"""
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Hi {username},</h2>
        <p>Welcome to <strong>Aspiria</strong>! We're excited to help you navigate your career journey.</p>
        <p>Get started by completing your profile and chatting with your AI advisor.</p>
        <br>
        <p>Best regards,</p>
        <p>The Aspiria Team</p>
    </div>
    """
    await send_email("Welcome to Aspiria!", [email_to], html)


async def send_reset_password_email(email_to: EmailStr, token: str):
    """
    Sends an email with a link to reset the password.
    """
    reset_link = f"{settings.FRONTEND_URL}/reset-password?token={token}"
    
    html = f"""
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Password Reset Request</h2>
        <p>You requested to reset your password for your Aspiria account.</p>
        <p>Click the link below to set a new password. This link is valid for 1 hour.</p>
        <br>
        <a href="{reset_link}" style="background-color: #000; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
        <br><br>
        <p>If you didn't ask for this, you can ignore this email.</p>
        <p>Best regards,</p>
        <p>The Aspiria Team</p>
    </div>
    """
    await send_email("Reset Your Password - Aspiria", [email_to], html)