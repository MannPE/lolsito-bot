const CHAMPIONS = require("./../../data_dragon/champions.json"); //(with path)
const matchApi = require("./../../leagueApi/match");
const summonerApi = require("./../../leagueApi/summoner");
const Discord = require("discord.js");

exports.getEnemyRanks = async (bot, channelID, userID, name) => {
  let summonerInfo = null;
  if (name && name.length > 3) {
    summonerInfo = await summonerApi.getSummonerInfoByName(name);
  } else {
    const ACCOUNTS = require("./../../maxshi2sData/accounts.json");
    summonerInfo = ACCOUNTS[userID];
  }
  if (summonerInfo && summonerInfo.id) {
    let currentGameInfo = await matchApi.getCurrentGameInfo(summonerInfo.id);
    // console.log("currentGameInfo:", currentGameInfo);
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

async function getParticipantsWithRank(summonerInfo, currentGameInfo) {
  const participants = currentGameInfo.participants;
  let chaos = [];
  let order = [];
  let participantInfoPromises = [];

  participants.forEach(summoner => {
    if (summoner.teamId == 100) order.push(summoner);
    else chaos.push(summoner);
    participantInfoPromises.push(new Promise());
  });

  Promise.all().then(results => {});
  let orderMsg = "";

  for (let i = 0; i < order.length; i++) {
    const champ = Object.values(CHAMPIONS.data).find(
      x => x.key == order[i].championId
    );
    orderMsg += `* ${order[i].summonerName} - ${champ.name} \n`;
  }
  let chaosMsg = "";

  for (let i = 0; i < chaos.length; i++) {
    const champ = Object.values(CHAMPIONS.data).find(
      x => x.key == chaos[i].championId
    );
    chaosMsg += `* ${chaos[i].summonerName} - ${champ.name}\n`;
  }
  let responseEmbed = new Discord.RichEmbed()
    .setTitle(`${summonerInfo.name} - *${currentGameInfo.gameMode}*\n`)
    .addField("Orden", orderMsg)
    .addField("Caos", chaosMsg)
    .setTimestamp();

  return responseEmbed;
}
