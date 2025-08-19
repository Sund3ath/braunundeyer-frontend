# Email Configuration Setup

## Overview
The contact form is configured to send emails using Strato's SMTP server. The backend uses Nodemailer to handle email sending.

## Configuration

### Development
The email configuration is set in the backend's `.env` file:

```env
# Email Configuration (Strato SMTP)
SMTP_HOST=smtp.strato.de
SMTP_PORT=465
SMTP_USER=info@braunundeyer.de
SMTP_PASSWORD=your-strato-email-password  # MUST BE SET
EMAIL_FROM=info@braunundeyer.de
EMAIL_TO=info@braunundeyer.de
```

**Important**: Replace `your-strato-email-password` with the actual Strato email password.

### Production
For production deployment, set the SMTP_PASSWORD environment variable:

1. Create a `.env` file in the root directory with:
```env
SMTP_PASSWORD=your-actual-strato-password
JWT_SECRET=your-secure-jwt-secret
LETSENCRYPT_EMAIL=your-email@example.com
```

2. The Docker Compose production file will automatically use these environment variables.

## Testing

### Test Email Configuration
```bash
# Check if email service is configured
curl http://localhost:3001/api/contact/test
```

### Test Contact Form Submission
```bash
curl -X POST "http://localhost:3001/api/contact" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "+49 123 456789",
    "projectType": "neubau",
    "message": "Test message"
  }'
```

## Features

When a contact form is submitted:
1. **Main Email**: Sent to `info@braunundeyer.de` with all form details
2. **Auto-Reply**: Sent to the sender confirming receipt of their message

## Email Templates

The email templates include:
- Professional HTML formatting
- Responsive design
- Company branding
- All form fields displayed clearly
- Auto-reply with company contact information

## Troubleshooting

If emails are not being sent:
1. Check the backend logs: `docker compose -f docker-compose.dev.yml logs backend`
2. Verify SMTP_PASSWORD is set correctly
3. Ensure the Strato email account is active
4. Check if the SMTP port (465) is not blocked by firewall

## Security Notes

- Never commit the actual SMTP password to version control
- Use environment variables for sensitive configuration
- The backend will gracefully handle email failures without exposing errors to users
- Contact form submissions are logged even if email sending fails