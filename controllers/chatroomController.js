const User = require('../models/user');
const Chat = require('../models/chat');
const ChatMessage = require('../models/chatmessage');

module.exports.getUsers = async (req, res) => {
    try {
        let curruser = await User.findOne({_id: req.params.id})
        .populate({
            path: 'friendsList.userid'
        })

        // console.log(curruser);
        // console.log(curruser.friendsList);
        res.render('chatroom', {
            title: 'Chatroom | Chitchat',
            friends: curruser.friendsList
        });
    } catch(err) {
        console.log('Error occured in chatroomController > getUsers: ', err);
        return;
    }   
}

module.exports.getDetails = async (req, res) => {
    try {
        let thisuser = await User.findOne({_id: req.query.userid});
        return res.status(200).json(thisuser);
    } catch (err) {
        console.log('Error in chatroomController > getDetails: ', err);
        return;
    }
}

module.exports.getChatId = async (req, res) => {
    try {
        let receiverId = req.query.receiver; 
        let senderId = req.user.id;

        let currentChat = await Chat.findOne({
            chatusers: { $all: [receiverId, senderId]}
        })

        // console.log('chatroomController > getChatId > currentChat: ', currentChat);

        if(currentChat == undefined) { 
            currentChat = await Chat.create({
                chatusers: [receiverId, senderId]
            }) 
        }

        // console.log('chatRoomController > getChatId > receiverId: ', receiverId, ' senderid: ', senderId);
        return res.status(200).json({
            chatId: currentChat._id
        });
    } catch (err) {
        console.log('Error in chatroomController > getChatId: ', err);
    }
}

module.exports.addMessage = async (req, res) => {
    try {
        const newChatMessage = new ChatMessage(req.body);
        // console.log('chatroomController > addMessage > newChatmessage: ', newChatMessage);
        await newChatMessage.save();
        return res.status(200).json(newChatMessage);
    } catch (err) {
        console.log('Error in chatroomController > getChatId: ', err);
        return res.status(500).json(err);
    }
}

module.exports.getChatMessages = async (req, res) => {
    try {
        let chatId = req.query.chatId;
        let messages = await ChatMessage.find({chatId: chatId});
        return res.status(200).json(messages);
    } catch (err) {
        console.log('Error in chatroomController > getChatMessages: ', err);
        return res.status(500).json(err);
    }
}