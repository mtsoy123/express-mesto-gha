const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRouter = require('./routes/user');
const cardRouter = require('./routes/card');
const { errorHandler } = require('./errorHandler/errorHandler');

const app = express();
const { PORT = 3000 } = process.env;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use((req, res, next) => {
  req.user = {
    _id: '62a763af324b7167e17aa3c3',
  };

  next();
});

app.use('/users', userRouter);
app.use('/cards', cardRouter);
// todo refactor below
/* app.use((req, res) => {
  const err = new Error('CastError');
  err.name = 'CastError';
  errorHandler(res, err);
}); */
app.listen(PORT, 'localhost');
