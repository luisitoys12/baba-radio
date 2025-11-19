const Command = require('../structures/command.js')
const { EmbedBuilder } = require('discord.js')

module.exports = class Poll extends Command {
  constructor (client) {
    super(client, { name: 'poll', description: 'Crea una encuesta' })
  }

  async runSlash (interaction) {
    const question = interaction.options.getString('pregunta')
    const embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setTitle('📊 Encuesta')
      .setDescription(question)
      .setFooter({ text: `Creado por ${interaction.user.tag}` })
      .setTimestamp()

    const msg = await interaction.reply({ embeds: [embed], fetchReply: true })
    await msg.react('👍')
    await msg.react('👎')
  }
}
