exports.greet = async (bot, channelId, userId) => {
  const possibleGreetings = [
    `Qué quieres? <@${userId}>`,
    `Hola, te amo <3 <@${userId}>`,
    `Capitán lolsito de servicio`,
    `Deja de spamear por favor <@${userId}>`
  ];

  let message =
    possibleGreetings[Math.floor(Math.random() * possibleGreetings.length)];

  bot.sendMessage({
    to: channelId,
    message: message
  });
};
