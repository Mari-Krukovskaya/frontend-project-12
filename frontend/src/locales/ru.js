export default {
  translation: {
    nav: {
      chat: 'Hexlet Chat',
      exit: 'Выйти',
      login: 'Войти',
    },
    authForm: {
      logIn: 'Войти',
      name: 'Ваш ник',
      password: 'Пароль',
      buttonLogIn: 'Войти',
      noAcc: 'Нет аккаунта?',
      signUp: 'Регистрация',
      validForm: {
        notExist: 'Неверные имя пользователя или пароль',
        required: 'Заполните это поле',
      },
    },
    signUp: {
      registration: 'Регистрация',
      username: 'Имя пользователя',
      password: 'Пароль',
      confirmPassword: 'Подтвердитe пароль',
      buttonRegister: 'Зарегистрироваться',
      validSignUp: {
        required: 'Заполните это поле',
        usernameMinMax: 'От 3 до 20 символов',
        passwordMin: 'Не менее 6 символов',
        confirmPassword: 'Пароли должны совпадать',
        alreadyExists: 'Такой пользователь уже существует',
      },
    },
    modal: {
      channels: 'Каналы',
      channelControl: 'Управление каналом',
      addModalChannel: 'Добавить канал',
      removeModalChannel: 'Удалить канал',
      renameModalChannel: 'Переименовать канал',
      validChannel: {
        required: 'Обязательное поле',
        nameMinMax: 'От 3 до 20 символов',
        uniq: 'Должно быть уникальным',
        obsceneLexicon: 'Ненормативная лексика',
      },
      nameChannel: 'Имя канала',
      buttonCancel: 'Отменить',
      buttonCreate: 'Отправить',
      areYouSure: 'Уверены?',
      delete: 'Удалить',
    },
    messages: {
      counter: {
        count_one: '{{count}} сообщение',
        count_few: '{{count}} сообщения',
        count_many: '{{count}} сообщений',
      },
      newMessage: 'Новое сообщение',
      messagePlaceholder: 'Введите сообщение...',
      enterMessage: 'Оправить',
    },
    toasts: {
      createChannel: 'Канал создан',
      renameChanel: 'Канал переименован',
      removeChannel: 'Канал удалён',
      connectError: 'Ошибка соединения',
      uknownError: 'Неизвестная ошибка',
    },

    pageNotFound: {
      notFound: 'Страница не найдена',
      clickTheLink: 'Но вы можете перейти',
      goToHomePage: 'На главную страницу',
    },
  },
};
