const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRouter = require('./routes/user');
const cardRouter = require('./routes/card');

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

app.post('/users', userRouter);
app.get('/users', userRouter);
app.get('/users/:id', userRouter);
app.patch('/users/me', userRouter);
app.patch('/users/me/avatar', userRouter);

app.post('/cards', cardRouter);
app.get('/cards', cardRouter);
app.delete('/cards/:id', cardRouter);
app.put('/cards/:id/likes', cardRouter);
app.delete('/cards/:id/likes', cardRouter);

app.listen(PORT, 'localhost');
