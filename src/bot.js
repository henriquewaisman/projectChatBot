const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
require('dotenv').config()

const TelegramBot = require('node-telegram-bot-api');

const token = process.env.TELEGRAM_TOKEN;

const bot = new TelegramBot(token, {polling: true});

const existingUser = await prisma.usuario.findUnique({
    where: {
      email: userEmail
    }
});
  

bot.onText(/\/echo (.+)/, (msg, match) => {

  const chatId = msg.chat.id;
  const resp = match[1];
  
  bot.sendMessage(chatId, resp);
});

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;

    let unix_timestamp = msg.date;
    var date = new Date(unix_timestamp * 1000);
    var hours = date.getHours();
    var minutes = "0" + date.getMinutes();
    var seconds = "0" + date.getSeconds();
    const formattedTime = hours + minutes.substr(-2) + seconds.substr(-2);
    var numericTime = parseInt(formattedTime);

    if(msg.text == "/start"){
        bot.sendMessage(chatId, "Bem vindo ao atendimento da Universidade Vila Velha");
    }
    else{
        if(numericTime > 90000 && numericTime < 180000){
          bot.sendMessage(chatId, "https://uvv.br");
          return;
        }
        else{
            if(!(msg.text).includes("@")){
                bot.sendMessage(chatId, "Estamos fora do horário de atendimento, digite seu email para entrarmos em contato assim que possível.", {reply_markup: {force_reply: true}});
            }
            else{
                if(msg.text && msg.text !== "" && (msg.text).includes("@") ){
                    if (existingUser) {
                        bot.sendMessage(chatId, "Email já cadastrado");
                        return;
                    }
                    else{
                        await prisma.usuario.create({
                            data: {
                                email: msg.text
                            }
                        })
                        bot.sendMessage(chatId, "Email registrado, assim que possível entraremos em contato");
                    }
                }
            }
        }
    }
});