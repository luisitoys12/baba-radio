const Command = require('../structures/command.js')
const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, SlashCommandBuilder } = require('discord.js')
const { getAllCategories } = require('../utils/commandCategories.js')

module.exports = class Commands extends Command {
  constructor(client) {
    super(client, {
      name: 'commands',
      description: 'Muestra todos los comandos del bot con búsqueda interactiva',
      category: 'utility',
      slash: new SlashCommandBuilder()
        .setName('commands')
        .setDescription('Muestra todos los comandos del bot con búsqueda interactiva')
        .addStringOption(option =>
          option
            .setName('buscar')
            .setDescription('Busca un comando específico')
            .setRequired(false)
        )
    })
  }

  async runSlash(interaction) {
    const searchQuery = interaction.options.getString('buscar')

    // If searching for specific command
    if (searchQuery) {
      const command = this.client.commands.find(c => 
        c.name.toLowerCase().includes(searchQuery.toLowerCase())
      )

      if (!command) {
        return interaction.reply({ 
          content: `❌ No se encontró ningún comando con "${searchQuery}"`, 
          ephemeral: true 
        })
      }

      const { getCategoryForCommand } = require('../utils/commandCategories.js')
      const category = getCategoryForCommand(command.name)

      const embed = new EmbedBuilder()
        .setColor(0x5865f2)
        .setTitle(`${category.emoji} /${command.name}`)
        .setDescription(command.description || 'Sin descripción')
        .addFields({
          name: '📂 Categoría',
          value: category.name,
          inline: true
        })
        .setFooter({ text: 'BABA RADIO v4.0' })
        .setTimestamp()

      return interaction.reply({ embeds: [embed] })
    }

    // Show all commands organized by category
    const categories = getAllCategories()
    const totalCommands = this.client.commands.length

    const embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setTitle('📋 Lista Completa de Comandos')
      .setDescription(`**${totalCommands} comandos disponibles** organizados en ${categories.length} categorías\n\nUsa el menú abajo para explorar por categoría o usa \`/commands buscar:<nombre>\` para buscar un comando específico.`)
      .setThumbnail(this.client.user.displayAvatarURL())
      .setFooter({ text: 'BABA RADIO v4.0 • Usa /help para más información' })
      .setTimestamp()

    // Add category summaries
    categories.forEach(cat => {
      const commandCount = cat.commands.length
      const commandList = cat.commands.slice(0, 5).map(cmd => `\`/${cmd}\``).join(' ')
      const more = commandCount > 5 ? ` +${commandCount - 5} más` : ''
      
      embed.addFields({
        name: `${cat.emoji} ${cat.name} (${commandCount})`,
        value: commandList + more,
        inline: false
      })
    })

    // Create category selection menu
    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId('help_category_select')
      .setPlaceholder('📂 Selecciona una categoría para ver todos sus comandos')
      .addOptions(
        categories.map(cat => ({
          label: `${cat.name} (${cat.commands.length} comandos)`,
          description: cat.description,
          value: cat.key,
          emoji: cat.emoji
        }))
      )

    const row = new ActionRowBuilder().addComponents(selectMenu)

    await interaction.reply({ embeds: [embed], components: [row] })
  }
}
