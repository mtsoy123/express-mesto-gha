const router = require('express').Router();
const {
  getCards, createCard, deleteCard, likeCard,
  dislikeCard,
} = require('../controllers/card');

router.get('/cards', getCards);

router.post('/cards', createCard);

router.delete('/cards/:id', deleteCard);

router.put('/cards/:id/likes', likeCard);

router.delete('/cards/:id/likes', dislikeCard);
// router.get('/cards/:id', (req, res) => res.send('qwe'));

module.exports = router;
