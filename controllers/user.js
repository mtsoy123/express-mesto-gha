const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequestErr = require('../utils/errors/BadRequestErr');
const NotFoundErr = require('../utils/errors/NotFoundErr');
const ConflictErr = require('../utils/errors/ConflictErr');

const {
  CREATED,
  DUPLICATE_ERROR,
} = require('../utils/errorStatuses');
const Card = require('../models/card');

const opts = { runValidators: true, new: true };

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(CREATED).send(users))
    .catch(next);
};

module.exports.getCurrentUser = (req, res, next) => {
  const id = jwt.verify(req.cookies.jwt, 'secret-key');
  User.findById(id)
    .then((users) => res.send(users))
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        throw new NotFoundErr('Пользователь по указанному _id не найден.');
      }

      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new BadRequestErr('Некорректный формат запроса'));
        return;
      } next(err);
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcryptjs.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => {
      res.status(CREATED).send({ data: user });
    })
    .catch((err) => {
      if (err.code === DUPLICATE_ERROR) {
        next(new ConflictErr('Пользователь с таким email уже зарегистрирован'));
        return;
      }
      if (err.name === 'ValidationError') {
        next(new BadRequestErr('Некорректный формат запроса'));
        return;
      }
      next(err);
    });
};

module.exports.updateUserInfo = (req, res, next) => {
  const { name, about } = req.body;
  const userId = jwt.verify(req.cookies.jwt, 'secret-key')._id;
  Card.find({ _id: userId })
    .then((r) => {
      if (!r) {
        throw new NotFoundErr('Пользователь по указанному _id не найден.');
      }
      User.findByIdAndUpdate(req.user._id, { name, about }, opts)
        .then((user) => {
          if (!user) {
            throw new NotFoundErr('Пользователь по указанному _id не найден.');
          }

          res.send({
            name: user.name,
            about: user.about,
            avatar: user.avatar,
            _id: user._id,
          });
        });
    })
    .catch(next);
};

module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const userId = jwt.verify(req.cookies.jwt, 'secret-key')._id;

  User.find({ _id: userId })
    .then((r) => {
      if (!r) {
        throw new NotFoundErr('Пользователь по указанному _id не найден.');
      }
      User.findByIdAndUpdate(req.user._id, { avatar }, opts)
        .then((user) => {
          if (!user) {
            throw new NotFoundErr('Пользователь по указанному _id не найден.');
          }
          res.send({
            name: user.name,
            about: user.about,
            avatar: user.avatar,
            _id: user._id,
          });
        });
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCred(email, password)
    .then((user) => {
      if (!user) {
        throw new NotFoundErr('Пользователь по указанному _id не найден.');
      }

      const token = jwt.sign({ _id: user._id }, 'secret-key', { expiresIn: '7d' });
      res.cookie('jwt', token, {
        httpOnly: true,
      });
      res.status(CREATED).send({ token });
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        err.statusCode(123);
        err.message('qwe');
        next(err);
      } next(err);
    });
};
