<div align="center">
  <img src="https://cdn.discordapp.com/attachments/330739726321713153/451058006965354526/baba_logo_xd.png"><br>
  <b>Baba Radio v4.0 - Discord Bot made with discord.js v14, focused on playing radio stations and music.</b><br><br>
  <b>🎵 Streaming Solome Radio 🎵</b><br>
  <b>✅ 5 Music APIs + 5 Radio APIs = 200,000+ Stations!</b><br>
  <b>🎧 Lavalink v4 + Multiple Nodes</b><br>
  <b>👨‍💻 Creado por djluisalegre para Solome</b><br><br>

  <p>
    <a href="https://github.com/perronosaurio/Baba-Radio/blob/master/LICENSE" target="_blank"><img src="https://img.shields.io/github/license/perronosaurio/Baba-Radio.svg" alt="License"/></a>
    <img src="https://img.shields.io/badge/discord.js-v14-blue.svg" alt="Discord.js v14"/>
    <img src="https://img.shields.io/badge/lavalink-v4-orange.svg" alt="Lavalink v4"/>
    <img src="https://img.shields.io/badge/status-online-brightgreen.svg" alt="Status"/>
    <img src="https://img.shields.io/badge/stations-200k+-blue.svg" alt="200k+ Stations"/>
  </p>
</div>

## 🚀 Installation

### Prerequisites
1. [Node.js](https://nodejs.org/) v18 or higher
2. [FFmpeg](https://ffmpeg.org/) installed on your system
3. A Discord Bot Token (no privileged intents required!)

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/perronosaurio/baba-radio.git
   cd baba-radio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   - Copy `.env.example` to `.env`
   - Add your Discord bot token and client ID to `.env`
   ```env
   TOKEN=your_discord_bot_token_here
   CLIENT_ID=your_bot_application_id
   PREFIX=!
   OWNER=your_discord_user_id
   ```

4. **Register slash commands**
   ```bash
   npm run register
   ```

5. **Start the bot**
   ```bash
   npm start
   ```

## 📝 Commands

The bot uses **Slash Commands** with an interactive category system!

### 🎯 Quick Access
- **Mention the bot:** `@BABA RADIO` for an interactive menu
- **Use `/help`:** See all categories with selection menu
- **Use `/commands`:** Search and browse all commands

### 📚 Command Categories (45 commands)

#### 🎵 Música (8 comandos)
`/play` `/music` `/pause` `/resume` `/skip` `/stop` `/queue` `/lyrics`

#### 📻 Radio (2 comandos)
`/radio` `/radioinfo` - **200,000+ estaciones de todo el mundo**

#### 🛡️ Moderación (10 comandos)
`/ban` `/kick` `/unban` `/timeout` `/warn` `/clear` `/lock` `/unlock` `/slowmode` `/moderation`

#### 🎮 Diversión (7 comandos)
`/8ball` `/tictactoe` `/connect4` `/coinflip` `/dice` `/meme` `/gif`

#### 🔧 Utilidad (10 comandos)
`/ping` `/uptime` `/serverinfo` `/userinfo` `/botinfo` `/avatar` `/wikipedia` `/invite` `/help` `/commands`

#### ⚙️ Administración (6 comandos)
`/announce` `/giveaway` `/poll` `/ticket` `/portal` `/premium`

#### 👨‍💻 Desarrollador (2 comandos)
`/eval` `/credits`

### 💡 How to use:
1. **Mention the bot** (`@BABA RADIO`) for an interactive menu with categories
2. **Use `/help`** to see all categories with selection menu
3. **Use `/commands`** to search for specific commands
4. **Join a voice channel** and use `/play` or `/radio` to start listening
5. **Type `/`** to see all available slash commands

For detailed command documentation, see [COMMANDS_GUIDE.md](./COMMANDS_GUIDE.md)

## 🎵 Features

### Music APIs (5)
- 🎧 **Spotify Web API** - Search, recommendations, playlists
- 🎼 **Jamendo API** - 500,000+ royalty-free tracks
- 📀 **TheAudioDB** - Artist info, albums, music videos

### Radio APIs (5)
- 📻 **iHeartRadio** - USA coverage, high quality (320kbps)
- 🌐 **TuneIn** - 100,000+ stations globally
- 📡 **Radio Browser** - 50,000+ stations, 190+ countries
- 🎙️ **Zeno.FM** - 50,000+ stations worldwide
- 🌍 **Radio Garden** - Global radio exploration

### Audio Streaming
- 🎵 Lavalink v4 with multiple nodes
- 🔊 High-quality audio (up to 320kbps)
- 🔄 Automatic node failover
- 💾 Local Lavalink server included
- 🎚️ Volume control and audio filters

### Games & Fun
- 🎱 Magic 8-Ball fortune teller
- ⭕ Tic-Tac-Toe (Gato) multiplayer game
- 🔴 Connect 4 (4 en línea) multiplayer game
- 🎮 Interactive button-based gameplay

### Information
- 📖 Wikipedia search with multiple languages
- 💬 Helpful bot mention response
- 📋 Interactive dropdown menus

### Technical
- ✅ 41+ commands
- 🚀 200,000+ radio stations
- 🎯 Modern slash commands
- 🔄 Automatic command registration
- 🌐 Multiple API integrations

## 🔧 Tech Stack

- **Discord.js v14** - Discord bot framework
- **Lavalink v4** - High-performance audio streaming
- **Lavalink-client** - Node.js Lavalink wrapper
- **Spotify Web API** - Music search and recommendations
- **Jamendo API** - Royalty-free music
- **TheAudioDB** - Music metadata
- **Zeno.FM API** - Radio stations
- **Radio Garden API** - Global radio
- **iHeartRadio API** - USA radio stations
- **TuneIn API** - Global radio stations
- **Radio Browser API** - Community radio database

## 📊 Statistics

- **Total Radio Stations**: 200,000+
- **Music Tracks**: Unlimited (via APIs)
- **Countries Covered**: 190+
- **Audio Quality**: Up to 320kbps
- **Lavalink Nodes**: 7 (6 public + 1 local)
- **Commands**: 41+
- **APIs Integrated**: 10

## 📚 Documentation

For detailed documentation, see:
- [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) - Complete implementation details
- [RADIO_APIS.md](./RADIO_APIS.md) - Radio API documentation
- [lavalink.config.js](./lavalink.config.js) - Lavalink configuration

## 🧪 Testing

Test all APIs:
```bash
node test-apis.js
```

## 🎯 API Usage

### Music APIs
```javascript
const apis = require('./src/apis')

// Spotify
const tracks = await apis.spotify.searchTracks('Adele', 10)

// Jamendo (Royalty-free)
const freeTracks = await apis.jamendo.searchTracks('electronic', 20)

// TheAudioDB
const artist = await apis.theaudiodb.searchArtist('Coldplay')
```

### Radio APIs
```javascript
// Zeno.FM
const stations = await apis.zenofm.searchStations('rock', 20)

// Radio Garden
const stations = await apis.radiogarden.searchStations('london')
```

## 📄 License

MIT License - see LICENSE file for details
