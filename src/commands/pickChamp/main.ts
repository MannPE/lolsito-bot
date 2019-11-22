import { TextChannel } from 'discord.js';
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
    let message = possibleChampions[Math.floor(Math.random() * possibleChampions.length)];
    channel.send(message);
  } else {
    channel.send(`No se que posición es esa :/ Usa un nombre mas normal`);
  }
};
