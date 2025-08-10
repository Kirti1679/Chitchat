const socketio = require('socket.io');
const axios = require('axios');
const User = require('../models/user');

let users = [];

module.exports = (server) => {
    var io = socketio(server);

    io.on('connection', async (socket) => {
        let socketId = socket.id;


        socket.emit('user connected', "connected");

        socket.on('addUser', (userId) => {
            if(!users.find((user) => user.userId == userId)) {
                users.push({
                    userId: userId, 
                    socketId: socket.id
                });
                // console.log('serverSockets > Users: ', users);
            }
        })

        
        socket.on('sendMessage', ({receiverId, message}) => {
            let receiver = users.find((user) => user.userId == receiverId);
            if(receiver) {
                socket.to(receiver.socketId).emit('getMessage', {receiverId, message});
            }
        });

        socket.on('disconnect', () => {
            // console.log('User with socket Id: ', socketId, ' disconnected!');
            users = users.filter((user) => user.socketId != socketId);
        })
    })
    
}