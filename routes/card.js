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
      link: Joi.string().required().regex(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~://?#[\]@!$&'()*+,;=.]+/im),
    }),
  }),
  createCard,
);

router.delete(
  '/:id',
  celebrate({
    cookies: Joi.object().keys({
      jwt: Joi.string().min(3).max(200)
        .required(),
    }).unknown(true),
    params: Joi.object().keys({
      id: Joi.string().hex().length(24),
    }),
  }),
  deleteCard,
);

router.put(
  '/:id/likes',
  celebrate({
    params: Joi.object().keys({
      id: Joi.string().hex().length(24),
    }),
  }),
  likeCard,
);

router.delete(
  '/:id/likes',
  celebrate({
    params: Joi.object().keys({
      id: Joi.string().hex().length(24),
    }),
  }),
  dislikeCard,
);

module.exports = router;
