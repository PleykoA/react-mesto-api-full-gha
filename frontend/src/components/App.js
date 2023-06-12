import { Route, Routes, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import CurrentUserContext from '../contexts/CurrentUserContext';
import auth from '../utils/auth.js';
import { Api } from '../utils/Api';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import ImagePopup from './ImagePopup';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import ProtectedRoute from './ProtectedRoute';
import PopupWithConfirmation from './PopupWithConfirmation';
import Login from './Login';
import Register from './Register';
import InfoTooltip from './InfoTooltip';

function App() {
    const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
    const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
    const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);
    const [currentUser, setCurrentUser] = useState({});
    const [cards, setCards] = useState([]);
    const [cardToDelete, setCardToDelete] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isUserLoaded, setIsUserLoaded] = useState(false);
    const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
    const [isInfoTooltipOpen, setInfoTTOpen] = useState(false);
    const [loggedIn, setLoggedIn] = useState(false);
    const [email, setEmailUser] = useState('');
    const [enter, setEnter] = useState(false);
    const navigate = useNavigate();

    const api = new Api(
        {
            baseUrl: 'https://api.pleykoa.nomoredomains.rocks',
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${localStorage.getItem('jwt')}`,
            },
        }
    );

    useEffect(() => {
        const jwt = localStorage.getItem('jwt');
        if (jwt) {
            auth
                .checkToken(jwt)
                .then((res) => {
                    if (res) {
                        navigate('/');
                        setEmailUser(res.email);
                        setLoggedIn(true);
                    }
                })
                .catch((err) => console.log(err));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        setTimeout(() => {
            loggedIn &&
                Promise.all([api.getUserInfoApi(), api.getInitialCards()])
                    .then(([user, cardData]) => {
                        setCurrentUser(user);
                        setCards(cardData.reverse());
                        setIsUserLoaded(true);
                    })
                    .catch((err) => {
                        console.log(err);
                    });
        }, 0);
    }, [loggedIn]);

    function closePopup(evt) {
        if (evt.target.classList.contains('popup_opened')) {
            closeAllPopups();
        }
        else if (evt.target.classList.contains('popup__close-button')) {
            closeAllPopups();
        }
        else if (evt.key === 'Escape') {
            closeAllPopups();
        }
    };

    function handleLogin(email, password) {
        auth
            .authorize(email, password)
            .then((data) => {
                if (data.token) {
                    localStorage.setItem('jwt', data.token);
                    setLoggedIn(true);
                    navigate('/');
                }
            })
            .catch((err) => {
                setInfoTTOpen(true)
                setEnter(false)
                console.log(err);
            })
    }

    function handleRegister(values) {
        auth
            .register(values.email, values.password)
            .then(() => {
                setEnter(true);
                navigate('/signin', { replace: true });
            })
            .catch((err) => {
                setEnter(true);
                console.log(err);
            })
            .finally(() =>
                setInfoTTOpen(true));
    }

    function handleSingOut() {
        setLoggedIn(false);
        setEmailUser('');
        localStorage.removeItem('jwt');
    }

    useEffect(() => {
        if (isEditProfilePopupOpen || isEditAvatarPopupOpen || isAddPlacePopupOpen || selectedCard || isDeletePopupOpen || isInfoTooltipOpen) {
            document.addEventListener('keydown', closePopup);
            document.addEventListener('mousedown', closePopup);
        }
        return () => {
            document.removeEventListener('keydown', closePopup);
            document.removeEventListener('mousedown', closePopup);
        };
    });

    function closeAllPopups() {
        setIsEditAvatarPopupOpen(false);
        setIsEditProfilePopupOpen(false);
        setIsAddPlacePopupOpen(false);
        setIsDeletePopupOpen(false);
        setSelectedCard(null);
        setInfoTTOpen(false);
    }

    function handleCardClick(card) {
        setSelectedCard(card);
    };

    function handleEditAvatarClick() {
        setIsEditAvatarPopupOpen(true);
    };

    function handleEditProfileClick() {
        setIsEditProfilePopupOpen(true);
    };

    function handleAddPlaceClick() {
        setIsAddPlacePopupOpen(true);
    };

    function handleCardDelete(card) {
        setCardToDelete(card);
        setIsDeletePopupOpen(true);
    };

    function handleUpdateAvatar(data) {
        setIsLoading(true);
        api
            .editAvatar(data)
            .then((userData) => {
                setCurrentUser(userData);
                closeAllPopups();
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }

    function handleUpdateUser(user) {
        setIsLoading(true);
        api
            .editProfile(user)
            .then((userInfo) => {
                setCurrentUser(userInfo);
                closeAllPopups();
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }

    function handleAddPlaceSubmit(card) {
        setIsLoading(true);
        api
            .addCard(card)
            .then((card) => {
                setCards([card, ...cards]);
                closeAllPopups();
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() =>
                setIsLoading(false));
    };

    function handleCardLike(card) {
        const isLiked = card.likes.some((like) =>
            like === currentUser._id);
        if (!isLiked) {
            api
                .likeCard(card._id)
                .then((card) => {
                    setCards((state) =>
                        state.map((c) =>
                            (c._id === card._id ? card : c))
                    );
                })
                .catch((err) => {
                    console.log(err);
                });
        } else {
            api
                .removeLikeCard(card._id)
                .then((card) => {
                    setCards((state) =>
                        state.map((c) =>
                            (c._id === card._id ? card : c))
                    );
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }

    function handleDeleteClick(card) {
        setIsLoading(true);
        api
            .deleteCard(card._id)
            .then(() => {
                setCards(() =>
                    cards.filter((c) =>
                        c._id !== card._id)
                );
            })
            .then(() =>
                closeAllPopups())
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }

    return (
        <div className='page'>
            <CurrentUserContext.Provider value={currentUser}>
                <Routes>
                    <Route path='/signin'
                        element={
                            <>
                                <Header title='Регистрация' link='/signup' />
                                <Login onLogin={handleLogin} loggedIn={loggedIn} />
                            </>
                        }
                    />
                    <Route path='/signup'
                        element={<>
                            <Header title='Войти' link='/signin' />
                            <Register onRegister={handleRegister} />
                        </>}
                    />
                    <Route path='/'
                        element={
                            <>
                                <Header
                                    title='Выйти'
                                    email={email}
                                    loggedIn={loggedIn}
                                    onSignOut={handleSingOut}
                                />
                                <ProtectedRoute
                                    element={Main}
                                    loggedIn={loggedIn}
                                    editProfile={handleEditProfileClick}
                                    addPlace={handleAddPlaceClick}
                                    editAvatar={handleEditAvatarClick}
                                    onCardClick={handleCardClick}
                                    onCardLike={handleCardLike}
                                    onCardDelete={handleCardDelete}
                                    cards={cards}
                                    isUserLoaded={isUserLoaded}
                                />
                                <Footer />
                            </>
                        }
                    />
                </Routes>

                <EditProfilePopup
                    isOpen={isEditProfilePopupOpen}
                    onClose={closeAllPopups}
                    onUpdateUser={handleUpdateUser}
                    isLoading={isLoading}
                />

                <EditAvatarPopup
                    isOpen={isEditAvatarPopupOpen}
                    onClose={closeAllPopups}
                    editAvatar={handleUpdateAvatar}
                    isLoading={isLoading}
                />

                <AddPlacePopup
                    isOpen={isAddPlacePopupOpen}
                    onClose={closeAllPopups}
                    addPlace={handleAddPlaceSubmit}
                    isLoading={isLoading}
                />

                <PopupWithConfirmation
                    card={cardToDelete}
                    onClose={closeAllPopups}
                    isOpen={isDeletePopupOpen}
                    isLoading={isLoading}
                    onCardDelete={handleDeleteClick}
                    isValid={true}
                />

                <ImagePopup
                    card={selectedCard}
                    onClose={closeAllPopups}
                />

                <InfoTooltip
                    isOpen={isInfoTooltipOpen}
                    onClose={closeAllPopups}
                    isSignedUp={enter}
                />
            </CurrentUserContext.Provider>
        </div>
    );
}

export default App;
