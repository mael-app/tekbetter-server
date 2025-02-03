import os
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from mailersend import emails
import yagmail
from app.tools.teklogger import log_debug, log_error, log_info, log_success
import smtplib


class MailService:

    @staticmethod
    def send_mail(recipient: str, subject: str, body: str):
        """
        Send an email to the specified recipient.
        :param recipient: Email address of the recipient
        :param subject: Subject of the email
        :param body: Body of the email
        """

        log_info(f"Sending mail to {recipient}")

        try:
            smtp_server = os.getenv('SMTP_SERVER')
            smtp_port = int(os.getenv('SMTP_PORT'))
            smtp_user = os.getenv('SMTP_USER')
            smtp_password = os.getenv('SMTP_PASSWORD')
            yag = yagmail.SMTP(user=smtp_user, password=smtp_password, host=smtp_server, port=smtp_port)
            html_content = f"""
            <html>
                <body>
                    <h2>{subject}</h2>
                    <p>{body}</p>
                </body>
            </html>
            """
            yag.send(to=recipient, subject=subject, contents=html_content)
            log_success(f"Mail sent to {recipient}")
        except Exception as e:
            log_error(f"Failed to send mail to {recipient}: {e}")