const jwt = require('jsonwebtoken');
const { UnauthorizedErr } = require('../utils/errors/UnauthorizedErr');

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return new UnauthorizedErr('Пользователь не авторизован');
  }

  let payload;

  try {
    payload = jwt.verify(token, 'secret-key');
  } catch (err) {
    return new UnauthorizedErr('Пользователь не авторизован');
  }

  req.user = payload;
  next();
};
