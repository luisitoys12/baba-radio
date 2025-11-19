const Command = require('../structures/command.js')
const { EmbedBuilder } = require('discord.js')

module.exports = class RadioInfo extends Command {
  constructor (client) {
    super(client, {
      name: 'radioinfo',
      description: 'Información sobre las fuentes de radio disponibles'
    })
  }

  async runSlash (interaction) {
    const embed = new EmbedBuilder()
      .setColor(0xff6b6b)
      .setTitle('📻 Fuentes de Radio Disponibles')
      .setDescription('Baba Radio integra múltiples servicios de radio para ofrecerte la mejor experiencia.')
      .addFields(
        {
          name: '🎙️ iHeartRadio',
          value: [
            '• Miles de estaciones de radio',
            '• Cobertura principalmente en USA',
            '• Música, noticias, deportes y más',
            '• Alta calidad de audio',
            '• API oficial integrada'
          ].join('\n'),
          inline: false
        },
        {
          name: '📡 TuneIn',
          value: [
            '• Más de 100,000 estaciones',
            '• Cobertura global',
            '• Radio en vivo y podcasts',
            '• Deportes en vivo',
            '• API OpenML integrada'
          ].join('\n'),
          inline: false
        },
        {
          name: '🌍 MyTuner (Radio Browser)',
          value: [
            '• Base de datos comunitaria',
            '• Estaciones de todo el mundo',
            '• Actualización constante',
            '• Filtros avanzados',
            '• API pública gratuita'
          ].join('\n'),
          inline: false
        },
        {
          name: '🎵 Cómo Usar',
          value: '`/radio estacion:nombre fuente:all` - Busca en todas las fuentes\n`/radio estacion:nombre fuente:iheart` - Solo iHeartRadio\n`/radio estacion:nombre fuente:tunein` - Solo TuneIn\n`/radio estacion:nombre fuente:mytuner` - Solo MyTuner',
          inline: false
        },
        {
          name: '📊 Estadísticas',
          value: '• **Total de estaciones:** 100,000+\n• **Países cubiertos:** 190+\n• **Géneros disponibles:** Todos',
          inline: false
        }
      )
      .setFooter({ text: 'Baba Radio v4.0 - Powered by djluisalegre' })
      .setTimestamp()

    await interaction.reply({ embeds: [embed] })
  }
}
