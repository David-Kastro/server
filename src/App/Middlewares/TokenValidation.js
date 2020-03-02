/**
 * Middleware for Token Validation.
 *
 * @example 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9eyJpZ...'
 * @todo     Implement redirect on invalid token
 */

const jwt = require('jsonwebtoken');
const authConfig = require('../../Config/token.json');

module.exports = full_token => {
  if (!full_token) {
    return null;
  }

  const parts = full_token.split(' ');

  if (!parts.length === 2) {
    return null;
  }

  const [bearer, token] = parts;

  if (!/^Bearer$/i.test(bearer)) {
    return null;
  }

  return jwt.verify(token, authConfig.secret, (err, decoded) => {
    if (err) {
      return null;
    }

    return decoded;
  });
};
