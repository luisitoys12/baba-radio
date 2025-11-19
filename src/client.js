const { Client, GatewayIntentBits, ActivityType } = require('discord.js')
const { readdirSync } = require('fs')
const { LavalinkManager } = require('lavalink-client')
const lavalinkConfig = require('../lavalink.config.js')

module.exports = class Baba extends Client {
  constructor (options) {
    super(options)
    this.commands = []
    this.customCommands = new Map()
    this.premiumGuilds = new Set()
    
    // Initialize Lavalink (will be initialized in ready event)
    this.lavalinkConfig = lavalinkConfig
    this.lavalink = null

    this.once('ready', this._ready.bind(this))
    
    // Setup raw voice state handler for Lavalink
    this.on('raw', (d) => {
      if (this.lavalink && ['VOICE_SERVER_UPDATE', 'VOICE_STATE_UPDATE'].includes(d.t)) {
        this.lavalink.sendRawData(d)
      }
    })
    
    this.initCommands('./src/commands')
    this.initEvents('./src/events')
  }

  _ready () {
    // Initialize Lavalink after bot is ready
    try {
      // Convert config nodes to Lavalink format
      const lavalinkNodes = this.lavalinkConfig.nodes.map(node => ({
        authorization: node.password,
        host: node.host,
        port: node.port,
        id: node.id,
        secure: node.secure
      }))

      this.lavalink = new LavalinkManager({
        nodes: lavalinkNodes,
        sendToShard: (guildId, payload) => {
          const guild = this.guilds.cache.get(guildId)
          if (guild) {
            guild.shard.send(payload)
          }
        },
        client: {
          id: this.user.id,
          username: this.user.username
        },
        autoSkip: true,
        playerOptions: {
          clientBasedPositionUpdateInterval: 150,
          defaultSearchPlatform: "ytsearch",
          volumeDecrementer: 1.0,
          onDisconnect: {
            autoReconnect: true,
            destroyPlayer: false
          },
          onEmptyQueue: {
            destroyAfterMs: 30_000,
          },
          useUnresolvedData: true
        }
      })
      
      // Setup node event listeners
      this.lavalink.nodeManager.on('connect', (node) => {
        this.log('info', `✅ Lavalink node ${node.id} connected!`)
      })
      
      this.lavalink.nodeManager.on('disconnect', (node, reason) => {
        this.log('warn', `⚠️ Lavalink node ${node.id} disconnected: ${reason?.message || 'Unknown'}`)
      })
      
      this.lavalink.nodeManager.on('error', (node, error) => {
        this.log('error', `❌ Lavalink node ${node.id} error: ${error.message}`)
      })

      // Setup player event listeners
      this.lavalink.on('playerCreate', (player) => {
        this.log('info', `🎵 Player created for guild ${player.guildId}`)
      })

      this.lavalink.on('playerDestroy', (player) => {
        this.log('info', `🗑️ Player destroyed for guild ${player.guildId}`)
      })

      this.lavalink.on('trackStart', (player, track) => {
        this.log('info', `▶️ Playing: ${track.info.title} in guild ${player.guildId}`)
      })

      this.lavalink.on('trackEnd', (player, track, payload) => {
        this.log('info', `⏹️ Track ended: ${track.info.title} in guild ${player.guildId}`)
      })

      this.lavalink.on('trackError', (player, track, payload) => {
        this.log('error', `❌ Track error: ${track.info.title} - ${payload.exception?.message || 'Unknown error'}`)
      })

      this.lavalink.on('trackStuck', (player, track, payload) => {
        this.log('warn', `⚠️ Track stuck: ${track.info.title}`)
      })

      this.lavalink.on('playerUpdate', (player) => {
        // Player position update
      })
      
      this.lavalink.init({ id: this.user.id, username: this.user.username })
      this.log('info', `Lavalink Manager initialized with ${lavalinkNodes.length} nodes - BABA RADIO`)
    } catch (error) {
      this.log('error', 'Failed to initialize Lavalink:', error)
      this.log('info', 'Bot will continue without Lavalink support')
    }

    // Check maintenance mode
    const fs = require('fs')
    try {
      const maintenance = JSON.parse(fs.readFileSync('./maintenance.json', 'utf8'))
      if (maintenance.enabled) {
        this.user.setActivity('🔧 En Mantenimiento', { 
          type: ActivityType.Streaming,
          url: 'https://www.twitch.tv/solomeradio'
        })
        this.log('info', '⚠️ Bot en modo mantenimiento')
        this.maintenanceMode = true
      } else {
        this.user.setActivity('Solome Radio', { 
          type: ActivityType.Streaming,
          url: 'https://www.twitch.tv/solomeradio'
        })
        this.maintenanceMode = false
      }
    } catch (e) {
      this.maintenanceMode = false
    }

    // Track uptime
    this.startTime = Date.now()
    
    this.log('info', 'Bot is ready! Streaming Solome Radio 🎵')
  }

  log (type, ...args) {
    console.log(`[${type}]`, ...args)
  }

  initCommands (dir) {
    readdirSync(dir).forEach(file => {
      if (file.endsWith('.js')) {
        try {
          const Command = require(`./commands/${file}`)
          this.commands.push(new Command(this))
          delete require.cache[require.resolve(`./commands/${file}`)]
        } catch (err) {
          this.log('error', err)
        } finally {
          this.log('commands', `${file} loaded.`)
        }
      }
    })
  }

  initEvents (dir) {
    readdirSync(dir).forEach(file => {
      if (file.endsWith('.js')) {
        try {
          const Event = require(`./events/${file}`)
          const event = new Event(this)
          super.on(event.name, (...args) => event._run(...args))
          delete require.cache[require.resolve(`./events/${file}`)]
        } catch (err) {
          this.log('error', err)
        } finally {
          this.log('events', `${file} loaded.`)
        }
      }
    })
  }
}
