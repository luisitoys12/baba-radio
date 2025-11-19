const Command = require('../structures/command.js')
const { EmbedBuilder, SlashCommandBuilder } = require('discord.js')

module.exports = class Debug extends Command {
  constructor(client) {
    super(client, {
      name: 'debug',
      description: 'Muestra información de depuración del sistema de música',
      category: 'developer',
      slash: new SlashCommandBuilder()
        .setName('debug')
        .setDescription('Muestra información de depuración del sistema de música')
    })
  }

  async runSlash(interaction) {
    if (interaction.user.id !== process.env.OWNER) {
      return interaction.reply({ content: '❌ Solo el dueño del bot puede usar este comando.', ephemeral: true })
    }

    await interaction.deferReply({ ephemeral: true })

    const embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setTitle('🔧 Debug - Sistema de Música')
      .setTimestamp()

    // Lavalink status
    if (!this.client.lavalink) {
      embed.addFields({
        name: '❌ Lavalink',
        value: 'No inicializado'
      })
      return interaction.editReply({ embeds: [embed] })
    }

    const nodes = Array.from(this.client.lavalink.nodeManager.nodes.values())
    const connectedNodes = nodes.filter(n => n.connected)
    
    embed.addFields({
      name: '🎧 Lavalink Manager',
      value: `Nodos: ${nodes.length}\nConectados: ${connectedNodes.length}\nIniciado: ${this.client.lavalink.initiated ? 'Sí' : 'No'}`
    })

    // Connected nodes
    if (connectedNodes.length > 0) {
      const nodeList = connectedNodes.map(n => 
        `✅ **${n.id}**\n   Host: ${n.options.host}:${n.options.port}\n   Secure: ${n.options.secure}`
      ).join('\n')
      
      embed.addFields({
        name: '📡 Nodos Conectados',
        value: nodeList
      })
    }

    // Player info
    const player = this.client.lavalink.getPlayer(interaction.guild.id)
    
    if (player) {
      embed.addFields({
        name: '🎵 Player Status',
        value: `Conectado: ${player.connected}\nReproduciendo: ${player.playing}\nPausado: ${player.paused}\nVolumen: ${player.volume}%\nCola: ${player.queue.tracks.length} tracks`
      })

      if (player.queue.current) {
        embed.addFields({
          name: '▶️ Track Actual',
          value: `${player.queue.current.info.title}\nAutor: ${player.queue.current.info.author}\nDuración: ${this.formatDuration(player.queue.current.info.duration)}`
        })
      }

      // Voice channel info
      embed.addFields({
        name: '🔊 Canal de Voz',
        value: `ID: ${player.voiceChannelId}\nConectado: ${player.connected}`
      })
    } else {
      embed.addFields({
        name: '🎵 Player',
        value: 'No hay player activo en este servidor'
      })
    }

    // Voice state
    const voiceState = interaction.guild.members.cache.get(this.client.user.id)?.voice
    if (voiceState) {
      embed.addFields({
        name: '🎤 Estado de Voz del Bot',
        value: `Canal: ${voiceState.channelId || 'Ninguno'}\nSordo: ${voiceState.deaf}\nMuteado: ${voiceState.mute}\nStreaming: ${voiceState.streaming}`
      })
    }

    await interaction.editReply({ embeds: [embed] })
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
