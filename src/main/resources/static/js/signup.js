
document.addEventListener('DOMContentLoaded', function () {
    var connectingElement = document.querySelector('#error-message');
    var signupForm = document.querySelector('#usernameForm');

    signupForm.addEventListener('submit', function (event) {
        event.preventDefault();

        var username = document.querySelector('#username').value.trim();
        var email = document.querySelector('#email').value.trim();
        var password = document.querySelector('#password').value.trim();

        // Проверка на пустые поля
        if (!username || !email || !password) {
            connectingElement.textContent = 'Пожалуйста, заполните все обязательные поля.';
            return;
        }

        // Проверка формата электронной почты
        if (!isValidEmail(email)) {
            connectingElement.textContent = 'Проверьте правильность вашей почты!';
            return;
        }

        // Отправка данных на сервер для проверки пользователя и регистрации
        checkAndRegisterUser(username, email, password);
    });

    function checkAndRegisterUser(username, email, password) {
        // Проверка существования пользователя с указанным логином и паролем
        fetch('/checkUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        })
            .then(response => {
                if (!response.ok) {
                    connectingElement.textContent = 'Пользователь с такими данными уже существует!';
                }
                return response.json();
            })
            .then(data => {
                if (data.error) {
                    throw new Error('Ошибка проверки существования пользователя.');
                }

                if (data.exists) {
                    connectingElement.textContent = 'Пользователь с такими данными уже существует!';
                } else {
                    // Отправка данных на сервер для регистрации пользователя
                    registerUser(username, email, password);
                }
            })
            .catch(error => {
                console.error('Ошибка проверки пользователя:', error);
                connectingElement.textContent = 'Пользователь с такими данными уже существует!';
            });
    }

    function registerUser(username, email, password) {
        var userData = {
            username: username,
            email: email,
            password: password
        };

        fetch('/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        })
            .then(response => {
                if (response.ok) {
                    // Регистрация прошла успешно
                    console.log('Пользователь успешно зарегистрирован');
                    window.location.href = 'index.html';
                } else {
                    // Вывод сообщения об ошибке
                    connectingElement.textContent = 'Пользователь с такими данными уже зарегистрирован!';
                }
            })
            .catch(error => {
                console.error('Ошибка регистрации пользователя:', error);
            });
    }

    // Функция для проверки формата электронной почты
    function isValidEmail(email) {
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
});
