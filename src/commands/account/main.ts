const commandName = 'top100';
import { User, TextChannel } from 'discord.js';
let ACCOUNTS = require('./../../maxshi2sData/accounts.json');
const summonerApi = require('./../../leagueApi/summoner');
const fs = require('fs');

exports.register = async (channel: TextChannel, user: User, accountName: string) => {
  try {
    let summoner = ACCOUNTS[user.id];
    if (summoner) channel.send(`<@${user.id}> ya estás registrado con la cuenta: ${summoner.name}`);
    else {
      if (accountName && accountName.length > 3) {
        try {
          let newSummoner = await summonerApi.getSummonerInfoByName(accountName);
          if (newSummoner) {
            ACCOUNTS[user.id] = newSummoner;
            channel.send(`<@${user.id}> ahora estás asociad@ a la cuenta: ${newSummoner.name}`);
            fs.writeFile(
              __dirname + '/../../maxshi2sData/accounts.json',
              JSON.stringify(ACCOUNTS),
              () => {
                ACCOUNTS = require('./../../maxshi2sData/accounts.json'); //(with path)
              }
            );
          } else {
            channel.send(`<@${user.id}> No encontré ningún usuario con ese nombre en LAN :'(`);
          }
        } catch (err) {
          console.log('ERROR - Had an error when registering an account: ', err);
          channel.send(`<@${user.id}> No se que pedo pero ahorita no puedo hacer eso :/`);
        }
      } else {
        channel.send(`<@${user.id}> El comando es 'lolsito registrame <NOMBRE DE USUARIO>'`);
      }
    }
  } catch (e) {
    if (e.type) {
      channel.send(`No pude encontrar a ${accountName} :'c`);
    } else {
      channel.send(`Diganle al Zira que esta madre esta caida - ${commandName}`);
    }
  }
};
