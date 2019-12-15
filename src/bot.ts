import { Message, Client } from 'discord.js';
var Discord = require('discord.js');
var auth = require('./auth.json');
const top100 = require('./commands/top100/main');
const admin = require('./commands/admin-exchange/main');
const account = require('./commands/account/main');
const pickChamp = require('./commands/pickChamp/main');
const spy = require('./commands/spy/main');
const leagues = require('./commands/rank/main');
const greet = require('./commands/greet/main');
const validBotTriggers = [
  'lolsito ',
  '<@646462052885463060> ',
  '!lolsito ',
  '/lolsito ',
  '@lolsito '
];

// Initialize Discord Bot
var bot: Client = new Discord.Client();
bot.on('ready', () => {
  console.log(`Connected as ${bot.user.tag}`);
});
bot.on('message', (message: Message) => {
  const { content, channel, author } = message;
  console.log(`~~Reading a message from ${author}(${author.id})`, content);
  let lowercaseMessage = content.toLowerCase();
  let botCommandIssued = false;
  if (validBotTriggers.some(botTriggerString => lowercaseMessage.startsWith(botTriggerString))) {
    botCommandIssued = true;
  }
  if (botCommandIssued) {
    var args = content.split(' ');
    var cmd = args[1].toLowerCase();
    console.log(`ARGS FOR THIS MESSAGE: ${args}`);
    switch (cmd) {
      // !ping
      case 'espia':
      case 'espía':
        spy.getEnemyRanks(channel, author, args.slice(2).join(' '));
        break;
      case 'hola':
        greet.greet(channel, author);
        break;
      case 'registrame':
      case 'regístrame':
        account.register(channel, author, args.slice(2).join(' '));
        break;
      case 'rank':
        leagues.getRank(channel, author, args.slice(2).join(' '));
        break;
      case 'top100':
        top100.getTop100(channel, author, args.slice(2).join(' '));
        break;
      case 'escoge':
        pickChamp.random(
          channel,
          args
            .slice(2)
            .join(' ')
            .toLowerCase()
        );
        break;
      default:
        message.channel.send('Así no se usa el bot brgas e.e');
    }
  } else if (lowercaseMessage.startsWith('intercambio')) {
    var args = content.split(' ');
    var cmd = args[1].toLowerCase();
    console.log(`ARGS FOR THIS MESSAGE: ${args}`);
    switch (cmd) {
      // !ping
      case 'detalles':
        admin.details(author);
        break;
      case 'dime':
        admin.getExchangeInfo(author);
        break;
      case 'admin1996':
        admin.assignExchangePartners(author);
        break;
      case 'nota':
        admin.wishlist(author, args.slice(2).join(' '));
        break;
      case 'msgall':
        admin.messageExchangeUsers(bot, args.slice(2).join(' '));
        break;
    }
  }
});
console.log('should login soon./..');
bot.login(auth.botToken);
