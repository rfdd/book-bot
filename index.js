const TelegramBot = require('node-telegram-bot-api');
const ogs = require('open-graph-scraper');
const firebase = require('firebase');
//const ref = firebase.database().ref();
//const sitesRef = ref.child('sites');
    
const token = '1298638362:AAGO_fhNKzBca50y6r5hf_uSXyO7vJ_o1D0';
const bot = new TelegramBot(token, {polling: true});

bot.on('message', (msg) => {
    bot.sendMessage(msg.chat.id, 'i am alive))');
  });
  
  
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
//const firebaseConfig = {
  //  apiKey: "AIzaSyDwxQTvn6dHyqq8dDqQvhMIia2y4nyrCfA",
  //  authDomain: "rfd-bot.firebaseapp.com",
  //  databaseURL: "https://rfd-bot-default-rtdb.firebaseio.com",
  //  projectId: "rfd-bot",
  //  storageBucket: "rfd-bot.appspot.com",
  //  messagingSenderId: "513379893085",
  //  appId: "1:513379893085:web:6e234549a439d33df372b4",
  //  measurementId: "G-69XCJRS09B"
  //};

  
  

let siteUrl;
bot.onText(/\/bookmark (.+)/, (msg, match) => {
    siteUrl = match[1];  bot.sendMessage(msg.chat.id,'Got it, in which category?', {
      reply_markup: {
        inline_keyboard: [[
          {
            text: 'Development',
            callback_data: 'development'
          },{
            text: 'Music',
            callback_data: 'music'
          },{
            text: 'Other+',
            callback_data: 'other'
          }
        ]]
      }
    });
  });


  bot.on("callback_query", (callbackQuery) => {
    const message = callbackQuery.message;  ogs({'url': siteUrl}, function (error, results) {
      if(results.success) {
        sitesRef.push().set({
          name: results.data.ogSiteName,
          title: results.data.ogTitle,
          description: results.data.ogDescription,
          url: siteUrl,
          thumbnail: results.data.ogImage.url,
          category: callbackQuery.data
        });      bot.sendMessage(message.chat.id,'Added \"' + results.data.ogTitle +'\" to category \"' + callbackQuery.data + '\"!')
  } else {
        sitesRef.push().set({
          url: siteUrl
        });
        bot.sendMessage(message.chat.id,'Added new website, but there was no OG data!');
      }
    });
  });