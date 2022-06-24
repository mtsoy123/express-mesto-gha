const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const BadRequestErr = require('../utils/errors/BadRequestErr');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Жак-Ив Кусто',
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    default: 'Исследователь',
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator(v) {
        return /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:\/\/?#[\]@!\$&'\(\)\*\+,;=.]+/igm.test(v);
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
  },
  email: {
    required: true,
    type: String,
    validate: {
      validator(email) {
        return validator.isEmail(email);
      },
    },
    unique: true,
  },
  password: {
    required: true,
    type: String,
    select: false,
  },
}, {
  versionKey: false,
});

userSchema.statics.findUserByCred = function (email, password) {
  if (!email || !password) {
    throw new BadRequestErr(' Не передан email или пароль');
  }
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise(new Error('Неправильные почта или пароль'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise(new Error('Неправильные почта или пароль'));
          }

          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
