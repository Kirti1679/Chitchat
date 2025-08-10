var socket = io();

/* Chatbox User Button */
var chatboxSidebarButton = document.querySelectorAll('.chatbox-sidebar-button');
var chatboxMessageList = document.querySelectorAll('.chatbox-messages')[0];
var messageSendButton = document.querySelector('#message-send');
var messageInput = document.querySelector('#message-input');
var messageForm = document.querySelector('#input-form');
var chatInputForm = document.querySelector('#input-form');
var urlObject = window.location;
var currentUserInChat, 
    currentChatButton,
    currentChatId;
var thisuserid = urlObject.pathname.split('/')[2];

var senderMessageDiv = (messageData) => {
    let newlistItem = document.createElement('li');
    newlistItem.setAttribute('class', 'sender-message chat-message');
    newlistItem.innerHTML = `
        <span class="message-content">${messageData.content}</span>
        <span class="message-time">${messageData.messageTime}</span>
    `

    return newlistItem;
};

var ownMessageDiv = (messageData) => {
    let newlistItem = document.createElement('li');
    newlistItem.setAttribute('class', 'own-message chat-message');
    newlistItem.innerHTML = `
        <span class="message-content">${messageData.content}</span>
        <span class="message-time">${messageData.messageTime}</span>
    `
    return newlistItem;
};

async function changeChatUser() {
    try {
        if(currentChatButton) currentChatButton.classList.remove('setBackgroundForButton');
        currentChatButton = this;
        currentChatButton.classList.add('setBackgroundForButton');
        
        await axios.get('/userdetails', {
            params: {
                userid: this.id
            }
        })
        .then(data => {
            currentUserInChat = data.data;
        })
        .catch(err => {
            console.log('Error occured in clientSockets > changeChatUser > /userdetails: ', err);
        });

        await axios.get('/getchatid', {
            params: {
                receiver: currentUserInChat._id
            }
        })
        .then(data => {
            currentChatId = data.data.chatId;
            // console.log('ClientSockets.js > changeChatUser > currentChatId: ', currentChatId);
        })
        .catch(err => {
            console.log('Error in clientSockets.js > handleChatInputSubmit > /getchatid: ', err);
        })

        await axios.get('/getchatmessages', {
            params: {
                chatId: currentChatId
            }
        })
        .then(data => {
            let messages = data.data;

            while(chatboxMessageList.firstChild)
                chatboxMessageList.removeChild(chatboxMessageList.lastChild);

            // messages.reverse();
            messages.forEach(message => {
                if(message.senderId == currentUserInChat._id) {
                    chatboxMessageList.append(senderMessageDiv(message))
                } else {
                    chatboxMessageList.append(ownMessageDiv(message))
                }
            })
            chatboxMessageList.scrollTop = chatboxMessageList.scrollHeight;
        })
        .catch(err => {
            console.log('Error in clientSockets.js > handleChatInputSubmit > /getchatmessages: ', err);
        })

    } catch (err) {
        console.log('Error in clientSockets > changeChatUser: ', err);
    }
}

Array.from(chatboxSidebarButton).forEach(userButton => 
    userButton.addEventListener('click', changeChatUser)
);

async function handleChatInputSubmit(e) {
    e.preventDefault();

    try {
        if(currentUserInChat == undefined || messageInput.value.length == 0)
            return;

        let messageTime = dayjs().format('D MMM YYYY, HH:mm');

        let newmessage = {
            content: messageInput.value,
            chatId: currentChatId,
            messageTime: messageTime,
            senderId: thisuserid
        }

        await axios.post('/addmessage', newmessage);

        messageInput.value = "";
        chatboxMessageList.append(ownMessageDiv(newmessage));
        chatboxMessageList.scrollTop = chatboxMessageList.scrollHeight;

        socket.emit('sendMessage', {
            receiverId: currentUserInChat._id,
            message: newmessage
        });

    } catch (err) {
        console.log('Error in clientSockets.js > handleChatInputSubmit async: ', err);
        return;
    }
}

function submitInput(e) {
    if(e.keyCode == 13) {
        messageForm.submit();   
    }
}

messageSendButton.addEventListener("keydown", submitInput);
messageInput.addEventListener("keydown", submitInput);
chatInputForm.addEventListener('submit', handleChatInputSubmit);

socket.emit('addUser', thisuserid);

socket.on('user connected', (arg) => {
    console.log(arg);
})

socket.on('getMessage', ({receiverId, message}) => {
    if(message.senderId == currentUserInChat._id) {
        chatboxMessageList.append(senderMessageDiv(message));
        chatboxMessageList.scrollTop = chatboxMessageList.scrollHeight;
    }
});

