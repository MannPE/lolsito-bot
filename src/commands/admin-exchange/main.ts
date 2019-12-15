import { User, Client } from 'discord.js';
import { getRecentMostPlayedchamps } from '../top100/main';
const requestHelper = require('./../../leagueApi/requestLimitHelper').RequestHelper.instance;
const CHAMPIONS = require('./../../data_dragon/champions.json').data;

const fs = require('fs');

exports.viewData = async (user: User) => {
  const accounts: {
    name: string;
    id: string;
  }[] = Object.values(require('./../../maxshi2sData/accounts.json')).map((x: any) => {
    return {
      name: x.name,
      id: x.id
    };
  });

  let finalMsg = '';
  accounts.forEach(acc => {
    finalMsg += `${acc.name}\n`;
  });

  user.send(finalMsg);
};

exports.wishlist = async (user: User, unfilteredText: string) => {
  let exchangeMembers = require('./../../maxshi2sData/exchange.json');
  let exchangeUser = exchangeMembers[user.id];
  if (!exchangeUser) return;
  exchangeUser.additionalInfo = unfilteredText;
  console.log('new userinfo:', exchangeUser);
  exchangeMembers[user.id] = exchangeUser;
  try {
    fs.writeFile(
      __dirname + '/../../maxshi2sData/exchange.json',
      JSON.stringify(exchangeMembers),
      () => {
        user.send(
          `Quien sea que te vaya a dar regalo podrá ver tu mensaje cuando use el comando de "intercambio detalles"`
        );
      }
    );
  } catch (e) {
    user.send('No pude guardar tu mensaje :/');
  }
};

exports.assignExchangePartners = async (user: User) => {
  const exchangeMembers = require('./../../maxshi2sData/exchange.json');
  let discordIds = Object.keys(exchangeMembers);

  let validAssignationDone = false;
  while (!validAssignationDone) {
    console.log('-- ASSIGNATION ATTEMPT');
    let receivers = [...discordIds];
    let valid = true;
    for (let i = 0; i < discordIds.length; i++) {
      const did = discordIds[i];
      let account = exchangeMembers[did];
      //see if there are valid receivers
      let validreceivers = [...receivers];
      let accIndex = validreceivers.indexOf(did);
      if (accIndex > -1) validreceivers.splice(accIndex, 1);
      account.bans.forEach((ban: string) => {
        let bannedIndex = validreceivers.indexOf(ban);
        if (bannedIndex > -1) validreceivers.splice(bannedIndex, 1);
      });

      if (validreceivers.length == 0) {
        valid = false;
        break;
      } // no valid receivers so try again
      let receiver = validreceivers[Math.floor(Math.random() * validreceivers.length)];
      exchangeMembers[did].partner = receiver;
      console.log(`**assigned ${receiver} to ${did}`);
      receivers.splice(receivers.indexOf(receiver), 1);
    }
    if (valid) validAssignationDone = true;
  }
  try {
    fs.writeFile(
      __dirname + '/../../maxshi2sData/exchange.json',
      JSON.stringify(exchangeMembers),
      () => {
        let finalMatches = '';
        Object.keys(exchangeMembers).forEach(mem => {
          finalMatches += `${mem} -> ${exchangeMembers[mem].partner}\n`;
        });
        user.send(`Se han reasignado los jugadores la lista es:\n ${finalMatches} `);
      }
    );
  } catch (e) {
    user.send('LAMENTO INFORMAR QUE NO PUDE ASIGNAR EL INTERCAMBIO :C');
  }
};

exports.messageExchangeUsers = async (bot: Client, message: string) => {
  const exchangeMembers = require('./../../maxshi2sData/exchange.json');
  Object.keys(exchangeMembers).forEach(mem => {
    console.log('trying to send message to:', mem);
    bot.users.get(mem).send(message);
  });
};

exports.details = async (user: User) => {
  const accounts = require('./../../maxshi2sData/exchange.json');
  const riotAccs = Object.values(accounts);
  let accNames = '';
  riotAccs.forEach((acc: any) => {
    accNames += `${acc.name}\n`;
  });

  user.send(
    `\nAntes de comenzar recuerda agregar a tu lista de amigos a todos los involucrados en el intercambio(para que no haya sospechas):\n${accNames}
		\n* Recuerda que el precio mínimo y esperado es de 1350RP. Si andas generoso $$ puedes dar algo mas caro.
		\n Fecha tentativa del intercambio es el 22 de diciembre. Si no vas a poder asistir puedes mandar el regalo de antemano. Solo avisa poquito antes`
  );
};

exports.getExchangeInfo = async (user: User) => {
  const accounts = require('./../../maxshi2sData/exchange.json');
  const userAcc = accounts[user.id];

  if (userAcc) {
    const partner = accounts[userAcc.partner];
    const recentChamps: any[][] = await getRecentMostPlayedchamps(partner.accountId);
    console.log('recentChamps = ', recentChamps);
    const masteries = Object.values(
      await requestHelper.getLeagueClient().masteries.getAllChampionMasteries(partner.id, 'la1')
    )
      .sort((a: any, b: any) => {
        return b.championPoints - a.championPoints;
      })
      .slice(0, 10)
      .map((champInfo: any) => {
        let champData: any = Object.values(CHAMPIONS).find(
          (x: any) => x.key == champInfo.championId
        );
        return {
          mastery: champInfo.championPoints,
          name: champData.name || ''
        };
      });
    console.log('masteredChamps:', masteries);
    let recentChampString = '';
    let masteredChampString = '';
    const infoText = accounts[userAcc.partner].additionalInfo;
    let footNote = infoText ? `*Comentario: ${infoText}` : '';
    recentChamps.slice(0, 3).forEach(ch => (recentChampString += `* *${ch[0]}*\n`));
    masteries
      .slice(0, 6)
      .forEach(ch => (masteredChampString += `* *${ch.name}* - ${ch.mastery} puntos\n`));
    user.send(`Parece que la persona que ganó la lotería es:\n **${accounts[userAcc.partner].name}**
			\n Sus campeones mas usados recientemente son:\n${recentChampString}\nSus mejores maestrías:\n${masteredChampString}\n${footNote}`);
  } else user.send('Lo lamento, aun no asigno a quien le daras skin para el intercambio U.U');
};
