import { TextChannel, RichEmbed } from 'discord.js';
import { getImportantInfo } from '../../lol-sources/ugg/ugg';
var Discord = require('discord.js');

const CHAMPIONS = require('./../../data_dragon/roles.json');
const JUNGLE = 'jungle';
const MID = 'mid';
const TOP = 'top';
const SUP = 'sup';
const ADC = 'adc';
const validPositions = {
  top: TOP,
  superior: TOP,
  arriba: TOP,
  mid: MID,
  central: MID,
  centro: MID,
  jg: JUNGLE,
  jungla: JUNGLE,
  jungle: JUNGLE,
  bosque: JUNGLE,
  sup: SUP,
  support: SUP,
  supor: SUP,
  cocina: SUP,
  suport: SUP,
  niñera: SUP,
  adc: ADC,
  tirador: ADC,
  marksman: ADC,
  carry: ADC,
  adcarry: ADC
};

exports.random = async (channel: TextChannel, position: string) => {
  let normalizedRequestedPosition: string = (validPositions as any)[position];
  let possibleChampions: string[] = CHAMPIONS[normalizedRequestedPosition];
  if (normalizedRequestedPosition) {
    let champName = possibleChampions[Math.floor(Math.random() * possibleChampions.length)];
    let message = await createMessage(champName);
    channel.send(message);
  } else {
    channel.send(`No se que posición es esa :/ Usa un nombre mas normal`);
  }
};

async function createMessage(championName: string) {
  console.log('Looking for', championName);
  let buildInfo: any = await getImportantInfo(championName);
  console.log('build Info:', buildInfo);

  let responseEmbed: RichEmbed = new Discord.RichEmbed()
    .setTitle(`*${championName}*\n`)
    .setImage(`${buildInfo.avatar.src}`)
    .addField(`Runes: `);

  // buildInfo.perks.forEach((element: any) => {
  //   console.log();
  // });
  responseEmbed.setTimestamp();

  console.log('Sending message:', responseEmbed);
  return responseEmbed;
}
