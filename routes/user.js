const router = require('express').Router();
const User = require('../models/user');

router.get('/users', (req, res) => {
  User.find({})
    .then((users) => res.send(users));
});

router.get('/users/:userId', (req, res) => {
  User.find({})
    .then(() => res.send({ users: _id }));
});

router.post('/users', (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
});

module.exports = router;
