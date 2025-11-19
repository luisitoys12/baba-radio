// Command Categories System for BABA RADIO

const categories = {
  MUSIC: {
    name: '🎵 Música',
    emoji: '🎵',
    description: 'Reproduce música ilimitada de YouTube, Spotify y más',
    color: 0x9b59b6,
    commands: ['play', 'music', 'pause', 'resume', 'skip', 'stop', 'queue', 'lyrics']
  },
  RADIO: {
    name: '📻 Radio',
    emoji: '📻',
    description: '200,000+ estaciones de radio de todo el mundo',
    color: 0xe74c3c,
    commands: ['radio', 'radioinfo']
  },
  MODERATION: {
    name: '🛡️ Moderación',
    emoji: '🛡️',
    description: 'Herramientas para mantener tu servidor seguro',
    color: 0xe67e22,
    commands: ['ban', 'kick', 'unban', 'timeout', 'warn', 'clear', 'lock', 'unlock', 'slowmode', 'moderation']
  },
  FUN: {
    name: '🎮 Diversión',
    emoji: '🎮',
    description: 'Juegos interactivos y entretenimiento',
    color: 0xf1c40f,
    commands: ['8ball', 'tictactoe', 'connect4', 'coinflip', 'dice', 'meme', 'gif']
  },
  UTILITY: {
    name: '🔧 Utilidad',
    emoji: '🔧',
    description: 'Herramientas útiles e información del servidor',
    color: 0x3498db,
    commands: ['ping', 'uptime', 'serverinfo', 'userinfo', 'botinfo', 'avatar', 'wikipedia', 'invite', 'help', 'commands']
  },
  ADMIN: {
    name: '⚙️ Administración',
    emoji: '⚙️',
    description: 'Gestión avanzada del servidor',
    color: 0x95a5a6,
    commands: ['announce', 'giveaway', 'poll', 'ticket', 'portal', 'premium']
  },
  DEVELOPER: {
    name: '👨‍💻 Desarrollador',
    emoji: '👨‍💻',
    description: 'Comandos exclusivos para desarrolladores',
    color: 0x2c3e50,
    commands: ['eval', 'credits']
  }
}

function getCategoryForCommand(commandName) {
  for (const [key, category] of Object.entries(categories)) {
    if (category.commands.includes(commandName)) {
      return {
        key,
        ...category
      }
    }
  }
  return {
    key: 'OTHER',
    name: '📦 Otros',
    emoji: '📦',
    description: 'Otros comandos',
    commands: []
  }
}

function getAllCategories() {
  return Object.entries(categories).map(([key, category]) => ({
    key,
    ...category
  }))
}

function getCommandsByCategory(categoryKey) {
  return categories[categoryKey]?.commands || []
}

function getCategoryEmbed(categoryKey, client) {
  const { EmbedBuilder } = require('discord.js')
  const category = categories[categoryKey]
  
  if (!category) return null

  const embed = new EmbedBuilder()
    .setColor(category.color || 0x5865f2)
    .setTitle(`${category.emoji} ${category.name}`)
    .setDescription(`**${category.description}**\n\n${category.commands.length} comandos disponibles en esta categoría`)
    .setTimestamp()

  const commandList = category.commands
    .map(cmd => {
      const command = client.commands.find(c => c.name === cmd)
      if (!command) return null
      return `${category.emoji} \`/${cmd}\` - ${command.description || 'Sin descripción'}`
    })
    .filter(Boolean)
    .join('\n')

  if (commandList) {
    embed.addFields({
      name: '📋 Comandos',
      value: commandList || 'No hay comandos en esta categoría'
    })
  }

  // Add usage tip
  const usageTips = {
    MUSIC: '💡 **Tip:** Únete a un canal de voz y usa `/play <canción>` para empezar',
    RADIO: '💡 **Tip:** Usa `/radio <nombre>` para buscar entre 200,000+ estaciones',
    MODERATION: '💡 **Tip:** Requiere permisos de moderador para usar estos comandos',
    FUN: '💡 **Tip:** Menciona a un amigo para jugar juntos',
    UTILITY: '💡 **Tip:** Usa `/help` para ver todas las categorías',
    ADMIN: '💡 **Tip:** Requiere permisos de administrador',
    DEVELOPER: '💡 **Tip:** Solo el dueño del bot puede usar estos comandos'
  }

  if (usageTips[categoryKey]) {
    embed.addFields({
      name: '💡 Consejo',
      value: usageTips[categoryKey]
    })
  }

  return embed
}

module.exports = {
  categories,
  getCategoryForCommand,
  getAllCategories,
  getCommandsByCategory,
  getCategoryEmbed
}
