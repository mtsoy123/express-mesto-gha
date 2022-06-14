const User = require('../models/user');

const opts = { runValidators: true };
const BAD_REQUEST = 400;
const NOT_FOUND = 404;
const INTERNAL_SERVER_ERROR = 500;

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла неизвестная ошибка.' }));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.id)
    .then((user) => res.send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      _id: user._id,
    }))
    .catch((err) => {
      if (err.name === 'TypeError') {
        res.status(NOT_FOUND).send({ message: 'Пользователь по указанному _id не найден.' });
        return;
      }
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Указан некорректный _id.' });
        return;
      }
      res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла неизвестная ошибка.' });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные.' });
        return;
      }
      res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла неизвестная ошибка.' });
    });
};

module.exports.updateUserInfo = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, opts)
    .then((user) => res.send({
      name,
      about,
      avatar: user.avatar,
      _id: user._id,
    }))
    .catch((err) => {
      if (err.name === 'TypeError') {
        res.status(NOT_FOUND).send({ message: 'Пользователь по указанному _id не найден.' });
        return;
      }
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные.' });
        return;
      }
      res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла неизвестная ошибка.' });
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, opts)
    .then((user) => res.send({
      name: user.name,
      about: user.about,
      avatar,
      _id: user._id,
    }))
    .catch((err) => {
      if (err.name === 'TypeError') {
        res.status(NOT_FOUND).send({ message: 'Пользователь по указанному _id не найден.' });
        return;
      }
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании пользователя.' });
        return;
      }
      res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла неизвестная ошибка.' });
    });
};
