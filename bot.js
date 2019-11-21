var Discord = require("discord.io");
var auth = require("./auth.json");
const top100 = require("./commands/top100/main");
const account = require("./commands/account/main");
const spy = require("./commands/spy/main");
const leagues = require("./commands/rank/main");
const greet = require("./commands/greet/main");
var rlh = require("./leagueApi/requestLimitHelper");
const requestHelper = rlh.RequestHelper.instance;

// Initialize Discord Bot
var bot = new Discord.Client({
  token: auth.botToken,
  autorun: true
});
bot.on("ready", function(evt) {
  console.log("Connected");
  console.log(bot.username + " - (" + bot.id + ")");
});
bot.on("message", function(user, userID, channelID, message, evt) {
  // Our bot needs to know if it will execute a command
  console.log(`~~Reading a message from ${user}(${userID})`, message);
  let lowercaseMessage = message.toLowerCase();
  if (
    lowercaseMessage.startsWith("lolsito ") ||
    lowercaseMessage.startsWith("@lolsito ") ||
    lowercaseMessage.startsWith("<@646462052885463060> ")
  ) {
    var args = message.split(" ");
    var cmd = args[1].toLowerCase();
    console.log(`ARGS FOR THIS MESSAGE: ${args}`);
    switch (cmd) {
      // !ping
      case "espia":
      case "espía":
        spy.getEnemyRanks(bot, channelID, userID, args.slice(2).join(" "));
        break;
      case "hola":
        greet.greet(bot, channelID, userID);
        break;
      case "registrame":
      case "regístrame":
        account.register(bot, channelID, userID, args.slice(2).join(" "));
        break;
      case "rank":
        leagues.getRank(bot, channelID, userID, args.slice(2).join(" "));
        break;
      case "top100":
        top100.getTop100(bot, channelID, userID, args.slice(2).join(" "));
        break;
      default:
        bot.sendMessage({
          to: channelID,
          message: "ASi no se usa el bot brgas e.e"
        });
      // Just add any case commands if you want to..
    }
  }
});
