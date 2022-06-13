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

// todo refactor w controllers https://practicum.yandex.ru/trainer/web/lesson/29237838-8563-4a61-b293-df39dde99f6b/task/2cac01f2-4ef2-420e-8582-391b20879f50/

module.exports = router;
