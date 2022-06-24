const jwt = require('jsonwebtoken');
const Card = require('../models/card');
const NotFoundErr = require('../utils/errors/NotFoundErr');
const ForbiddenErr = require('../utils/errors/ForbiddenErr');

const {
  CREATED, OK,
} = require('../utils/errorStatuses');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.status(CREATED).send({ data: card }))
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  const userId = jwt.verify(req.cookies.jwt, 'secret-key')._id;

  Card.findById(req.params.id)
    .then((card) => {
      if (!card) {
        next(new NotFoundErr('Карточка по  _id не найдена.'));
        return;
      }

      Card.findOneAndRemove({ owner: userId, _id: req.params.id })
        .then((matchingCard) => {
          if (!matchingCard) {
            next(new ForbiddenErr('Вы пытаетесь удалить чужую карточку'));
            return;
          }
          res.status(OK).send({ data: matchingCard });
        });
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.id,
  { $addToSet: { likes: req.user._id } },
  { new: true },
)
  .then((card) => {
    if (!card) {
      next(new NotFoundErr('Карточка по указанному _id не найдена.'));
      return;
    }
    res.send({ data: card });
  })
  .catch(next);

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        next(new NotFoundErr('Карточка по указанному _id не найдена.'));
        return;
      }
      res.send({ data: card });
    })
    .catch(next);
};
