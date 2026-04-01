const nodemailer = require('nodemailer');
const logger = require('../config/logger');

const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS;

if (!emailUser || !emailPass) {
  logger.warn('EMAIL_USER or EMAIL_PASS is not set. Email functionality will fail.');
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: emailUser,
    pass: emailPass,
  },
});

const sendEmail = async (to, subject, html) => {
  if (!emailUser || !emailPass) {
    logger.error('Email User or Email Pass is not configured.');
    throw new Error('Email service is not configured.');
  }

  const msg = {
    from: emailUser,
    to,
    subject,
    html,
  };

  try {
    await transporter.sendMail(msg);
    logger.info(`Email sent to ${to} with subject "${subject}"`);
  } catch (error) {
    logger.error(`Error sending email to ${to}: ${error.message}`, { details: error.message });
    throw new Error('Failed to send email.');
  }
};

module.exports = sendEmail;