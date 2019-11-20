const commandName = "top100";
let ACCOUNTS = require("./../../maxshi2sData/accounts.json"); //(with path)
const summonerApi = require("./../../leagueApi/summoner");
const fs = require("fs");

exports.register = async (bot, channelID, userId, accountName) => {
  try {
    let user = ACCOUNTS[userId];
    if (user)
      bot.sendMessage({
        to: channelID,
        message: `<@${userId}> ya estás registrado con la cuenta: ${user.name}`
      });
    else {
      if (accountName && accountName.length > 3) {
        try {
          let newUser = await summonerApi.getSummonerInfoByName(accountName);
          if (newUser) {
            ACCOUNTS[userId] = newUser;
            bot.sendMessage({
              to: channelID,
              message: `<@${userId}> ahora estás asociad@ a la cuenta: ${newUser.name}`
            });
            fs.writeFile(
              __dirname + "/../../maxshi2sData/accounts.json",
              JSON.stringify(ACCOUNTS),
              cb => {
                console.log("Finished updating file:", cb);
                ACCOUNTS = require("./../../maxshi2sData/accounts.json"); //(with path)
              }
            );
          } else {
            bot.sendMessage({
              to: channelID,
              message: `<@${userId}> No encontré ningún usuario con ese nombre en LAN :'(`
            });
          }
        } catch (err) {
          console.log(
            "ERROR - Had an error when registering an account: ",
            err
          );
          bot.sendMessage({
            to: channelID,
            message: `<@${userId}> No se que pedo pero ahorita no puedo hacer eso :/`
          });
        }
      } else {
        bot.sendMessage({
          to: channelID,
          message: `<@${userId}> El comando es 'lolsito registrame <NOMBRE DE USUARIO>'`
        });
      }
    }
  } catch (e) {
    if (e.type) {
      bot.sendMessage({
        to: channelID,
        message: `No pude encontrar a ${name} :'c`
      });
    } else {
      bot.sendMessage({
        to: channelID,
        message: `Diganle al Zira que esta madre esta caida - ${commandName}`
      });
    }
  }
};
