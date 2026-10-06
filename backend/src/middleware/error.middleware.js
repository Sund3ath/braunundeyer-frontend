import logger from '../utils/logger.js';

const errorHandler = (err, req, res, next) => {
  // Log error
  logger.error(`Error: ${err.message}`, {
    method: req.method,
    url: req.url,
    ip: req.ip,
    stack: err.stack
  });

  // Set default error status (multer: file too large -> 413, other upload errors -> 400)
  const multerStatus = err.name === 'MulterError' ? (err.code === 'LIMIT_FILE_SIZE' ? 413 : 400) : null;
  const status = multerStatus || err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  // Send error response
  res.status(status).json({
    error: {
      message,
      status,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    },
    timestamp: new Date().toISOString()
  });
};

export default errorHandler;