exports.greet = async (bot, channelId, userId) => {
  const possibleGreetings = [
    `Qué quieres? <@${userId}>`,
    `Hola, te amo <3 <@${userId}>`,
    `Capitan lolsito de servicio`,
    `Deja de spamear por favor <@${userId}>`
  ];

  let message =
    possibleGreetings[Math.round(Math.random(0, possibleGreetings.length - 1))];

  bot.sendMessage({
    to: channelId,
    message: message
  });
};
