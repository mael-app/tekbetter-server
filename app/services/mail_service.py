import os

from mailersend import emails

from app.tools.teklogger import log_debug, log_error, log_info, log_success


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
            mailer = emails.NewEmail(os.getenv("MAILERSEND_API_KEY"))

            mail_body = {}

            mail_from = {
                "name": "TekBetter Dashboard",
                "email": os.getenv("MAILERSEND_FROM_EMAIL"),
            }

            recipients = [
                {
                    "email": recipient,
                }
            ]

            mailer.set_mail_from(mail_from, mail_body)
            mailer.set_mail_to(recipients, mail_body)
            mailer.set_subject(subject, mail_body)
            mailer.set_plaintext_content(body, mail_body)

            response = mailer.send(mail_body)
            log_debug(response)
            log_success(f"Mail sent to {recipient}")

        except Exception as e:
            log_error(f"Failed to send mail to {recipient}: {e}")
