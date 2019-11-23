const CHAMPIONS = require('./../../data_dragon/champions.json'); //(with path)
import { User, TextChannel } from 'discord.js';
const requestHelper = require('./../../leagueApi/requestLimitHelper').RequestHelper.instance;
import { SummonerInfo, PositionId } from 'pyke';
var Discord = require('discord.js');

exports.getEnemyRanks = async (channel: TextChannel, user: User, summonerName: string) => {
  let summonerInfo: SummonerInfo = null;
  if (summonerName && summonerName.length > 3) {
    summonerInfo = await requestHelper
      .getLeagueClient()
      .summoner.getBySummonerName(summonerName, 'la1');
  } else {
    const ACCOUNTS = require('./../../maxshi2sData/accounts.json');
    summonerInfo = ACCOUNTS[user.id];
  }
  console.log('Spying summoner info:', summonerInfo);
  if (summonerInfo && summonerInfo.id) {
    let currentGameInfo = null;
    try {
      currentGameInfo = await requestHelper
        .getLeagueClient()
        .spectator.getCurrentGameInfoBySummoner(summonerInfo.id, 'la1');
      console.log('gameID:', currentGameInfo);
    } catch (e) {
      console.log('error getting game info', e);
    }
    if (currentGameInfo && currentGameInfo.gameId) {
      // let responseMsg = ` *${summonerInfo.name}* - ${currentGameInfo.gameMode}\n`;
      // responseMsg += await createSpyResponseNormalGame(currentGameInfo.participants);
      let responseMsg = await getParticipantsWithRank(summonerInfo, currentGameInfo);
      channel.send(responseMsg);
    } else {
      channel.send(
        `${summonerInfo.name} no me aparece en partida. Esperate a que este en pantalla de carga n.n `
      );
    }
  } else {
    channel.send(`<@${user.id}> no encontre al invocador '${summonerName}' u.u `);
  }
};

type MatchMember = {
  teamId: number;
  championId: string;
  summonerName: string;
};

//TODO remove any from the champions ddragon JSON and look for a type
async function createSpyResponseNormalGame(participants: MatchMember[]) {
  let responseMsg = '';
  let chaos: MatchMember[] = [];
  let order: MatchMember[] = [];
  participants.forEach(summoner => {
    if (summoner.teamId == 100) order.push(summoner);
    else chaos.push(summoner);
  });
  responseMsg += 'Orden\n';

  for (let i = 0; i < order.length; i++) {
    const champ: any = Object.values(CHAMPIONS.data).find((x: any) => x.key == order[i].championId);
    responseMsg += `* ${order[i].summonerName} - ${champ.name} \n`;
  }
  responseMsg += 'Caos\n';

  for (let i = 0; i < chaos.length; i++) {
    const champ: any = Object.values(CHAMPIONS.data).find((x: any) => x.key == chaos[i].championId);
    responseMsg += `* ${chaos[i].summonerName} - ${champ.name}\n`;
  }
  return responseMsg;
}

async function getParticipantsWithRank(summonerInfo: SummonerInfo, currentGameInfo: any) {
  const participants = currentGameInfo.participants;
  let chaos: MatchMember[] = [];
  let order: MatchMember[] = [];
  let participantInfoPromises: Promise<{ name: string; ranks: PositionId }>[] = [];

  participants.forEach((summoner: any) => {
    if (summoner.teamId == 100) order.push(summoner);
    else chaos.push(summoner);
    participantInfoPromises.push(
      new Promise(async (resolve, reject) => {
        try {
          let res = await requestHelper
            .getLeagueClient()
            .league.getAllLeaguePositionsForSummoner(summoner.summonerId, 'la1');
          let obj: any = {};
          obj.name = summoner.summonerName;
          obj.ranks = res;
          resolve(obj);
        } catch (e) {
          reject(e);
        }
      })
    );
  });

  let allRanks: Map<string, PositionId> = new Map();
  await Promise.all(participantInfoPromises).then(
    (results: { name: string; ranks: PositionId }[]) => {
      // console.log('ALL THE INFO FOR THE USERS:', results);
      results.forEach(result => {
        allRanks.set(result.name, result.ranks);
      });
    }
  );
  console.log('\n\n ------ALL RANKS HERE -----\n\n', allRanks);
  let orderMsg = '';

  for (let i = 0; i < order.length; i++) {
    const champ: any = Object.values(CHAMPIONS.data).find((x: any) => x.key == order[i].championId);
    let ranks = allRanks.get(order[i].summonerName);
    console.log('rank for', order[i].summonerName, 'is', ranks.RANKED_SOLO_5x5.tier);
    orderMsg += `* ${order[i].summonerName} - ${champ.name} -${ranks.RANKED_SOLO_5x5.tier ||
      ranks.RANKED_FLEX_SR.tier}\n`;
  }
  let chaosMsg = '';

  for (let i = 0; i < chaos.length; i++) {
    const ranks = allRanks.get(chaos[i].summonerName);
    const champ: any = Object.values(CHAMPIONS.data).find((x: any) => x.key == chaos[i].championId);
    chaosMsg += `* ${chaos[i].summonerName} - ${champ.name}-${ranks.RANKED_SOLO_5x5.tier ||
      ranks.RANKED_FLEX_SR.tier}\n`;
  }
  let responseEmbed = new Discord.RichEmbed()
    .setTitle(`${summonerInfo.name} - *${currentGameInfo.gameMode}*\n`)
    .addField('Orden', orderMsg, true)
    .addField('Caos', chaosMsg, true)
    .setTimestamp();

  return responseEmbed;
}
