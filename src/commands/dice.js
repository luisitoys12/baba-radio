const Command = require('../structures/command.js')

module.exports = class Dice extends Command {
  constructor (client) {
    super(client, { name: 'dice', description: 'Tira un dado' })
  }

  async runSlash (interaction) {
    const sides = interaction.options.getInteger('lados') || 6
    const result = Math.floor(Math.random() * sides) + 1
    await interaction.reply({ content: `🎲 Resultado: **${result}** (de ${sides})` })
  }
}
