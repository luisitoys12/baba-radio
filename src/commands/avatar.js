const Command = require('../structures/command.js')
const { EmbedBuilder } = require('discord.js')

module.exports = class Avatar extends Command {
  constructor (client) {
    super(client, { name: 'avatar', description: 'Muestra el avatar de un usuario' })
  }

  async runSlash (interaction) {
    const user = interaction.options.getUser('usuario') || interaction.user
    const embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setTitle(`Avatar de ${user.tag}`)
      .setImage(user.displayAvatarURL({ size: 1024 }))
      .setTimestamp()

    await interaction.reply({ embeds: [embed] })
  }
}
