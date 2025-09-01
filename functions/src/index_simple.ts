/**
 * Firebase Cloud Functions for LCC International - Simple Version
 */

import {onRequest} from 'firebase-functions/v2/https';

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

/**
 * Simple test endpoint
 */
export const test = onRequest((req, res) => {
  res.status(200).json({
    message: 'Firebase Functions v2 is working!',
    method: req.method,
    timestamp: new Date().toISOString()
  });
});
