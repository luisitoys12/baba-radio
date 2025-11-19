const Command = require('../structures/command.js')
const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ComponentType } = require('discord.js')
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, VoiceConnectionStatus, entersState } = require('@discordjs/voice')
const { search: iheartSearch, streamURL: iheartStreamURL } = require('iheart')
const axios = require('axios')

module.exports = class Radio extends Command {
  constructor (client) {
    super(client, {
      name: 'radio',
      aliases: [],
      description: 'Busca y reproduce estaciones de radio de iHeartRadio, TuneIn y MyTuner'
    })
  }

  async runSlash (interaction) {
    await interaction.deferReply()
    
    const query = interaction.options.getString('estacion')
    const source = interaction.options.getString('fuente') || 'all'

    if (!interaction.member.voice.channel) {
      return interaction.editReply('❌ Necesitas estar en un canal de voz!')
    }

    try {
      let stations = []

      // Buscar en iHeartRadio
      if (source === 'all' || source === 'iheart') {
        try {
          const iheartResults = await iheartSearch(query)
          if (iheartResults && iheartResults.stations) {
            stations.push(...iheartResults.stations.slice(0, 5).map(s => ({
              name: s.name,
              city: s.city || 'Desconocido',
              frequency: s.frequency || 'N/A',
              band: s.band || '',
              logo: s.newlogo || s.logo,
              source: 'iHeartRadio',
              data: s
            })))
          }
        } catch (e) {
          this.client.log('error', 'iHeart search error:', e)
        }
      }

      // Buscar en TuneIn
      if (source === 'all' || source === 'tunein') {
        try {
          // TuneIn API - Búsqueda de estaciones
          const tuneinResponse = await axios.get('http://opml.radiotime.com/Search.ashx', {
            params: {
              query: query,
              render: 'json',
              formats: 'mp3,aac'
            }
          })

          if (tuneinResponse.data && tuneinResponse.data.body) {
            const tuneinStations = tuneinResponse.data.body
              .filter(item => item.type === 'audio')
              .slice(0, 5)
              .map(s => ({
                name: s.text || s.name,
                city: s.subtext || 'TuneIn',
                frequency: s.bitrate ? `${s.bitrate}kbps` : 'N/A',
                band: 'Online',
                logo: s.image || s.logo,
                source: 'TuneIn',
                data: s,
                url: s.URL || s.url
              }))
            
            stations.push(...tuneinStations)
          }
        } catch (e) {
          this.client.log('error', 'TuneIn search error:', e)
        }
      }

      // Buscar en MyTuner
      if (source === 'all' || source === 'mytuner') {
        try {
          // MyTuner Radio API
          const mytunerResponse = await axios.get('https://de1.api.radio-browser.info/json/stations/search', {
            params: {
              name: query,
              limit: 5,
              hidebroken: true,
              order: 'votes',
              reverse: true
            },
            headers: {
              'User-Agent': 'BabaRadio/4.0'
            }
          })

          if (mytunerResponse.data && mytunerResponse.data.length > 0) {
            const mytunerStations = mytunerResponse.data.map(s => ({
              name: s.name,
              city: s.state || s.country || 'MyTuner',
              frequency: s.bitrate ? `${s.bitrate}kbps` : 'N/A',
              band: s.tags || 'Online',
              logo: s.favicon,
              source: 'MyTuner',
              data: s,
              url: s.url_resolved || s.url
            }))
            
            stations.push(...mytunerStations)
          }
        } catch (e) {
          this.client.log('error', 'MyTuner search error:', e)
        }
      }

      if (stations.length === 0) {
        return interaction.editReply('❌ No se encontraron estaciones de radio.')
      }

      const options = []
      for (let i = 0; i < Math.min(10, stations.length); i++) {
        const station = stations[i]
        options.push({
          label: station.name.substring(0, 100),
          description: `${station.city} - ${station.frequency} ${station.band} - ${station.source}`.substring(0, 100),
          value: i.toString()
        })
      }

      const selectMenu = new StringSelectMenuBuilder()
        .setCustomId('radio_select')
        .setPlaceholder('Selecciona una estación de radio')
        .addOptions(options)

      const row = new ActionRowBuilder().addComponents(selectMenu)

      const embed = new EmbedBuilder()
        .setColor(0xff6b6b)
        .setTitle('📻 Estaciones de Radio Encontradas')
        .setDescription(`Se encontraron ${stations.length} estaciones para "${query}"`)
        .addFields(
          { name: '🔍 Fuentes', value: source === 'all' ? 'iHeartRadio, TuneIn, MyTuner' : source, inline: true },
          { name: '📊 Resultados', value: `${stations.length} estaciones`, inline: true }
        )
        .setFooter({ text: 'Selecciona una estación del menú' })
        .setTimestamp()

      const response = await interaction.editReply({ embeds: [embed], components: [row] })

      try {
        const collector = response.createMessageComponentCollector({
          componentType: ComponentType.StringSelect,
          time: 30_000
        })

        collector.on('collect', async i => {
          if (i.user.id !== interaction.user.id) {
            return i.reply({ content: '❌ Este menú no es para ti!', ephemeral: true })
          }

          await i.deferUpdate()
          
          const stationIndex = parseInt(i.values[0])
          const station = stations[stationIndex]

          try {
            let streamUrl

            if (station.source === 'iHeartRadio') {
              streamUrl = await iheartStreamURL(station.data)
            } else if (station.source === 'TuneIn') {
              // TuneIn - obtener URL de stream
              if (station.url) {
                // Si la URL es un playlist, obtener el stream real
                try {
                  const streamResponse = await axios.get(station.url)
                  if (streamResponse.data && streamResponse.data.body && streamResponse.data.body[0]) {
                    streamUrl = streamResponse.data.body[0].url || streamResponse.data.body[0].URL
                  } else {
                    streamUrl = station.url
                  }
                } catch (e) {
                  streamUrl = station.url
                }
              }
            } else if (station.source === 'MyTuner') {
              // MyTuner - URL directa
              streamUrl = station.url
            }

            if (!streamUrl) {
              return interaction.editReply({ content: '❌ No se pudo obtener la URL de la estación.', embeds: [], components: [] })
            }

            const connection = joinVoiceChannel({
              channelId: interaction.member.voice.channel.id,
              guildId: interaction.guild.id,
              adapterCreator: interaction.guild.voiceAdapterCreator,
            })

            await entersState(connection, VoiceConnectionStatus.Ready, 30_000)

            const player = createAudioPlayer()
            const resource = createAudioResource(streamUrl, { inlineVolume: true })
            
            player.play(resource)
            connection.subscribe(player)

            const playEmbed = new EmbedBuilder()
              .setColor(0xff6b6b)
              .setTitle('📻 Reproduciendo Radio')
              .setDescription(`**${station.name}**`)
              .addFields(
                { name: '📍 Ciudad', value: station.city, inline: true },
                { name: '📡 Frecuencia', value: `${station.frequency} ${station.band}`, inline: true },
                { name: '🎙️ Fuente', value: station.source, inline: true }
              )
              .setThumbnail(station.logo || 'https://cdn.discordapp.com/attachments/330739726321713153/598282410349690890/kisspng-iheartradio-iheartmedia-app-store-internet-radio-hibiki-radio-station-5b3d78199a0fb4.png')
              .setFooter({ text: `Solicitado por ${interaction.user.tag}` })
              .setTimestamp()

            await interaction.editReply({ embeds: [playEmbed], components: [] })

            player.on('error', error => {
              this.client.log('error', error)
            })

          } catch (error) {
            this.client.log('error', error)
            await interaction.editReply({ content: '❌ Error al reproducir la estación.', embeds: [], components: [] })
          }

          collector.stop()
        })

        collector.on('end', (collected, reason) => {
          if (reason === 'time') {
            interaction.editReply({ content: '❌ Tiempo de selección agotado.', embeds: [], components: [] }).catch(() => {})
          }
        })

      } catch (error) {
        this.client.log('error', error)
        await interaction.editReply({ content: '❌ Ocurrió un error.', embeds: [], components: [] })
      }

    } catch (error) {
      this.client.log('error', error)
      await interaction.editReply('❌ Error al buscar estaciones de radio.')
    }
  }
}
