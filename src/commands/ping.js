const Command = require('../structures/command.js')

module.exports = class Ping extends Command {
  constructor (client) {
    super(client, { name: 'ping', description: 'Muestra la latencia del bot' })
  }

  async runSlash (interaction) {
    await interaction.reply({ content: `🏓 Pong! Latencia: ${this.client.ws.ping}ms` })
  }
}
