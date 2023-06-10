const router = require('express').Router();

const {
  validationCreateCard,
  validationCardById,
} = require('../middlewares/validation');

const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  removeLikeCard,
} = require('../controllers/cards');

router.get('/api', getCards);
router.post('/api', validationCreateCard, createCard);
router.delete('/api:cardId', validationCardById, deleteCard);
router.put('/api:cardId/likes', validationCardById, likeCard);
router.delete('/api:cardId/likes', validationCardById, removeLikeCard);

module.exports = router;
