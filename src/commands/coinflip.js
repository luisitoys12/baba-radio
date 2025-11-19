const Command = require('../structures/command.js')

module.exports = class Coinflip extends Command {
  constructor (client) {
    super(client, { name: 'coinflip', description: 'Lanza una moneda' })
  }

  async runSlash (interaction) {
    const result = Math.random() < 0.5 ? '🪙 Cara' : '🪙 Cruz'
    await interaction.reply({ content: result })
  }
}
