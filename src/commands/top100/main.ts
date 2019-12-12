const commandName = 'top100';
const CHAMPIONS = require('./../../data_dragon/champions.json');
let ACCOUNTS = require('./../../maxshi2sData/accounts.json');
const requestHelper = require('./../../leagueApi/requestLimitHelper').RequestHelper.instance;
import { SummonerInfo } from 'pyke';

import { User, TextChannel } from 'discord.js';

exports.getTop100 = async (channel: TextChannel, user: User, summonerName: string) => {
  let summonerInfo: SummonerInfo = null;
  try {
    console.log('got summoner:', summonerInfo);
    if (summonerName && summonerName.length > 3) {
      summonerInfo = await requestHelper
        .getLeagueClient()
        .summoner.getBySummonerName(summonerName, 'la1');
    } else {
      summonerInfo = ACCOUNTS[user.id];
    }
    console.log('summoner:', summonerInfo);
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
      channel.send(
        `No pude encontrar partidas de ${summonerInfo ? summonerInfo.name : summonerName} :'c`
      );
      console.log('Error', e);
    } else {
      channel.send(`Diganle al Mani que esta madre esta caida - ${commandName}`);
    }
  }
};

export async function getRecentMostPlayedchamps(accountId: String) {
  return new Promise(async (resolve, reject) => {
    try {
      console.log('getting matchlist for ', accountId);
      let matchList: any = await requestHelper
        .getLeagueClient()
        .match.getMatchlist(accountId, 'la1');
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
      console.log('error ', err);
      reject({ type: 'API ERROR' });
    }
  });
}
