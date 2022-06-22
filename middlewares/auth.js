const jwt = require('jsonwebtoken');
const UNAUTHORIZED = require('../utils/errorStatuses');

module.exports = (req, res, next) => {
  const { auth } = req.headers;

  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(UNAUTHORIZED).send({ message: 'console.log' });
  }

  const token = auth.replace('Bearer ', '');

  let payload;

  try {
    jwt.verify(token, 'secret-key');
  } catch (err) {
    return res.status(UNAUTHORIZED).send({ message: 'console.log' });
  }

  req.user = payload;

  next();
};
