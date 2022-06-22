const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRouter = require('./routes/user');
const cardRouter = require('./routes/card');
const { NOT_FOUND } = require('./utils/errorStatuses');
const { login, createUser } = require('./controllers/user');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  req.user = {
    _id: '62a763af324b7167e17aa3c3',
  };

  next();
});
app.use('/users', userRouter);
app.use('/cards', cardRouter);
app.post('/signin', login);
app.post('/signup', createUser);
app.use((req, res) => {
  res.status(NOT_FOUND).send({ message: 'Запрашиваемая страница не найдена.' });
});

app.listen(PORT, 'localhost');
