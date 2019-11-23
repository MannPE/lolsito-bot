const requestHelper = require('./../../leagueApi/requestLimitHelper').RequestHelper.instance;
import { User, TextChannel } from 'discord.js';
import { SummonerInfo, PositionId } from 'pyke';

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
  let summonerInfo: SummonerInfo = null;
  if (summonerName && summonerName.length > 3) {
    try {
      summonerInfo = await requestHelper
        .getLeagueClient()
        .summoner.getBySummonerName(summonerName, 'la1');
    } catch (err) {
      console.log('had an error when getching summonerName', err);
    }
    console.log('register newSummoner');
    // summonerInfo = await summonerApi.getSummonerInfoByName(summonerName);
  } else {
    const ACCOUNTS = require('./../../maxshi2sData/accounts.json');
    summonerInfo = ACCOUNTS[user.id];
  }
  console.log('Looking at a game for summoner:', summonerInfo);
  if (summonerInfo && summonerInfo.id) {
    let summonerLeagues: PositionId = await requestHelper
      .getLeagueClient()
      .league.getAllLeaguePositionsForSummoner(summonerInfo.id, 'la1');

    console.log('Leagues:', summonerLeagues);
    // await leagueApi.getLeaguesBySummonerId(summonerInfo.id);
    const leagueArray: any[] = Object.values(summonerLeagues.all).filter(
      league => league.tier != 'Unranked'
    );

    if (summonerLeagues && leagueArray.length > 0) {
      let response = buildResponseMessage(summonerInfo, leagueArray);
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
