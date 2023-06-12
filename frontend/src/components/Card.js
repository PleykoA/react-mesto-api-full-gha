import React, { useContext } from 'react';
import CurrentUserContext from '../contexts/CurrentUserContext';

function Card({ card, onCardClick, onCardLike, onCardDelete }) {
  const currentUser = useContext(CurrentUserContext);
  const isOwn = card.owner === currentUser._id;
  const cardDeleteButtonClassName = isOwn
    ? 'card__delete'
    : 'card__delete_disable';
  const isLiked = card.likes.some((like) => {
    return like === currentUser._id;
  });

  const cardLikeButtonClassName = isLiked
      ? 'card__like card__like_active'
      : 'card__like';

  return (
    <div id='card-template'>
      <li className='card'>
        <img
          className='card__image'
          alt={card.name}
          src={card.link}
          onClick={() => onCardClick(card)}
        />
        <div className='card__container'>
          <h2 className='card__title'>{card.name}</h2>
          <div className='card__like_container'>

            <button
              className={cardLikeButtonClassName}
              type='button'
              id='like'
              onClick={() => onCardLike(card)}>
            </button>
            <span className='card__like-count'>{card.likes.length}</span>
          </div>
        </div>
        <button
            className={cardDeleteButtonClassName}
            type='button'
            onClick={() => onCardDelete(card)}>
        </button>
      </li>
    </div>
  );
}

export default Card;
