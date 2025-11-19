const Command = require('../structures/command.js')
const { PermissionFlagsBits } = require('discord.js')

module.exports = class Slowmode extends Command {
  constructor (client) {
    super(client, { name: 'slowmode', description: 'Establece modo lento en el canal' })
  }

  async runSlash (interaction) {
    if (!interaction.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
      return interaction.reply({ content: '❌ No tienes permisos.', ephemeral: true })
    }

    const seconds = interaction.options.getInteger('segundos')
    await interaction.channel.setRateLimitPerUser(seconds)
    await interaction.reply({ content: `✅ Modo lento establecido a ${seconds} segundos.` })
  }
}
