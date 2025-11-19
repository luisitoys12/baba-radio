// Lavalink Configuration v4
// Multiple Public Lavalink Servers - TESTED & WORKING
// High performance and reliability with fallback nodes

module.exports = {
  nodes: [
    // Local Node - BABA RADIO Local Server (Backup)
    {
      host: 'localhost',
      port: 2333,
      password: 'babaradio2025',
      secure: false,
      retryAmount: 5,
      retryDelay: 3000,
      id: 'baba-local',
      region: 'local'
    },
    // Primary Node - Public Lavalink v4 (SSL) ✅ WORKING
    {
      host: 'lava-v4.ajieblogs.eu.org',
      port: 443,
      password: 'https://dsc.gg/ajidevserver',
      secure: true,
      retryAmount: 5,
      retryDelay: 3000,
      id: 'ajie-v4-ssl',
      region: 'global'
    },
    // Backup Node 1 - DivaHost (Non-SSL, v4)
    {
      host: 'lavalink.divahost.net',
      port: 60002,
      password: 'divahostv4',
      secure: false,
      retryAmount: 5,
      retryDelay: 3000,
      id: 'divahost-v4',
      region: 'global'
    },
    // Backup Node 2 - RudraCloud
    {
      host: 'lavalink.rudracloud.com',
      port: 2333,
      password: 'RudraCloud.com',
      secure: false,
      retryAmount: 5,
      retryDelay: 3000,
      id: 'rudracloud',
      region: 'global'
    },
    // Backup Node 3 - INZEWORLD (DE)
    {
      host: 'lava.inzeworld.com',
      port: 3128,
      password: 'saher.inzeworld.com',
      secure: false,
      retryAmount: 5,
      retryDelay: 3000,
      id: 'inzeworld-de',
      region: 'eu'
    },
    // Backup Node 4 - Nextgen Coders
    {
      host: 'publicnode.nextgencoders.xyz',
      port: 2336,
      password: 'nextgencoders',
      secure: false,
      retryAmount: 5,
      retryDelay: 3000,
      id: 'nextgen-coders',
      region: 'global'
    },
    // Backup Node 5 - LavalinkHub
    {
      host: '69.30.219.178',
      port: 9781,
      password: 'https://discord.gg/VGMhhY7AAD',
      secure: false,
      retryAmount: 5,
      retryDelay: 3000,
      id: 'lavalinkhub',
      region: 'us'
    }
  ],
  options: {
    clientName: 'BabaRadio/4.0',
    defaultSearchPlatform: 'ytsearch',
    restTimeout: 10000,
    hostedBy: 'Multiple Public Nodes',
    version: '4.0'
  }
}
