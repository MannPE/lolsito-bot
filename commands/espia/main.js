const commandName = "top100";
const CHAMPIONS = require("./../../data_dragon/champions.json"); //(with path)
const matchApi = require("./../../leagueApi/match");
const summonerApi = require("./../../leagueApi/summoner");

exports.getEnemyRanks = async (bot, channelID, userID, name) => {
  let summonerInfo = null;
  if (name && name.length > 3) {
    summonerInfo = summonerApi.getSummonerInfoByName(name);
  } else {
    const ACCOUNTS = require("./../../maxshi2sData/accounts.json");
    summonerInfo = ACCOUNTS[userID];
  }
  if (summonerInfo && summonerInfo.id) {
    let getCurrentGameInfo = matchApi.getCurrentGameInfo();
    if (getCurrentGameInfo && getCurrentGameInfo.gameId) {
    } else {
      bot.sendMessage({
        to: channelID,
        message: `${summonerInfo.name} no me aparece en partida. Esperate a que este en pantalla de carga n.n `
      });
    }
  } else {
    bot.sendMessage({
      to: channelID,
      message: `<@${userId}> no encontre al invocador '${user.name}' u.u `
    });
  }
};
