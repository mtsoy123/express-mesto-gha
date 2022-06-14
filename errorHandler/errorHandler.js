const BAD_REQUEST = 400;
const NOT_FOUND = 404;
const INTERNAL_SERVER_ERROR = 500;

module.exports.errorHandler = (res, err) => {
  if (err.name === 'ValidationError') {
    res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
    return;
  }

  if (err.name === 'CastError' || err.name === 'TypeError') {
    res.status(NOT_FOUND).send({ message: 'Запрашиваемые данные не найдены' });
    return;
  }

  res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла неизвестная ошибка' });
};
