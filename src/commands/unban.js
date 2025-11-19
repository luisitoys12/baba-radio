const Command = require('../structures/command.js')
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js')

module.exports = class Unban extends Command {
  constructor (client) {
    super(client, { name: 'unban', description: 'Desbanea a un usuario' })
  }

  async runSlash (interaction) {
    if (!interaction.member.permissions.has(PermissionFlagsBits.BanMembers)) {
      return interaction.reply({ content: '❌ No tienes permisos.', ephemeral: true })
    }

    const userId = interaction.options.getString('usuario')
    try {
      await interaction.guild.members.unban(userId)
      await interaction.reply({ content: `✅ Usuario <@${userId}> desbaneado.` })
    } catch (error) {
      await interaction.reply({ content: '❌ Error al desbanear.', ephemeral: true })
    }
  }
}
