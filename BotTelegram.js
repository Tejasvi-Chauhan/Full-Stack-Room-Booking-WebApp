require('dotenv').config();


const TelegramBot = require('node-telegram-bot-api');
// Bot token aur chat ID
const token = process.env.TELEGRAM_BOT_TOKEN  // BotFather se mila
const chatId = process.env.CHAT_ID;   // getUpdates se mila

const bot = new TelegramBot(token);

function sendTelegramMessage(message){
    bot.sendMessage(chatId, message)
}

module.exports = sendTelegramMessage;
