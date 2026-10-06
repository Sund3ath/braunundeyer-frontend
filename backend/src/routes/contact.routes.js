import express from 'express';
import nodemailer from 'nodemailer';
import db from '../config/db-simple.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import { contactLimiter } from '../middleware/rate-limit.middleware.js';
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

// Field limits (characters)
const LIMITS = {
  name: 200,
  email: 254,
  phone: 50,
  projectType: 100,
  timeline: 200,
  message: 5000
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Escape user input before it goes into the HTML e-mail
const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (c) => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
}[c]));

// Single-line fields (used in headers/subject): no CR/LF or other line breaks
const oneLine = (value) => String(value ?? '').replace(/[\r\n\u2028\u2029\u0085]+/g, ' ').trim();

const optionalString = (value) => (typeof value === 'string' ? value : value == null ? '' : null);

// Validate and normalise the request body. Returns { data } or { error }.
const validateSubmission = (body = {}) => {
  const raw = {
    name: optionalString(body.name),
    email: optionalString(body.email),
    phone: optionalString(body.phone),
    projectType: optionalString(body.projectType),
    timeline: optionalString(body.timeline),
    message: optionalString(body.message)
  };

  if (Object.values(raw).some((v) => v === null)) {
    return { error: 'Invalid field type' };
  }

  const data = {
    name: oneLine(raw.name),
    email: oneLine(raw.email),
    phone: oneLine(raw.phone),
    projectType: oneLine(raw.projectType),
    timeline: oneLine(raw.timeline),
    message: raw.message.replace(/\r\n?/g, '\n').trim()
  };

  if (!data.name || !data.email || !data.message) {
    return { error: 'Name, email, and message are required' };
  }

  for (const [field, max] of Object.entries(LIMITS)) {
    if (data[field].length > max) {
      return { error: `Field "${field}" is too long (max. ${max} characters)` };
    }
  }

  if (!EMAIL_REGEX.test(data.email)) {
    return { error: 'Invalid email address' };
  }

  const language = typeof body.language === 'string' && /^[a-z]{2}$/.test(body.language)
    ? body.language
    : null;

  return { data: { ...data, language } };
};

