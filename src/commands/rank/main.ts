const leagueApi = require('./../../leagueApi/league');
const summonerApi = require('./../../leagueApi/summoner');
import { User, TextChannel } from 'discord.js';

const emotes = {
  CHALLENGER: ':flag_kr:',
  GRANDMASTER: ':star2:',
  MASTER: ':star:',
  DIAMOND: ':diamond_shape_with_a_dot_inside:',
  PLATINUM: ':large_blue_diamond:',
  GOLD: ':large_orange_diamond:',
  SILVER: ':fork_and_knife: ',
  BRONZE: ':poop:',
  IRON: ':rainbow_flag:'
};

exports.getRank = async (channel: TextChannel, user: User, summonerName: string) => {
  let summonerInfo = null;
  if (summonerName && summonerName.length > 3) {
    summonerInfo = await summonerApi.getSummonerInfoByName(summonerName);
  } else {
    const ACCOUNTS = require('./../../maxshi2sData/accounts.json');
    summonerInfo = ACCOUNTS[user.id];
  }
  console.log('Looking at a game for summoner:', summonerInfo);
  if (summonerInfo && summonerInfo.id) {
    let summonerLeagues = await leagueApi.getLeaguesBySummonerId(summonerInfo.id);
    if (summonerLeagues && summonerLeagues.length > 0) {
      let response = buildResponseMessage(summonerInfo, summonerLeagues);
      channel.send(response);
    } else {
      channel.send(`${summonerInfo.name} es gay y no juega rankeds <3 `);
    }
  } else {
    channel.send(`<@${user.id}> no encontre al invocador '${summonerName}' u.u `);
  }
};

function buildResponseMessage(
  summonerInfo: any,
  leagueArray: {
    tier:
      | 'IRON'
      | 'BRONZE'
      | 'SILVER'
      | 'GOLD'
      | 'PLATINUM'
      | 'DIAMOND'
      | 'MASTER'
      | 'GRANDMASTER'
      | 'CHALLENGER';
    queueType: string;
    wins: number;
    losses: number;
    rank: number;
  }[]
) {
  let response = `-- ${summonerInfo.name} --\n`;
  Array.from(leagueArray).forEach(league => {
    let emote = emotes[league.tier];
    response += `**${league.queueType.replace(/_/g, ' ')}** - ${league.wins +
      league.losses} juegos(${league.wins}/${league.losses}) \n${league.tier} ${
      league.rank
    } ${emote}\n\n `;
  });
  return response;
}
