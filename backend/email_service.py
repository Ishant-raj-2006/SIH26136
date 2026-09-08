import os
import random
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime, timedelta

def generate_otp_code() -> str:
    """Generate a random 6-digit OTP code"""
    return f"{random.randint(100000, 999999)}"

def send_otp_email(recipient_email: str, otp_code: str, purpose: str = "registration") -> bool:
    """
    Sends an OTP verification email to recipient_email.
    If SMTP env vars are provided, uses smtplib to send real emails.
    Otherwise, logs to console (Development Mode) and returns True.
    """
    subject = "Your GoPilot-X Verification Code (OTP)" if purpose == "registration" else "Reset Your Password - GoPilot-X OTP Code"
    
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>{subject}</title>
    </head>
    <body style="font-family: Arial, sans-serif; background-color: #f8fafc; padding: 20px; color: #1e293b;">
      <div style="max-width: 500px; margin: 0 auto; background: #ffffff; border-radius: 12px; padding: 28px; border: 1px solid #e2e8f0;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="color: #1e3a8a; margin: 0;">GoPilot-X</h2>
          <p style="font-size: 12px; color: #64748b; margin-top: 4px;">National Startup Public Procurement Platform</p>
        </div>
        
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 16px 0;">
        
        <p style="font-size: 14px; color: #334155;">Hello,</p>
        <p style="font-size: 14px; color: #334155;">
          {"Your OTP verification code for registering your workspace account is:" if purpose == "registration" else "Your OTP code to reset your account password is:"}
        </p>
        
        <div style="text-align: center; margin: 24px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #0284c7; background: #f0f9ff; padding: 12px 24px; border-radius: 8px; border: 1px dashed #0284c7;">
            {otp_code}
          </span>
        </div>
        
        <p style="font-size: 13px; color: #64748b; text-align: center;">
          This code is valid for <strong>10 minutes</strong>. Do not share this OTP with anyone.
        </p>
        
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">
        <p style="font-size: 11px; color: #94a3b8; text-align: center;">
          Government of India • GFR Rule 194 Sandbox Access Portal
        </p>
      </div>
    </body>
    </html>
    """

    smtp_host = os.getenv("SMTP_HOST")
    smtp_port = int(os.getenv("SMTP_PORT", "587"))
    smtp_user = os.getenv("SMTP_USER")
    smtp_pass = os.getenv("SMTP_PASSWORD")

    # Always log OTP banner to console for development visibility
    print("\n" + "=" * 60)
    print(f" [EMAIL SERVICE] OTP GENERATED FOR: {recipient_email}")
    print(f" [PURPOSE]       {purpose.upper()}")
    print(f" [OTP CODE]      >>> {otp_code} <<<")
    print("=" * 60 + "\n")

    # Send real email if SMTP credentials are provided
    if smtp_host and smtp_user and smtp_pass:
        try:
            msg = MIMEMultipart("alternative")
            msg["Subject"] = subject
            msg["From"] = smtp_user
            msg["To"] = recipient_email
            msg.attach(MIMEText(html_content, "html"))

            if smtp_port == 465:
                with smtplib.SMTP_SSL(smtp_host, smtp_port) as server:
                    server.login(smtp_user, smtp_pass)
                    server.sendmail(smtp_user, [recipient_email], msg.as_string())
            else:
                with smtplib.SMTP(smtp_host, smtp_port) as server:
                    server.starttls()
                    server.login(smtp_user, smtp_pass)
                    server.sendmail(smtp_user, [recipient_email], msg.as_string())
            print(f"[EMAIL SERVICE] Successfully sent email to {recipient_email} via SMTP")
            return True
        except Exception as e:
            print(f"[EMAIL SERVICE] SMTP dispatch error: {e}")
            return False
            
    return True
