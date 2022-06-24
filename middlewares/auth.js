const jwt = require('jsonwebtoken');
const BadRequestErr = require('../utils/errors/BadRequestErr');
const UnauthorizedErr = require('../utils/errors/UnauthorizedErr');

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    throw new BadRequestErr('Пользователь не авторизован');
    return;
  }

  let payload;

  try {
    payload = jwt.verify(token, 'secret-key');
  } catch (err) {
    throw new BadRequestErr('Пользователь не авторизован');
    return;
  }

  req.user = payload;
  next();
};
