const router = require('express').Router();
const { createUser, login } = require('../controllers/users');
const { celebrate, Joi } = require('celebrate');
const auth = require('../middlewares/auth');
const routesCard = require('./cards');
const routesUser = require('./users');
const NotFoundError = require('../errors/ErrorNotFound');

router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern((/^(https?:\/\/)?([\w-]{1,32}\.[\w-]{1,32})[^\s@]*$/)),
    email: Joi.string().required(),
    password: Joi.string().required().min(8),
  }),
}), createUser);

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required().min(8),
  }),
}), login);

router.use(auth);

router.use(routesUser);
router.use(routesCard);

router.use('*', () => {
  throw new NotFoundError('Страница не найдена');
});

module.exports = router;