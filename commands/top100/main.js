const commandName = "top100";
const CHAMPIONS = require("./../../data_dragon/champions.json");
const matchApi = require("./../../leagueApi/match");
const summonerApi = require("./../../leagueApi/summoner");
let ACCOUNTS = require("./../../maxshi2sData/accounts.json");

exports.getTop100 = async (bot, channelID, userId, name) => {
  try {
    let champions = await getRecentMostPlayedchamps(name, userId);
    let newString = "";
    for (let i = 0; i < 10; i++) {
      const champion = champions[i];
      if (!champion) break;
      newString += `\n${champion[0]} - ${champion[1]}`;
    }
    bot.sendMessage({
      to: channelID,
      message: `Los personajes mas jugados de ${name} en las últimas 100 partidas:${newString}`
    });
  } catch (e) {
    if (e.type) {
      bot.sendMessage({
        to: channelID,
        message: `No pude encontrar a ${name} :'c`
      });
    } else {
      bot.sendMessage({
        to: channelID,
        message: `Diganle al Mani que esta madre esta caida - ${commandName}`
      });
    }
  }
};

async function getRecentMostPlayedchamps(summonerName, userId) {
  return new Promise(async function(resolve, reject) {
    try {
      let summonerInfo = null;
      if (summonerName && summonerName.length > 3) {
        summonerInfo = await summonerApi.getSummonerInfoByName(summonerName);
      } else {
        summonerInfo = ACCOUNTS[userId];
      }
      let matchList = await matchApi.getMatchList(summonerInfo.accountId);
      let charMap = new Map();

      Array.from(matchList.matches).forEach(match => {
        if (!charMap.get(match.champion)) {
          charMap.set(match.champion, 1);
        } else {
          charMap.set(match.champion, charMap.get(match.champion) + 1);
        }
      });

      let mostPlayedChamps = Array.from(charMap.entries())
        .sort((x, y) => {
          return y[1] - x[1];
        })
        .map(entry => {
          let champ = Object.values(CHAMPIONS.data).find(
            x => x.key == entry[0]
          );
          return [!!champ ? champ.name : entry[0], entry[1]];
        });
      resolve(mostPlayedChamps);
    } catch (err) {
      reject({ type: "API ERROR" });
    }
  });
}
