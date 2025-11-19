const Command = require('../structures/command.js')
const { EmbedBuilder } = require('discord.js')

module.exports = class UserInfo extends Command {
  constructor (client) {
    super(client, { name: 'userinfo', description: 'Información de un usuario' })
  }

  async runSlash (interaction) {
    const user = interaction.options.getUser('usuario') || interaction.user
    const member = interaction.guild.members.cache.get(user.id)

    const embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setTitle(`👤 ${user.tag}`)
      .setThumbnail(user.displayAvatarURL())
      .addFields(
        { name: '🆔 ID', value: user.id },
        { name: '📅 Cuenta Creada', value: `<t:${Math.floor(user.createdTimestamp / 1000)}:R>` },
        { name: '📥 Se Unió', value: member ? `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>` : 'N/A' },
        { name: '🎭 Roles', value: member ? `${member.roles.cache.size}` : 'N/A' }
      )
      .setTimestamp()

    await interaction.reply({ embeds: [embed] })
  }
}
