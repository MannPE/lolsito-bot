const commandName = "top100";

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
        message: `Diganle al Zira que esta madre esta caida - ${commandName}`
      });
    }
  }
};
const https = require("https");
const RIOT_TOKEN = "RGAPI-9b2aad45-0d2a-4452-9edf-b027b52132d9";
const CHAMPIONS = require("./../../data_dragon/champions.json"); //(with path)

async function getRecentMostPlayedchamps(summonerName) {
  return new Promise(async function(resolve, reject) {
    try {
      console.log("the summoner id is:", summonerName);
      let summonerInfo = await getSummonerInfoByName(summonerName);
      console.log(summonerInfo);
      let matchList = await getMatchList(summonerInfo.accountId);
      //console.log(matchList);
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

async function getSummonerInfoByName(name) {
  let options = {
    hostname: "la1.api.riotgames.com",
    path: `/lol/summoner/v4/summoners/by-name/${escape(name)}`,
    method: "GET",
    headers: {
      "X-Riot-Token": RIOT_TOKEN
    }
  };
  return new Promise(function(resolve, reject) {
    https
      .get(options, resp => {
        let data = "";

        // A chunk of data has been recieved.
        resp.on("data", chunk => {
          data += chunk;
        });

        // The whole response has been received. Print out the result.
        resp.on("end", () => {
          let newData = JSON.parse(data);
          resolve(newData);
        });
      })
      .on("error", err => {
        reject();
        console.log("Error: " + err.message);
      });
  });
}

async function getMatchList(accountId) {
  let options = {
    hostname: "la1.api.riotgames.com",
    path: `/lol/match/v4/matchlists/by-account/${escape(accountId)}`,
    method: "GET",
    headers: {
      "X-Riot-Token": RIOT_TOKEN
    }
  };
  console.log("REQUEST WITH:", options);
  return new Promise(function(resolve, reject) {
    https
      .get(options, resp => {
        let data = "";

        // A chunk of data has been recieved.
        resp.on("data", chunk => {
          data += chunk;
        });

        // The whole response has been received. Print out the result.
        resp.on("end", () => {
          let newData = JSON.parse(data);
          resolve(newData);
        });
      })
      .on("error", err => {
        reject();
        console.log("Error: " + err.message);
      });
  });
}
