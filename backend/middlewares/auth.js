const jwt = require('jsonwebtoken');
const AuthorizationError = require('../errors/AuthorizationError');

const { NODE_ENV, JWT_SECRET = 'dev-secret' } = process.env;

const auth = (req, _, next) => {
  const cookiesToken = req.cookies.jwt;
  const { authorization } = req.headers;
  const jwtToken = cookiesToken || (authorization || '').replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(
      jwtToken,
      `${NODE_ENV === 'production'
        ? JWT_SECRET
        : 'dev-secret'}`,
    );
  } catch (err) {
    throw new AuthorizationError(`Ошибка авторизации: ${err.message}`);
  }

  req.user = payload;

  next();
};
module.exports = auth;
