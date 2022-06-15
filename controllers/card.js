const Card = require('../models/card');
const {
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
  CREATED,
} = require('../errorStatuses');

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
    .then((card) => res.status(CREATED).send({ data: card }))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        res.status(NOT_FOUND).send({ message: 'Карточка по указанному _id не найдена.' });
      }
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные.' });
        return;
      }
      res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла неизвестная ошибка.' });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.id)
    .orFail()
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        res.status(NOT_FOUND).send({ message: 'Карточка по указанному _id не найдена.' });
      }
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Указан некорректный _id.' });
      }
      res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла неизвестная ошибка.' });
    });
};

module.exports.likeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.id,
  { $addToSet: { likes: req.user._id } },
  { new: true },
)
  .orFail()
  .then((card) => res.send({ data: card }))
  .catch((err) => {
    if (err.name === 'CastError') {
      res.status(BAD_REQUEST).send({ message: 'Указан некорректный _id.' });
      return;
    }
    if (err.name === 'DocumentNotFoundError') {
      res.status(NOT_FOUND).send({ message: 'Карточка по указанному _id не найдена.' });
    }
    res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла неизвестная ошибка.' });
  });

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Указан некорректный _id.' });
        return;
      }
      if (err.name === 'DocumentNotFoundError') {
        res.status(NOT_FOUND).send({ message: 'Карточка по указанному _id не найдена.' });
      }
      res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла неизвестная ошибка.' });
    });
};
