const Command = require('../structures/command.js')
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')

module.exports = class Invite extends Command {
  constructor (client) {
    super(client, { name: 'invite', description: 'Invita el bot a tu servidor' })
  }

  async runSlash (interaction) {
    const embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setTitle('📨 Invitar Baba Radio')
      .setDescription('¡Gracias por tu interés en Baba Radio!')
      .addFields(
        { name: '🎵 Música', value: 'YouTube, Spotify, Radio y más' },
        { name: '🛡️ Moderación', value: 'Sistema completo de moderación' },
        { name: '🎮 Juegos', value: 'Diversión para tu servidor' }
      )

    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setLabel('Invitar Bot')
          .setStyle(ButtonStyle.Link)
          .setURL(`https://discord.com/api/oauth2/authorize?client_id=${this.client.user.id}&permissions=8&scope=bot%20applications.commands`)
      )

    await interaction.reply({ embeds: [embed], components: [row] })
  }
}
