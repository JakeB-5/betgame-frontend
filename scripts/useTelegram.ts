import TelegramBot from 'node-telegram-bot-api'

const token = 'TELEGRAM_BOT_TOKEN'  
const chatId = 0 // Replace with your chat ID

// bot.onText(/\/echo (.+)/, (msg, match) => {
//   const chatId = msg.chat.id
//   const resp = match[1]
//
//   console.log(chatId)
//   bot.sendMessage(chatId, resp)
//})

// bot.on('message', msg => {
//   const chatId = msg.chat.id
//   console.log(chatId)
//
//   bot.sendMessage(chatId, 'Received your message, identifier: ' + chatId)
// })

//const bot = new TelegramBot(token, {polling: true})


export const sendTelMessage = (msg) => {
  const bot = new TelegramBot(token, {polling: false})
  bot.sendMessage(chatId, msg)

}
