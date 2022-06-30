[![Tests](https://github.com/mtsoy123/express-mesto-gha/actions/workflows/tests-13-sprint.yml/badge.svg)](https://github.com/mtsoy123/express-mesto-gha/actions/workflows/tests-13-sprint.yml) [![Tests](https://github.com/mtsoy123/express-mesto-gha/actions/workflows/tests-14-sprint.yml/badge.svg)](https://github.com/mtsoy123/express-mesto-gha/actions/workflows/tests-14-sprint.yml)

# Проект Mesto. Бэкенд
![logo](https://github.com/mtsoy123/react-mesto-auth/blob/main/src/images/logoDark.svg)


## Запуск приложения
`npm run start`

## О проекте
Бекенд для приложения Mesto. Mesto — приложение для публикации фотографий в общую ленту. Это учебный проект, в котором на практике поработал с фреймворками express.js, node.js и базами данных. В приложении реализована обработка запросов и ошибок. Роуты защищены авторизацией, пароль хешируется. Запросы вылидируются до передачи в контроллеры и в схеме базы данных

## Роутинг
* POST /signin — авторизация пользователя
* POST /signup — регистрация пользователя
* GET /users — возвращает всех пользователей
* GET /users/me - возвращает информацию о текущем пользователе
* GET /users/:userId - возвращает пользователя по _id
* GET /cards — возвращает все карточки
* POST /cards — создаёт карточку
* DELETE /cards/:cardId — удаляет карточку по идентификатору
* PATCH /users/me — обновляет профиль
* PATCH /users/me/avatar — обновляет аватар
* PUT /cards/:cardId/likes — ставит лайк карточке
* DELETE /cards/:cardId/likes — убирает лайк с карточки

## Технологии
* Node.js
* Express.js
* Mongodb
* Mongoose
* Joi
* celebrate
