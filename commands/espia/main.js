const commandName = "top100";
const CHAMPIONS = require("./../../data_dragon/champions.json"); //(with path)
const matchApi = require("./../../leagueApi/match");
const summonerApi = require("./../../leagueApi/summoner");

exports.getEnemyRanks = async (bot, channelID, userID, name) => {
  let summonerInfo = null;
  if (name && name.length > 3) {
    summonerInfo = await summonerApi.getSummonerInfoByName(name);
  } else {
    const ACCOUNTS = require("./../../maxshi2sData/accounts.json");
    summonerInfo = ACCOUNTS[userID];
  }
  console.log("Looking at a game for summoner:", summonerInfo);
  if (summonerInfo && summonerInfo.id) {
    let currentGameInfo = await matchApi.getCurrentGameInfo(summonerInfo.id);
    console.log("currentGameInfo:", currentGameInfo);
    if (currentGameInfo && currentGameInfo.gameId) {
      let responseMsg = ` *${summonerInfo.name}* - ${currentGameInfo.gameMode}\n`;
      responseMsg += await createSpyResponseNormalGame(
        currentGameInfo.participants
      );
      bot.sendMessage({
        to: channelID,
        message: responseMsg
      });
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

async function createSpyResponseNormalGame(participants) {
  let responseMsg = "";
  let chaos = [];
  let order = [];
  participants.forEach(summoner => {
    if (summoner.teamId == 100) order.push(summoner);
    else chaos.push(summoner);
  });
  responseMsg += "Orden\n";

  for (let i = 0; i < order.length; i++) {
    const champ = Object.values(CHAMPIONS.data).find(
      x => x.key == order[i].championId
    );
    responseMsg += `* ${order[i].summonerName} - ${champ.name} \n`;
  }
  responseMsg += "Caos\n";

  for (let i = 0; i < chaos.length; i++) {
    const champ = Object.values(CHAMPIONS.data).find(
      x => x.key == chaos[i].championId
    );
    responseMsg += `* ${chaos[i].summonerName} - ${champ.name}\n`;
  }
  return responseMsg;
}
