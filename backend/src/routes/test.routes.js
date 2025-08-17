import express from 'express';

const router = express.Router();

/**
 * Test route to verify CORS configuration
 * GET /api/test/cors
 */
router.get('/cors', (req, res) => {
  res.json({
    message: 'CORS is working!',
    origin: req.headers.origin || 'no origin',
    method: req.method,
    timestamp: new Date().toISOString(),
    headers: {
      'user-agent': req.headers['user-agent'],
      'origin': req.headers.origin,
      'referer': req.headers.referer
    }
  });
});

/**
 * Test route for preflight requests
 * OPTIONS /api/test/cors
 */
router.options('/cors', (req, res) => {
  res.sendStatus(204);
});

export default router;