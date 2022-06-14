const User = require('../models/user');

const opts = { runValidators: true };

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => errorHandler(res, err));
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
        res.status(404).send({ message: 'Пользователь по указанному _id не найден.' });
        return;
      }
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Указан некорректный _id.' });
        return;
      }
      res.status(500).send({ message: 'Произошла неизвестная ошибка.' });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные.' });
        return;
      }
      res.status(500).send({ message: 'Произошла неизвестная ошибка.' });
    });
};

module.exports.updateUserInfo = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, opts)
    .then((user) => res.send({
      name: req.name,
      about: req.about,
      avatar: user.avatar,
      _id: user._id,
    }))
    .catch((err) => {
      if (err.name === 'TypeError') {
        res.status(404).send({ message: 'Пользователь по указанному _id не найден.' });
        return;
      }
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные.' });
        return;
      }
      res.status(500).send({ message: 'Произошла неизвестная ошибка.' });
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, opts)
    .then((user) => res.send({
      name: user.name,
      about: user.about,
      avatar: req.avatar,
      _id: user._id,
    }))
    .catch((err) => {
      if (err.name === 'TypeError') {
        res.status(404).send({ message: 'Пользователь по указанному _id не найден.' });
        return;
      }
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя.' });
        return;
      }
      res.status(500).send({ message: 'Произошла неизвестная ошибка.' });
    });
};
