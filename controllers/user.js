const User = require('../models/user');
const {
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
  CREATED,
} = require('../utils/errorStatuses');

const opts = { runValidators: true, new: true };

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла неизвестная ошибка.' }));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.id)
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
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
    .then((user) => res.status(CREATED).send({ data: user }))
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
    .orFail()
    .then((user) => res.send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      _id: user._id,
    }))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        res.status(NOT_FOUND).send({ message: 'Пользователь по указанному _id не найден.' });
        return;
      }
      if (err.name === 'CastError' || 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Указаны некорректные данные.' });
        return;
      }
      res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла неизвестная ошибка.' });
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, opts)
    .orFail()
    .then((user) => res.send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      _id: user._id,
    }))
    .catch((err) => {
      if (err.name === 'CastError' || 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Указаны некорректные данные.' });
        return;
      }
      if (err.name === 'DocumentNotFoundError') {
        res.status(NOT_FOUND).send({ message: 'Пользователь по указанному _id не найден.' });
        return;
      }
      res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла неизвестная ошибка.' });
    });
};
