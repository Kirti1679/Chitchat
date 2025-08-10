const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const dayjs = require('dayjs');
const messageSchema = new Schema({
    content: {
        type: String
    }, 
    chatId: {
        type: String
    },
    messageTime: {
        type: String,
        default: dayjs().format('D MMM YYYY HH:mm')
    }, 
    senderId: {
        type: mongoose.Schema.Types.ObjectId
    }
});

const ChatMessage = mongoose.model('ChatMessage', messageSchema);
module.exports = ChatMessage;