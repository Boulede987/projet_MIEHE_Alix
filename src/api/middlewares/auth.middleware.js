const jwt = require('jsonwebtoken');

const HTTP_STATUS = {
  UNAUTHORIZED: 401
};

const AUTH_ERRORS = {
  MISSING_TOKEN: 'Missing token',
  INVALID_TOKEN: 'Invalid or expired token',
  MISSING_HEADER: 'Authorization header is required'
};

const TOKEN_PREFIX = 'Bearer ';

const sendUnauthorized = (res, message) => {
  res.status(HTTP_STATUS.UNAUTHORIZED).send({ message });
};

const extractTokenFromHeader = (authHeader) => {
  if (!authHeader) {
    throw new Error(AUTH_ERRORS.MISSING_HEADER);
  }
  
  if (!authHeader.startsWith(TOKEN_PREFIX)) {
    throw new Error(AUTH_ERRORS.MISSING_TOKEN);
  }
  
  return authHeader.substring(TOKEN_PREFIX.length);
};

const verifyToken = (token) => {
  const secret = process.env.JWT_SECRET;
  
  if (!secret) {
    throw new Error('JWT_SECRET is not configured');
  }
  
  return jwt.verify(token, secret);
};

const attachUserToRequest = (req, decoded) => {
  req.user = {
    id: decoded.id,
    role: decoded.role
  };
};

const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = extractTokenFromHeader(authHeader);
    const decoded = verifyToken(token);
    
    attachUserToRequest(req, decoded);
    next();
  } catch (error) {
    const message = error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError'
      ? AUTH_ERRORS.INVALID_TOKEN
      : error.message;
    
    sendUnauthorized(res, message);
  }
};

module.exports = authenticate;