const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const userRouter = require('./routes/user');
const cardRouter = require('./routes/card');
const { NOT_FOUND } = require('./utils/errorStatuses');
const { login, createUser } = require('./controllers/user');
const auth = require('./middlewares/auth');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
// app.use('/', (req, res) => console.log('cookie', req.cookies.jwt));
app.post('/signin', login);
app.post('/signup', createUser);

app.use(auth);

/* app.use((req, res, next) => {
  req.user = {
    _id: '62a763af324b7167e17aa3c3',
  };

  next();
}); */
app.use('/users', userRouter);
app.use('/cards', cardRouter);

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
});

app.listen(PORT, 'localhost');
