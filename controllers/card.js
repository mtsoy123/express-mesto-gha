const Card = require('../models/card');
const { errorHandler } = require('../errorHandler/errorHandler');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch((err) => errorHandler(res, err));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => errorHandler(res, err));
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.id)
    .orFail((err) => errorHandler(res, err))
    .then((card) => res.send({ data: card }))
    .catch((err) => errorHandler(res, err));
};
module.exports.likeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.id,
  { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
  { new: true, runValidators: true },
)
  .orFail((err) => errorHandler(res, err))
  .then((card) => res.send({ data: card }))
  .catch((err) => errorHandler(res, err));

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } },
    { new: true, runValidators: true },
  )
    .orFail((err) => errorHandler(res, err))
    .then((card) => res.send({ data: card }))
    .catch((err) => errorHandler(res, err));
};
