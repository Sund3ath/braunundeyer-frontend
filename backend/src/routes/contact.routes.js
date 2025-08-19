import express from 'express';
import nodemailer from 'nodemailer';
import logger from '../utils/logger.js';

const router = express.Router();

// Email configuration from environment variables or defaults
const EMAIL_CONFIG = {
  host: process.env.SMTP_HOST || 'smtp.strato.de',
  port: process.env.SMTP_PORT || 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER || 'info@braunundeyer.de',
    pass: process.env.SMTP_PASSWORD || '' // Must be set in environment
  },
  from: process.env.EMAIL_FROM || 'info@braunundeyer.de',
  to: process.env.EMAIL_TO || 'info@braunundeyer.de' // Where to send contact form submissions
};

// Create reusable transporter object using SMTP transport
let transporter = null;

// Initialize transporter
const initializeTransporter = () => {
  if (!EMAIL_CONFIG.auth.pass) {
    logger.warn('SMTP password not configured. Email sending will be disabled.');
    return null;
  }

  try {
    transporter = nodemailer.createTransport({
      host: EMAIL_CONFIG.host,
      port: EMAIL_CONFIG.port,
      secure: EMAIL_CONFIG.secure,
      auth: {
        user: EMAIL_CONFIG.auth.user,
        pass: EMAIL_CONFIG.auth.pass
      },
      tls: {
        rejectUnauthorized: false // Allow self-signed certificates
      }
    });

    // Verify transporter configuration
    transporter.verify((error, success) => {
      if (error) {
        logger.error('SMTP configuration error:', error);
        transporter = null;
      } else {
        logger.info('SMTP server is ready to send emails');
      }
    });

    return transporter;
  } catch (error) {
    logger.error('Failed to create email transporter:', error);
    return null;
  }
};

// Initialize on startup
initializeTransporter();

