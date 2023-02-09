const ClientError = require('./client-error'); // eslint-disable-line
const jwt = require('jsonwebtoken'); // eslint-disable-line

function authorizationMiddleware(req, res, next) {
  const token = req.headers['x-access-token'];
  if (!token) {
    throw new ClientError(401, 'authentication required');
  } else {
    const payload = jwt.verify(token, 'swag');
    req.user = payload;
    next();
  }
}

module.exports = authorizationMiddleware;