const buildNotificationMail = (data, receivedAt) => {
  const e = {
    name: escapeHtml(data.name),
    email: escapeHtml(data.email),
    phone: escapeHtml(data.phone),
    projectType: escapeHtml(data.projectType),
    timeline: escapeHtml(data.timeline),
    message: escapeHtml(data.message)
  };
  const subject = oneLine(`Neue Kontaktanfrage von ${data.name}${data.projectType ? ' - ' + data.projectType : ''}`);
  const date = receivedAt.toLocaleString('de-DE');

  return {
    from: { name: oneLine(data.name).replace(/["<>]/g, ''), address: EMAIL_CONFIG.from },
    to: EMAIL_CONFIG.to,
    replyTo: { name: oneLine(data.name).replace(/["<>]/g, ''), address: data.email },
    subject,
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
                <div class="value">${e.name}</div>
              </div>
              
              <div class="field">
                <div class="label">E-Mail:</div>
                <div class="value">${e.email}</div>
              </div>
              
              ${data.phone ? `
              <div class="field">
                <div class="label">Telefon:</div>
                <div class="value">${e.phone}</div>
              </div>
              ` : ''}
              
              ${data.projectType ? `
              <div class="field">
                <div class="label">Projekttyp:</div>
                <div class="value">${e.projectType}</div>
              </div>
              ` : ''}
              
              ${data.timeline ? `
              <div class="field">
                <div class="label">Zeitrahmen:</div>
                <div class="value">${e.timeline}</div>
              </div>
              ` : ''}
              
              <div class="field">
                <div class="label">Nachricht:</div>
                <div class="message">${e.message}</div>
              </div>
            </div>
            <div class="footer">
              <p>Diese E-Mail wurde vom Kontaktformular auf braunundeyer.de gesendet</p>
              <p>Datum: ${escapeHtml(date)}</p>
            </div>
          </div>
        </body>
        </html>
      `,
    text: `
        Neue Kontaktanfrage von ${data.name}
        
        Name: ${data.name}
        E-Mail: ${data.email}
        ${data.phone ? `Telefon: ${data.phone}` : ''}
        ${data.projectType ? `Projekttyp: ${data.projectType}` : ''}
        ${data.timeline ? `Zeitrahmen: ${data.timeline}` : ''}
        
        Nachricht:
        ${data.message}
        
        ---
        Diese E-Mail wurde vom Kontaktformular auf braunundeyer.de gesendet
        Datum: ${date}
      `
  };
};

// Auto-reply with a fixed text only (no user-supplied content), so the form
// cannot be abused to send arbitrary text to arbitrary addresses.
const buildAutoReply = (email) => ({
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
                  <p>Guten Tag,</p>
                  
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
            Guten Tag,
            
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
});

const markEmailed = async (id, emailed, emailError = null) => {
  if (!id) return;
  try {
    await db.run(
      'UPDATE contact_messages SET emailed = ?, email_error = ? WHERE id = ?',
      [emailed ? 1 : 0, emailError, id]
    );
  } catch (error) {
    logger.error(`Contact message ${id}: could not update e-mail status (${error.code || error.message})`);
  }
};

// POST /api/contact - Submit contact form
// Every submission is stored first. Success is only reported when the e-mail
// to the office was actually sent; otherwise the client gets an honest 503.
router.post('/', contactLimiter, async (req, res) => {
  const { data, error: validationError } = validateSubmission(req.body);
  if (validationError) {
    return res.status(400).json({ success: false, error: validationError });
  }

  const receivedAt = new Date();
  const mailOptions = buildNotificationMail(data, receivedAt);

  // 1. Persist
  let messageId = null;
  try {
    const result = await db.run(
      `INSERT INTO contact_messages
        (name, email, phone, subject, project_type, timeline, message, language, ip, user_agent, emailed)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)`,
      [
        data.name,
        data.email,
        data.phone || null,
        mailOptions.subject,
        data.projectType || null,
        data.timeline || null,
        data.message,
        data.language,
        req.ip || null,
        (req.get('user-agent') || '').slice(0, 500) || null
      ]
    );
    messageId = result.lastInsertRowid;
    logger.info(`Contact message ${messageId} saved`);
  } catch (error) {
    // Do not give up yet: still try to e-mail it so the enquiry is not lost
    logger.error(`Contact message could not be saved (${error.code || error.message})`);
  }

  // 2. E-mail
  const mailer = transporter || initializeTransporter();
  if (!mailer) {
    await markEmailed(messageId, false, 'smtp_not_configured');
    logger.error(`Contact message ${messageId ?? '(not saved)'} NOT e-mailed: SMTP not configured`);
    return res.status(messageId ? 503 : 500).json({
      success: false,
      error: messageId ? 'mail_unavailable' : 'submit_failed',
      saved: Boolean(messageId)
    });
  }

  try {
    const info = await mailer.sendMail(mailOptions);
    logger.info(`Contact message ${messageId ?? '(not saved)'} e-mailed: ${info?.messageId || 'ok'}`);
    await markEmailed(messageId, true);
  } catch (error) {
    const reason = String(error.code || error.responseCode || 'send_failed').slice(0, 100);
    await markEmailed(messageId, false, reason);
    logger.error(`Contact message ${messageId ?? '(not saved)'} NOT e-mailed: ${reason}`);
    return res.status(messageId ? 503 : 500).json({
      success: false,
      error: messageId ? 'mail_unavailable' : 'submit_failed',
      saved: Boolean(messageId)
    });
  }

  // 3. Auto-reply (best effort; the enquiry itself was delivered)
  try {
    await mailer.sendMail(buildAutoReply(data.email));
  } catch (error) {
    logger.warn(`Contact message ${messageId ?? '(not saved)'}: auto-reply failed (${error.code || 'send_failed'})`);
  }

  return res.json({
    success: true,
    message: 'Ihre Nachricht wurde erfolgreich gesendet'
  });
});

// GET /api/contact/messages - Stored submissions (admin only, read-only)
router.get('/messages', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 50, 1), 200);
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const offset = (page - 1) * limit;

    const messages = await db.all(
      `SELECT id, name, email, phone, subject, project_type, timeline, message, language,
              ip, user_agent, created_at, emailed, email_error
       FROM contact_messages
       ORDER BY created_at DESC, id DESC
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );
    const { total } = await db.get('SELECT COUNT(*) as total FROM contact_messages');

    res.json({
      messages,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    logger.error('Failed to list contact messages:', error);
    res.status(500).json({ error: 'Failed to fetch contact messages' });
  }
});

// GET /api/contact/test - Test email configuration (admin only)
router.get('/test', authenticate, authorize(['admin']), async (req, res) => {
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