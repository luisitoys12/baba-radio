const Command = require('../structures/command.js')
const { EmbedBuilder } = require('discord.js')

module.exports = class Music extends Command {
  constructor (client) {
    super(client, {
      name: 'music',
      aliases: [],
      description: 'Reproduce música de YouTube con Lavalink (sucesor de /play)'
    })
  }

  async runSlash (interaction) {
    await interaction.deferReply()
    
    const query = interaction.options.getString('cancion')

    if (!interaction.member.voice.channel) {
      return interaction.editReply('❌ Necesitas estar en un canal de voz!')
    }

    // Verificar si Lavalink está disponible
    if (!this.client.lavalink) {
      return interaction.editReply('❌ El sistema de música Lavalink no está disponible en este momento. Intenta más tarde.')
    }

    try {
      const player = this.client.lavalink.getPlayer(interaction.guild.id) || 
                     this.client.lavalink.createPlayer({
                       guildId: interaction.guild.id,
                       voiceChannelId: interaction.member.voice.channel.id,
                       textChannelId: interaction.channel.id,
                       selfDeaf: true,
                       selfMute: false,
                       volume: 100
                     })

      if (!player.connected) await player.connect()

      // Buscar en YouTube
      const searchQuery = query.includes('http') ? query : `ytsearch:${query}`
      const res = await player.search({ query: searchQuery }, interaction.user)

      if (!res || !res.tracks || res.tracks.length === 0) {
        return interaction.editReply('❌ No se encontraron resultados.')
      }

      const track = res.tracks[0]
      
      await player.queue.add(track)
      
      if (!player.playing && !player.paused && player.queue.tracks.length === 1) {
        await player.play()
      }

      // Determinar icono y nombre de fuente
      let sourceIcon = '🎵'
      let sourceName = 'Desconocido'
      
      if (track.info.sourceName === 'youtube') {
        sourceIcon = '▶️'
        sourceName = 'YouTube'
      } else if (track.info.sourceName === 'spotify') {
        sourceIcon = '🟢'
        sourceName = 'Spotify'
      } else if (track.info.sourceName === 'soundcloud') {
        sourceIcon = '🟠'
        sourceName = 'SoundCloud'
      }

      const embed = new EmbedBuilder()
        .setColor(0xff0000)
        .setTitle(`${sourceIcon} Reproduciendo con Lavalink`)
        .setDescription(`**${track.info.title}**`)
        .addFields(
          { name: '👤 Artista', value: track.info.author || 'Desconocido', inline: true },
          { name: '⏱️ Duración', value: this.formatDuration(track.info.duration), inline: true },
          { name: '📡 Fuente', value: sourceName, inline: true }
        )
        .addFields(
          { name: '🎧 Sistema', value: 'Lavalink v4 (Alta Calidad)', inline: true },
          { name: '📊 Cola', value: `${player.queue.tracks.length} canciones`, inline: true },
          { name: '🔊 Volumen', value: `${player.volume}%`, inline: true }
        )
        .setThumbnail(track.info.artworkUrl || 'https://cdn.discordapp.com/attachments/330739726321713153/598282410349690890/kisspng-iheartradio-iheartmedia-app-store-internet-radio-hibiki-radio-station-5b3d78199a0fb4.png')
        .setFooter({ text: `Solicitado por ${interaction.user.tag} • BABA RADIO v4.0 • Powered by Lavalink` })
        .setTimestamp()

      if (track.info.uri) {
        embed.setURL(track.info.uri)
      }

      await interaction.editReply({ embeds: [embed] })

    } catch (error) {
      this.client.log('error', 'Music command error:', error)
      await interaction.editReply('❌ Error al reproducir la música. Verifica que el enlace sea válido.')
    }
  }

  formatDuration(ms) {
    const seconds = Math.floor((ms / 1000) % 60)
    const minutes = Math.floor((ms / (1000 * 60)) % 60)
    const hours = Math.floor(ms / (1000 * 60 * 60))
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }
}
