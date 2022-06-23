const router = require('express').Router();
const { celebrate } = require('celebrate');
const Joi = require('joi');

const {
  getCards, createCard, deleteCard, likeCard,
  dislikeCard,
} = require('../controllers/card');

router.get('/', getCards);

router.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string().required(),
    }),
  }),
  createCard,
);

router.delete(
  '/:id',
  celebrate({
    cookies: Joi.object().keys({
      jwt: Joi.string().alphanum().min(3).max(200)
        .required(),
    }).unknown(true),
    params: Joi.object().keys({
      id: Joi.string().alphanum().min(3).max(200)
        .required(),
    }),
  }),
  deleteCard,
);

router.put(
  '/:id/likes',
  celebrate({
    params: Joi.object().keys({
      id: Joi.string().alphanum().min(3).max(200)
        .required(),
    }),
  }),
  likeCard,
);

router.delete(
  '/:id/likes',
  celebrate({
    params: Joi.object().keys({
      id: Joi.string().alphanum().min(3).max(200)
        .required(),
    }),
  }),
  dislikeCard,
);

module.exports = router;
