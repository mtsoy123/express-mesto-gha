const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;

mongoose.connect('mongodb://localhost:27017/mestodb ', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
