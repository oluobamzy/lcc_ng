/**
 * Firebase Cloud Functions for LCC International
 * 
 * This file contains Cloud Functions for:
 * - Contact form email handling
 * - Additional church management functions
 */

import {onRequest} from 'firebase-functions/v2/https';
import {setGlobalOptions} from 'firebase-functions/v2';
import * as logger from 'firebase-functions/logger';
import * as nodemailer from 'nodemailer';

// Set global options
setGlobalOptions({maxInstances: 10});

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'bunmiakinyosolaministries@gmail.com',
    pass: process.env.EMAIL_PASSWORD || '', // This will need to be set via Firebase environment config
  },
});

// Interface for contact form data
interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

/**
 * Cloud Function to handle contact form submissions
 * Receives form data and sends email to church administrators
 */
export const sendEmail = onRequest(async (req, res) => {
  // Set CORS headers
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    res.status(405).json({ 
      success: false,
      message: 'Method not allowed. Please use POST.' 
    });
    return;
  }

  try {
    const { name, email, subject, message }: ContactFormData = req.body;

    // Simple input validation
    if (!name || !email || !subject || !message) {
      res.status(400).json({ 
        success: false,
        message: 'All fields are required' 
      });
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ 
        success: false,
        message: 'Invalid email format' 
      });
      return;
    }

    // Define the email options for church administrators
    const mailOptions = {
      from: email,
      to: 'bunmiakinyosolaministries@gmail.com',
      subject: `Contact Form: ${subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
      text: `
        New Contact Form Submission
        
        Name: ${name}
        Email: ${email}
        Subject: ${subject}
        
        Message:
        ${message}
      `
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    logger.info('Contact form email sent successfully', {
      senderEmail: email,
      senderName: name,
      subject: subject
    });

    res.status(200).json({ 
      success: true,
      message: 'Your message has been sent successfully! We will get back to you soon.'
    });

  } catch (error: any) {
    logger.error('Error sending contact form email:', error);
    
    res.status(500).json({ 
      success: false,
      message: 'Sorry, there was an error sending your message. Please try again later.'
    });
  }
});

/**
 * Health check endpoint for monitoring
 */
export const healthCheck = onRequest((req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'LCC International Cloud Functions'
  });
});
