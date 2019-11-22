import { User, TextChannel } from 'discord.js';

exports.greet = async (channel: TextChannel, user: User) => {
  const possibleGreetings = [
    `Qué quieres? <@${user.id}>`,
    `Hola, te amo <3 <@${user.id}>`,
    `Capitán lolsito de servicio`,
    `Deja de spamear por favor <@${user.id}>`,
    `Recuerda decirle a tus padres que los quieres <3`
  ];

  let message = possibleGreetings[Math.floor(Math.random() * possibleGreetings.length)];

  channel.send(message);
};
