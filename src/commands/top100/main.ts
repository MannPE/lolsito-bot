const commandName = 'top100';
const CHAMPIONS = require('./../../data_dragon/champions.json');
const matchApi = require('./../../leagueApi/match');
const summonerApi = require('./../../leagueApi/summoner');
let ACCOUNTS = require('./../../maxshi2sData/accounts.json');
import { User, TextChannel } from 'discord.js';

exports.getTop100 = async (channel: TextChannel, user: User, summonerName: string) => {
  try {
    let summonerInfo = null;
    if (summonerName && summonerName.length > 3) {
      summonerInfo = await summonerApi.getSummonerInfoByName(summonerName);
    } else {
      summonerInfo = ACCOUNTS[user.id];
    }
    let champions: any = await getRecentMostPlayedchamps(summonerInfo.accountId);
    let newString = '';
    for (let i = 0; i < 10; i++) {
      const champion = champions[i];
      if (!champion) break;
      newString += `\n${champion[0]} - ${champion[1]}`;
    }
    channel.send(
      `Los personajes mas jugados de **${summonerInfo.name}** en las últimas 100 partidas:${newString}`
    );
  } catch (e) {
    if (e.type) {
      channel.send(`No pude encontrar a ${summonerName} :'c`);
    } else {
      channel.send(`Diganle al Mani que esta madre esta caida - ${commandName}`);
    }
  }
};

async function getRecentMostPlayedchamps(accountId: string) {
  return new Promise(async function(resolve, reject) {
    try {
      let matchList = await matchApi.getMatchList(accountId);
      let charMap = new Map();

      Array.from(matchList.matches).forEach((match: any) => {
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
          let champ: any = Object.values(CHAMPIONS.data).find((x: any) => x.key == entry[0]);
          return [!!champ ? champ.name : entry[0], entry[1]];
        });
      resolve(mostPlayedChamps);
    } catch (err) {
      reject({ type: 'API ERROR' });
    }
  });
}
