import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from config import email_settings


def send_email(subject: str, body: str, recipient: str):
    msg = MIMEMultipart()
    msg["From"] = email_settings.MAIL_FROM
    msg["To"] = recipient
    msg["Subject"] = subject

    msg.attach(MIMEText(body, "plain"))

    try:
        with smtplib.SMTP(
            email_settings.MAIL_SERVER, email_settings.MAIL_PORT
        ) as server:
            if email_settings.MAIL_TLS:
                server.starttls()
            if email_settings.MAIL_SSL:
                server.starttls()
            server.login(email_settings.MAIL_USERNAME, email_settings.MAIL_PASSWORD)
            server.send_message(msg)
    except Exception as e:
        print(f"Error sending email: {e}")
