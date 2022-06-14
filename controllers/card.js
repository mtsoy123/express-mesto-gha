const Card = require('../models/card');

const BAD_REQUEST = 400;
const NOT_FOUND = 404;
const INTERNAL_SERVER_ERROR = 500;

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(() => {
      res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла неизвестная ошибка.' });
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные.' });
        return;
      }
      res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла неизвестная ошибка.' });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.id)
    .orFail(() => res.status(NOT_FOUND).send({ message: 'Карточка по указанному _id не найдена.' }))
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ReferenceError') {
        res.status(NOT_FOUND).send({ message: 'Карточка по указанному _id не найдена.' });
        return;
      }
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Карточка по указанному _id не найдена.' });
        return;
      }
      res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла неизвестная ошибка.' });
    });
};

module.exports.likeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.id,
  { $addToSet: { likes: req.user._id } },
  { new: true, runValidators: true },
)
  .orFail(() => res.status(NOT_FOUND).send({ message: 'Карточка по указанному _id не найдена.' }))
  .then((card) => res.send({ data: card }))
  .catch((err) => {
    if (err.name === 'CastError') {
      res.status(BAD_REQUEST).send({ message: 'Карточка по указанному _id не найдена.' });
      return;
    }
    if (err.name === 'TypeError') {
      res.status(NOT_FOUND).send({ message: 'Карточка по указанному _id не найдена.' });
      return;
    }
    res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла неизвестная ошибка.' });
  });

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } },
    { new: true, runValidators: true },
  )
    .orFail(() => res.status(NOT_FOUND).send({ message: 'Карточка по указанному _id не найдена.' }))
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Карточка по указанному _id не найдена.' });
        return;
      }
      if (err.name === 'TypeError') {
        res.status(NOT_FOUND).send({ message: 'Карточка по указанному _id не найдена.' });
        return;
      }
      res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла неизвестная ошибка.' });
    });
};
