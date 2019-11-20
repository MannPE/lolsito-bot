const commandName = "top100";
const CHAMPIONS = require("./../../data_dragon/champions.json");
const matchApi = require("./../../leagueApi/match");
const summonerApi = require("./../../leagueApi/summoner");
let ACCOUNTS = require("./../../maxshi2sData/accounts.json");

exports.getTop100 = async (bot, channelID, name) => {
  try {
    let champions = await getRecentMostPlayedchamps(name);
    let newString = "";
    for (let i = 0; i < 10; i++) {
      const champion = champions[i];
      console.log("analizando:", champion);
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

async function getRecentMostPlayedchamps(summonerName) {
  return new Promise(async function(resolve, reject) {
    try {
      console.log("the summoner id is:", summonerName);
      let summonerInfo = null;
      if (!summonerName || summonerName.length < 4) {
        summonerInfo = await summonerApi.getSummonerInfoByName(summonerName);
      } else {
        summonerInfo = await summonerApi.getSummonerInfoByName(summonerName);
      }
      console.log(summonerInfo);
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
          // console.log(Object.values(CHAMPIONS.data)[0]);
          let champ = Object.values(CHAMPIONS.data).find(
            x => x.key == entry[0]
          );
          return [!!champ ? champ.name : entry[0], entry[1]];
        });
      console.log(
        "Los PJ mas jugados de:",
        summonerInfo.name,
        "\n",
        mostPlayedChamps
      );
      resolve(mostPlayedChamps);
    } catch (err) {
      reject({ type: "API ERROR" });
    }
  });
}