// POST /api/contact - Submit contact form
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, projectType, timeline, message } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: 'Name, email, and message are required'
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email address'
      });
    }

    // Prepare email content
    const mailOptions = {
      from: `"${name}" <${EMAIL_CONFIG.from}>`,
      to: EMAIL_CONFIG.to,
      replyTo: email,
      subject: `Neue Kontaktanfrage von ${name}${projectType ? ' - ' + projectType : ''}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #000; color: white; padding: 20px; text-align: center; }
            .content { background-color: #f9f9f9; padding: 30px; border: 1px solid #ddd; }
            .field { margin-bottom: 20px; }
            .label { font-weight: bold; color: #555; margin-bottom: 5px; }
            .value { background-color: white; padding: 10px; border-left: 3px solid #059669; }
            .message { background-color: white; padding: 15px; border-left: 3px solid #059669; white-space: pre-wrap; }
            .footer { text-align: center; padding: 20px; color: #777; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Neue Kontaktanfrage</h1>
            </div>
            <div class="content">
              <div class="field">
                <div class="label">Name:</div>
                <div class="value">${name}</div>
              </div>
              
              <div class="field">
                <div class="label">E-Mail:</div>
                <div class="value">${email}</div>
              </div>
              
              ${phone ? `
              <div class="field">
                <div class="label">Telefon:</div>
                <div class="value">${phone}</div>
              </div>
              ` : ''}
              
              ${projectType ? `
              <div class="field">
                <div class="label">Projekttyp:</div>
                <div class="value">${projectType}</div>
              </div>
              ` : ''}
              
              ${timeline ? `
              <div class="field">
                <div class="label">Zeitrahmen:</div>
                <div class="value">${timeline}</div>
              </div>
              ` : ''}
              
              <div class="field">
                <div class="label">Nachricht:</div>
                <div class="message">${message}</div>
              </div>
            </div>
            <div class="footer">
              <p>Diese E-Mail wurde vom Kontaktformular auf braunundeyer.de gesendet</p>
              <p>Datum: ${new Date().toLocaleString('de-DE')}</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Neue Kontaktanfrage von ${name}
        
        Name: ${name}
        E-Mail: ${email}
        ${phone ? `Telefon: ${phone}` : ''}
        ${projectType ? `Projekttyp: ${projectType}` : ''}
        ${timeline ? `Zeitrahmen: ${timeline}` : ''}
        
        Nachricht:
        ${message}
        
        ---
        Diese E-Mail wurde vom Kontaktformular auf braunundeyer.de gesendet
        Datum: ${new Date().toLocaleString('de-DE')}
      `
    };

    // Send email if transporter is available
    if (transporter) {
      try {
        const info = await transporter.sendMail(mailOptions);
        logger.info('Contact email sent:', info.messageId);
        
        // Send auto-reply to sender
        const autoReplyOptions = {
          from: EMAIL_CONFIG.from,
          to: email,
          subject: 'Vielen Dank für Ihre Anfrage - Braun & Eyer Architekten',
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background-color: #000; color: white; padding: 30px; text-align: center; }
                .content { padding: 30px; }
                .signature { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>Braun & Eyer Architekten</h1>
                </div>
                <div class="content">
                  <p>Sehr geehrte/r ${name},</p>
                  
                  <p>vielen Dank für Ihre Anfrage. Wir haben Ihre Nachricht erhalten und werden uns schnellstmöglich bei Ihnen melden.</p>
                  
                  <p>Bei dringenden Anliegen erreichen Sie uns auch telefonisch unter:</p>
                  <p><strong>+49 681 95417488</strong></p>
                  
                  <div class="signature">
                    <p>Mit freundlichen Grüßen</p>
                    <p><strong>Braun & Eyer Architekten GbR</strong></p>
                    <p>
                      Mainzerstraße 29<br>
                      66111 Saarbrücken<br>
                      Tel: +49 681 95417488<br>
                      E-Mail: info@braunundeyer.de<br>
                      Web: www.braunundeyer.de
                    </p>
                  </div>
                </div>
              </div>
            </body>
            </html>
          `,
          text: `
            Sehr geehrte/r ${name},
            
            vielen Dank für Ihre Anfrage. Wir haben Ihre Nachricht erhalten und werden uns schnellstmöglich bei Ihnen melden.
            
            Bei dringenden Anliegen erreichen Sie uns auch telefonisch unter:
            +49 681 95417488
            
            Mit freundlichen Grüßen
            Braun & Eyer Architekten GbR
            
            Mainzerstraße 29
            66111 Saarbrücken
            Tel: +49 681 95417488
            E-Mail: info@braunundeyer.de
            Web: www.braunundeyer.de
          `
        };
        
        await transporter.sendMail(autoReplyOptions);
        
        res.json({
          success: true,
          message: 'Ihre Nachricht wurde erfolgreich gesendet'
        });
      } catch (error) {
        logger.error('Failed to send email:', error);
        
        // Still return success to user but log the error
        res.json({
          success: true,
          message: 'Ihre Nachricht wurde erfolgreich empfangen'
        });
      }
    } else {
      // No transporter available, just log the contact request
      logger.info('Contact form submission (email disabled):', { name, email, phone, projectType, message });
      
      res.json({
        success: true,
        message: 'Ihre Nachricht wurde erfolgreich empfangen'
      });
    }
  } catch (error) {
    logger.error('Contact form error:', error);
    res.status(500).json({
      success: false,
      error: 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.'
    });
  }
});

// GET /api/contact/test - Test email configuration
router.get('/test', async (req, res) => {
  if (!transporter) {
    return res.status(503).json({
      success: false,
      error: 'Email service not configured'
    });
  }

  try {
    await transporter.verify();
    res.json({
      success: true,
      message: 'Email service is configured and ready',
      config: {
        host: EMAIL_CONFIG.host,
        port: EMAIL_CONFIG.port,
        user: EMAIL_CONFIG.auth.user,
        from: EMAIL_CONFIG.from,
        to: EMAIL_CONFIG.to
      }
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      error: 'Email service test failed',
      details: error.message
    });
  }
});

export default router;