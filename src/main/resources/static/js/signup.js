document.addEventListener('DOMContentLoaded', function () {
    var signupForm = document.querySelector('#usernameForm');

    signupForm.addEventListener('submit', function (event) {
        event.preventDefault();

        var username = document.querySelector('#username').value.trim();
        var email = document.querySelector('#email').value.trim();
        var password = document.querySelector('#password').value.trim();

        // Отправка данных на сервер для регистрации пользователя
        registerUser(username, email, password);
    });

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
                    console.log('User registered successfully');
                    window.location.href = 'index.html';
                } else {
                    // Вывод сообщения об ошибке
                    console.error('User registration failed:', response.statusText);
                }
            })
            .catch(error => {
                console.error('User registration failed:', error);
            });
    }
});
