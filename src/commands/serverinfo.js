const Command = require('../structures/command.js')
const { EmbedBuilder } = require('discord.js')

module.exports = class ServerInfo extends Command {
  constructor (client) {
    super(client, { name: 'serverinfo', description: 'Información del servidor' })
  }

  async runSlash (interaction) {
    const guild = interaction.guild
    const embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setTitle(`📊 ${guild.name}`)
      .setThumbnail(guild.iconURL())
      .addFields(
        { name: '👑 Dueño', value: `<@${guild.ownerId}>`, inline: true },
        { name: '👥 Miembros', value: `${guild.memberCount}`, inline: true },
        { name: '📅 Creado', value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:R>`, inline: true },
        { name: '🎭 Roles', value: `${guild.roles.cache.size}`, inline: true },
        { name: '💬 Canales', value: `${guild.channels.cache.size}`, inline: true },
        { name: '😀 Emojis', value: `${guild.emojis.cache.size}`, inline: true }
      )
      .setTimestamp()

    await interaction.reply({ embeds: [embed] })
  }
}
