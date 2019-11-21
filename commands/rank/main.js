const leagueApi = require("./../../leagueApi/league");
const summonerApi = require("./../../leagueApi/summoner");

const emotes = {
  CHALLENGER: ":flag_kr:",
  GRANDMASTER: ":star2:",
  MASTER: ":star:",
  DIAMOND: ":diamond_shape_with_a_dot_inside:",
  PLATINUM: ":large_blue_diamond:",
  GOLD: ":large_orange_diamond:",
  SILVER: ":fork_and_knife: ",
  BRONZE: ":poop:",
  IRON: ":rainbow_flag:"
};

exports.getRank = async (bot, channelID, userId, name) => {
  let summonerInfo = null;
  if (name && name.length > 3) {
    summonerInfo = await summonerApi.getSummonerInfoByName(name);
  } else {
    const ACCOUNTS = require("./../../maxshi2sData/accounts.json");
    summonerInfo = ACCOUNTS[userId];
  }
  console.log("Looking at a game for summoner:", summonerInfo);
  if (summonerInfo && summonerInfo.id) {
    let summonerLeagues = await leagueApi.getLeaguesBySummonerId(
      summonerInfo.id
    );
    if (summonerLeagues && summonerLeagues.length > 0) {
      let response = buildResponseMessage(summonerInfo, summonerLeagues);
      bot.sendMessage({
        to: channelID,
        message: response
      });
    } else {
      bot.sendMessage({
        to: channelID,
        message: `${summonerInfo.name} es gay y no juega rankeds <3 `
      });
    }
  } else {
    bot.sendMessage({
      to: channelID,
      message: `<@${userId}> no encontre al invocador '${user.name}' u.u `
    });
  }
};

function buildResponseMessage(summonerInfo, leagueArray) {
  let response = `-- ${summonerInfo.name} --\n`;
  Array.from(leagueArray).forEach(league => {
    let emote = emotes[league.tier];
    response += `**${league.queueType.replace(/_/g, " ")}** - ${league.wins +
      league.losses} juegos(${league.wins}/${league.losses}) \n${league.tier} ${
      league.rank
    } ${emote}\n\n `;
  });
  return response;
}
