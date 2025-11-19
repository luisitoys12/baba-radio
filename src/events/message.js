const Event = require('../structures/event.js')
const { ChannelType, EmbedBuilder } = require('discord.js')

module.exports = class Message extends Event {
  constructor (client) {
    super(client, {
      name: 'messageCreate'
    })
  }

  async run (message) {
    if (message.author.bot) return
    if (message.channel.type === ChannelType.DM) return

    // Auto-moderación de groserías
    const badWords = [
      // Español
      'puta', 'puto', 'mierda', 'coño', 'carajo', 'verga', 'chingada', 'pendejo', 'idiota', 'estúpido',
      // Inglés
      'fuck', 'shit', 'bitch', 'ass', 'damn', 'crap', 'dick', 'pussy', 'bastard', 'asshole',
      // Portugués
      'porra', 'merda', 'caralho', 'puta', 'filho da puta', 'idiota',
      // Francés
      'merde', 'putain', 'connard', 'salope',
      // Alemán
      'scheiße', 'arsch', 'fick'
    ]

    const content = message.content.toLowerCase()
    const hasBadWord = badWords.some(word => content.includes(word))

    if (hasBadWord && message.member && message.member.moderatable) {
      try {
        await message.delete()
        await message.member.timeout(60000, 'Uso de lenguaje inapropiado (auto-moderación)')
        
        const warningMsg = await message.channel.send(
          `⚠️ ${message.author}, has sido silenciado por 1 minuto por usar lenguaje inapropiado.`
        )
        
        setTimeout(() => warningMsg.delete().catch(() => {}), 5000)
        
        this.client.log('info', `Auto-mod: ${message.author.tag} silenciado por lenguaje inapropiado`)
        return
      } catch (error) {
        this.client.log('error', 'Error en auto-moderación:', error)
      }
    }

    // Check if bot is mentioned
    if (message.mentions.has(this.client.user.id)) {
      const { ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js')
      const { getAllCategories } = require('../utils/commandCategories.js')
      
      const categories = getAllCategories()
      
      const embed = new EmbedBuilder()
        .setColor(0x5865f2)
        .setTitle('👋 ¡Hola! Soy BABA RADIO')
        .setDescription('**🎵 Bot de Música y Radio con 200,000+ Estaciones**\n\nSoy un bot multifuncional con 10 APIs integradas, música ilimitada y radio de todo el mundo!')
        .addFields(
          {
            name: '🎵 Música',
            value: '`/play` `/music` `/queue` `/skip` `/stop` `/lyrics`',
            inline: true
          },
          {
            name: '📻 Radio',
            value: '`/radio` `/radioinfo`\n**200,000+ estaciones**',
            inline: true
          },
          {
            name: '🎮 Diversión',
            value: '`/8ball` `/tictactoe` `/connect4` `/dice` `/meme`',
            inline: true
          },
          {
            name: '🛡️ Moderación',
            value: '`/ban` `/kick` `/timeout` `/warn` `/clear` `/lock`',
            inline: true
          },
          {
            name: '🔧 Utilidad',
            value: '`/ping` `/serverinfo` `/userinfo` `/avatar` `/wikipedia`',
            inline: true
          },
          {
            name: '⚙️ Admin',
            value: '`/announce` `/giveaway` `/poll` `/ticket` `/portal`',
            inline: true
          }
        )
        .addFields({
          name: '📊 Estadísticas',
          value: '**41+ Comandos** • **10 APIs** • **200,000+ Estaciones** • **Calidad 320kbps**',
          inline: false
        })
        .addFields({
          name: '💡 Inicio Rápido',
          value: '1️⃣ Únete a un canal de voz\n2️⃣ Usa `/radio` para buscar estaciones\n3️⃣ Usa `/play` para reproducir música\n4️⃣ Usa el menú abajo para ver comandos por categoría',
          inline: false
        })
        .setThumbnail(this.client.user.displayAvatarURL())
        .setFooter({ text: 'Usa / para ver todos los comandos • BABA RADIO v4.0' })
        .setTimestamp()

      // Create category selection menu
      const selectMenu = new StringSelectMenuBuilder()
        .setCustomId('category_select')
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

      message.reply({ embeds: [embed], components: [row] })
      return
    }

    // Legacy prefix commands (if any)
    if (message.content.startsWith(process.env.PREFIX)) {
      const cmd = message.content.split(' ')[0].substring(process.env.PREFIX.length)
      const args = message.content.substring(cmd.length + process.env.PREFIX.length + 1)
      const command = this.client.commands.find(c => c.name.toLowerCase() === cmd || (c.aliases && c.aliases.includes(cmd)))

      if (this.onlyDev === true && message.author.id === process.env.OWNER) return
      if ((command && cmd.trim()) && command.canRun(message, args)) {
        try {
          command._run(message, args)
        } catch (e) {
          this.client.log('error', e)
        } finally {
          this.client.log('info', `${message.author.tag} issued command: ${message.content}`)
        }
      }
    }
  }
}
