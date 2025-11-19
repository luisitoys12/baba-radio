const Command = require('../structures/command.js')
const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, SlashCommandBuilder } = require('discord.js')
const { getAllCategories, getCategoryEmbed } = require('../utils/commandCategories.js')

module.exports = class Help extends Command {
  constructor(client) {
    super(client, {
      name: 'help',
      description: 'Muestra todos los comandos disponibles organizados por categoría',
      category: 'utility',
      slash: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Muestra todos los comandos disponibles organizados por categoría')
        .addStringOption(option =>
          option
            .setName('categoria')
            .setDescription('Selecciona una categoría específica')
            .setRequired(false)
            .addChoices(
              { name: '🎵 Música', value: 'MUSIC' },
              { name: '📻 Radio', value: 'RADIO' },
              { name: '🛡️ Moderación', value: 'MODERATION' },
              { name: '🎮 Diversión', value: 'FUN' },
              { name: '🔧 Utilidad', value: 'UTILITY' },
              { name: '⚙️ Administración', value: 'ADMIN' },
              { name: '👨‍💻 Desarrollador', value: 'DEVELOPER' }
            )
        )
    })
  }

  async runSlash(interaction) {
    const categoryKey = interaction.options.getString('categoria')

    // If specific category requested
    if (categoryKey) {
      const embed = getCategoryEmbed(categoryKey, this.client)
      if (embed) {
        return interaction.reply({ embeds: [embed] })
      }
      return interaction.reply({ content: '❌ Categoría no encontrada.', ephemeral: true })
    }

    // Show all categories
    const categories = getAllCategories()
    
    const embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setTitle('📚 BABA RADIO - Centro de Ayuda')
      .setDescription('**🎵 Bot de Música y Radio con 200,000+ Estaciones**\n\nSelecciona una categoría del menú abajo para ver los comandos disponibles.')
      .addFields(
        {
          name: '🎵 Música',
          value: '`/play` `/music` `/queue` `/skip` `/stop` `/lyrics`\nReproducción de música ilimitada',
          inline: true
        },
        {
          name: '📻 Radio',
          value: '`/radio` `/radioinfo`\n**200,000+ estaciones** de todo el mundo',
          inline: true
        },
        {
          name: '🎮 Diversión',
          value: '`/8ball` `/tictactoe` `/connect4` `/dice` `/meme` `/gif`\nJuegos y entretenimiento',
          inline: true
        },
        {
          name: '🛡️ Moderación',
          value: '`/ban` `/kick` `/timeout` `/warn` `/clear` `/lock`\nHerramientas de moderación',
          inline: true
        },
        {
          name: '🔧 Utilidad',
          value: '`/ping` `/serverinfo` `/userinfo` `/avatar` `/wikipedia`\nComandos útiles',
          inline: true
        },
        {
          name: '⚙️ Administración',
          value: '`/announce` `/giveaway` `/poll` `/ticket` `/portal`\nGestión del servidor',
          inline: true
        }
      )
      .addFields({
        name: '📊 Estadísticas del Bot',
        value: '**41+ Comandos** • **10 APIs Integradas** • **200,000+ Estaciones de Radio**\n**5 APIs de Música** • **5 APIs de Radio** • **Calidad hasta 320kbps**',
        inline: false
      })
      .addFields({
        name: '🎧 APIs de Música',
        value: '• Spotify Web API\n• Jamendo (500,000+ pistas royalty-free)\n• TheAudioDB (Metadata completa)',
        inline: true
      })
      .addFields({
        name: '📡 APIs de Radio',
        value: '• iHeartRadio (USA, 320kbps)\n• TuneIn (100,000+ estaciones)\n• Radio Browser (190+ países)\n• Zeno.FM (50,000+ estaciones)\n• Radio Garden (Global)',
        inline: true
      })
      .addFields({
        name: '💡 Enlaces Útiles',
        value: '[Invitar Bot](https://discord.com/api/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=8&scope=bot%20applications.commands) • [Servidor de Soporte](https://discord.gg/your-server) • [Documentación](https://github.com/luisitoys12/baba-radio)',
        inline: false
      })
      .setThumbnail(this.client.user.displayAvatarURL())
      .setFooter({ text: 'BABA RADIO v4.0 • Usa el menú para ver comandos por categoría' })
      .setTimestamp()

    // Create category selection menu
    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId('help_category_select')
      .setPlaceholder('📂 Selecciona una categoría para ver sus comandos')
      .addOptions(
        categories.map(cat => ({
          label: cat.name,
          description: cat.description,
          value: cat.key,
          emoji: cat.emoji
        }))
      )

    const row = new ActionRowBuilder().addComponents(selectMenu)

    await interaction.reply({ embeds: [embed], components: [row] })
  }
}
