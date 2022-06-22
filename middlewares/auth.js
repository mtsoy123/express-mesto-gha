const jwt = require('jsonwebtoken');
const UNAUTHORIZED = require('../utils/errorStatuses');
// todo statuscode change on const

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(401).send({ message: '12console.log' });
  }

  let payload;

  try {
    // console.log(jwt.verify(token, 'secret-key'));
    payload = jwt.verify(token, 'secret-key');
  } catch (err) {
    return res.status(401).send({ message: 'console.log' });
  }

  req.user = payload;

  next();
};
