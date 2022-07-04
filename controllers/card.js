const Card = require('../models/card');
const NotFoundErr = require('../utils/errors/NotFoundErr');
const ForbiddenErr = require('../utils/errors/ForbiddenErr');

const {
  CREATED,
} = require('../utils/errorStatuses');
const BadRequestErr = require('../utils/errors/BadRequestErr');

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
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestErr('Некорректный формат запроса'));
        return;
      }

      next(err);
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.id)
    .orFail(() => next(new NotFoundErr('Карточка по  _id не найдена.')))
    .then((card) => {
      if (!card.owner.equals(req.user._id)) {
        next(new ForbiddenErr('Вы пытаетесь удалить чужую карточку'));
        return;
      }
      card.remove().then(() => res.send({ data: card }));
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
