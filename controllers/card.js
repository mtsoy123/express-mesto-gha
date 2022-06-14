const Card = require('../models/card');
const { errorHandler } = require('../errorHandler/errorHandler');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(() => {
      res.status(500).send({ message: 'Произошла неизвестная ошибка.' });
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные.' });
        return;
      }
      res.status(500).send({ message: 'Произошла неизвестная ошибка.' });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.id)
    .orFail((err) => errorHandler(res, err))
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Карточка по указанному _id не найдена.' });
        return;
      }
      res.status(500).send({ message: 'Произошла неизвестная ошибка.' });
    });
};

module.exports.likeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.id,
  { $addToSet: { likes: req.user._id } },
  { new: true, runValidators: true },
)
  .orFail((err) => errorHandler(res, err))
  .then((card) => res.send({ data: card }))
  .catch((err) => {
    if (err.name === 'CastError') {
      res.status(400).send({ message: 'Карточка по указанному _id не найдена.' });
      return;
    }
    if (err.name === 'TypeError') {
      res.status(404).send({ message: 'Карточка по указанному _id не найдена.' });
      return;
    }
    res.status(500).send({ message: 'Произошла неизвестная ошибка.' });
  });

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } },
    { new: true, runValidators: true },
  )
    .orFail((err) => errorHandler(res, err))
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Карточка по указанному _id не найдена.' });
        return;
      }
      if (err.name === 'TypeError') {
        res.status(404).send({ message: 'Карточка по указанному _id не найдена.' });
        return;
      }
      res.status(500).send({ message: 'Произошла неизвестная ошибка.' });
    });
};
