const Card = require('../models/card');
const ErrorNotFound = require('../errors/ErrorNotFound');
const ErrorRequest = require('../errors/ErrorRequest');
const ErrorForbidden = require('../errors/ErrorForbidden');
const {
  STATUS_OK,
  ERROR_INCORRECT_DATA,
  ERROR_NOT_FOUND,
  ERROR_DEFAULT,
} = require('../utils/status');

const getCards = (req, res, next) => {
  Card.find({})
    .then((card) => res.send({ data: card }))
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new ErrorRequest('Переданы некорректные данные при создании карточки'));
      }
      return next(err);
    });
};

const deleteCardById = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new ErrorNotFound('Данная карточка не найдена');
      }
      if (card.owner.toString() !== req.user._id) {
        throw new ErrorForbidden('Недостаточно прав для удаления карточки');
      }
      Card.deleteOne(card)
        .then(() => res.status(200).send({ data: card }));
    })
    .catch(next);
};

const putCardLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new ErrorNotFound('Передан несуществующий _id карточки');
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new ErrorRequest('Переданы некорректные данные для постановки лайка'));
      }
      return next(err);
    });
};

const deleteCardLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new ErrorNotFound('Передан несуществующий _id карточки');
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new ErrorRequest('Переданы некорректные данные для постановки лайка'));
      }
      return next(err);
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCardById,
  putCardLike,
  deleteCardLike,
};
