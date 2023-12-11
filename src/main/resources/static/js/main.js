'use strict';

var usernamePage = document.querySelector('#username-page');
var chatPage = document.querySelector('#chat-page');
var usernameForm = document.querySelector('#usernameForm');
var messageForm = document.querySelector('#messageForm');
var messageInput = document.querySelector('#message');
var messageArea = document.querySelector('#messageArea');
var connectingElement = document.querySelector('.connecting');

var stompClient = null;
var username = null;

var colors = [
    '#2196F3', '#32c787', '#00BCD4', '#ff5652',
    '#ffc107', '#ff85af', '#FF9800', '#39bbb0'
];

function connect(event) {
    event.preventDefault();

    username = document.querySelector('#username').value.trim();
    var password = document.querySelector('#password').value.trim();

    // Отправка данных на сервер для аутентификации
    authenticateUser(username, password);
}
function authenticateUser(username, password) {
    var authData = {
        username: username,
        password: password
    };

    fetch('/authenticate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(authData)
    })
        .then(response => {
            if (response.ok) {
                // Аутентификация прошла успешно, подключаемся к веб-чату
                usernamePage.classList.add('hidden');
                chatPage.classList.remove('hidden');

                var socket = new SockJS('/ws');
                stompClient = Stomp.over(socket);
                stompClient.connect({}, onConnected, onError);
            } else {
                // Аутентификация не удалась, выводим сообщение об ошибке
                connectingElement.textContent = 'Авторизация не завершена! Проверьте свои данные!';
                connectingElement.style.color = 'red';
            }
        })
        .catch(error => {
            console.error('Authentication failed:', error);
        });
}


function onConnected() {
    // Subscribe to the Public Topic
    stompClient.subscribe('/topic/public', onMessageReceived);

    // Tell your username to the server
    stompClient.send("/app/chat.addUser",
        {},
        JSON.stringify({sender: username, type: 'JOIN'})
    )

    connectingElement.classList.add('hidden');
}


function onError(error) {
    connectingElement.textContent = 'Не могу подключиться к WebSockets. Обновите страницу и попробуйте снова!';
    connectingElement.style.color = 'red';
}


function sendMessage(event) {
    var messageContent = messageInput.value.trim();
    if(messageContent && stompClient) {
        var chatMessage = {
            sender: username,
            content: messageInput.value,
            type: 'CHAT',
            timestamp: new Date().toISOString()  // Используйте текущее время в формате строки
        };
        stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(chatMessage));
        messageInput.value = '';
    }
    event.preventDefault();
}


function onMessageReceived(payload) {
    var message = JSON.parse(payload.body);
    var messageElement = document.createElement('li');

    if (message.type === 'JOIN' || message.type === 'LEAVE') {
        messageElement.classList.add('event-message');

        var eventText = document.createElement('p');
        eventText.textContent = message.sender + (message.type === 'JOIN' ? ' joined!' : ' left!');

        messageElement.appendChild(eventText);

    } else {
        messageElement.classList.add('chat-message');

        var avatarElement = document.createElement('i');
        var avatarText = document.createTextNode(message.sender[0]);
        avatarElement.appendChild(avatarText);
        avatarElement.style['background-color'] = getAvatarColor(message.sender);

        var contentWrapper = document.createElement('div');
        contentWrapper.classList.add('content-wrapper');

        var usernameElement = document.createElement('p');
        usernameElement.classList.add('username');
        usernameElement.style['font-weight'] = 'bold';
        var usernameText = document.createTextNode(message.sender);
        usernameElement.appendChild(usernameText);

        var textElement = document.createElement('p');
        var messageText = document.createTextNode(message.content);
        textElement.appendChild(messageText);

        // Отображение времени справа
        var timeElement = document.createElement('span');
        timeElement.classList.add('timestamp');
        var timestamp = new Date(message.timestamp);
        var hours = timestamp.getHours();
        var minutes = "0" + timestamp.getMinutes();
        var seconds = "0" + timestamp.getSeconds();
        var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
        var timeText = document.createTextNode(formattedTime);
        timeElement.appendChild(timeText);

        contentWrapper.appendChild(usernameElement);
        contentWrapper.appendChild(textElement);
        contentWrapper.appendChild(timeElement);

        messageElement.appendChild(avatarElement);
        messageElement.appendChild(contentWrapper);
    }

    messageArea.appendChild(messageElement);
    messageArea.scrollTop = messageArea.scrollHeight;

    messageElement.addEventListener('contextmenu', function (event) {
        event.preventDefault();
        var isMyMessage = message.sender === username;
        if (isMyMessage) {
            var deleteConfirmation = confirm('Are you sure you want to delete this message?');
            if (deleteConfirmation) {
                messageElement.remove();
            }
        }
    });
}


function getAvatarColor(messageSender) {
    var hash = 0;
    for (var i = 0; i < messageSender.length; i++) {
        hash = 31 * hash + messageSender.charCodeAt(i);
    }
    var index = Math.abs(hash % colors.length);
    return colors[index];
}


usernameForm.addEventListener('submit', connect, true)
messageForm.addEventListener('submit', sendMessage, true)