var express = require('express');
var r = express.Router();

// load pre-trained model
const model = require('./sdk/model.js');

// Bot Setting
const TelegramBot = require('node-telegram-bot-api');
const token = '1842365425:AAFu1wQHZP4i9K2mADwFh9OJxzR28E9lDf8'
const bot = new TelegramBot(token, {polling: true});


// bots
bot.onText(/\/start/, (msg) => { 
    console.log(msg)
    bot.sendMessage(
        msg.chat.id,
        `Hello, Ilyasa Maulana...\n click /predict`
    );   
});

// input i and r
state = 0;
bot.onText(/\/predict/, (msg) => { 
    bot.sendMessage(
        msg.chat.id,
        `Silahkan masukan nilai X1|X2|X3 contoh 9|9|9`
    );   
    state = 1;
});

bot.on('message', (msg) => { 
    if(state == 1){
        s = msg.text.split("|");
        x1 = s[0]
        x2 = s[1]
        x3 = s[2]
        model.predict(
            [
                parseFloat(s[0]),
                parseFloat(s[1]),
                parseFloat(s[2])
            ]
         ).then((jres)=>{
            bot.sendMessage(
                msg.chat.id,
                `Y1 : ${jres[0]}`
            );
             bot.sendMessage(
                msg.chat.id,
                `Y2 : ${jres[1]}`
            );
             bot.sendMessage(
                msg.chat.id,
                `Y3 : ${jres[2]}`
            );
        })
     }else{
         state = 0
     }
})
    
// routers
r.get('/prediction/:x1/:x2/:x3', function(req, res, next) {    
    model.predict(
        [
            parseFloat(req.params.x1), // string to float
            parseFloat(req.params.x2),
            parseFloat(req.params.x3),
        ]
    ).then((jres)=>{
        res.json(jres);
    })
});

module.exports = r;
