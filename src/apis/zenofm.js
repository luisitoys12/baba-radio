const axios = require('axios')

class ZenoFMAPI {
  constructor() {
    this.baseURL = 'https://zeno.fm/api'
  }

  async searchStations(query, limit = 20) {
    try {
      const response = await axios.get(`${this.baseURL}/stations/search`, {
        params: {
          query,
          limit
        }
      })
      return response.data.map(station => ({
        id: station.id,
        name: station.name,
        description: station.description,
        stream_url: `https://stream.zeno.fm/${station.id}`,
        website: station.website,
        logo: station.logo_url,
        genre: station.genre,
        country: station.country,
        language: station.language,
        listeners: station.listeners || 0
      }))
    } catch (error) {
      console.error('Zeno.FM search error:', error.message)
      return []
    }
  }

  async getStation(stationId) {
    try {
      const response = await axios.get(`${this.baseURL}/stations/${stationId}`)
      const station = response.data
      return {
        id: station.id,
        name: station.name,
        description: station.description,
        stream_url: `https://stream.zeno.fm/${station.id}`,
        website: station.website,
        logo: station.logo_url,
        genre: station.genre,
        country: station.country,
        language: station.language,
        listeners: station.listeners || 0,
        now_playing: station.now_playing
      }
    } catch (error) {
      console.error('Zeno.FM get station error:', error.message)
      return null
    }
  }

  async getPopularStations(limit = 20) {
    try {
      const response = await axios.get(`${this.baseURL}/stations/popular`, {
        params: { limit }
      })
      return response.data.map(station => ({
        id: station.id,
        name: station.name,
        description: station.description,
        stream_url: `https://stream.zeno.fm/${station.id}`,
        logo: station.logo_url,
        genre: station.genre,
        listeners: station.listeners || 0
      }))
    } catch (error) {
      console.error('Zeno.FM get popular stations error:', error.message)
      return []
    }
  }

  async getStationsByGenre(genre, limit = 20) {
    try {
      const response = await axios.get(`${this.baseURL}/stations/genre/${genre}`, {
        params: { limit }
      })
      return response.data.map(station => ({
        id: station.id,
        name: station.name,
        description: station.description,
        stream_url: `https://stream.zeno.fm/${station.id}`,
        logo: station.logo_url,
        listeners: station.listeners || 0
      }))
    } catch (error) {
      console.error('Zeno.FM get stations by genre error:', error.message)
      return []
    }
  }

  async getStationsByCountry(country, limit = 20) {
    try {
      const response = await axios.get(`${this.baseURL}/stations/country/${country}`, {
        params: { limit }
      })
      return response.data.map(station => ({
        id: station.id,
        name: station.name,
        description: station.description,
        stream_url: `https://stream.zeno.fm/${station.id}`,
        logo: station.logo_url,
        genre: station.genre,
        listeners: station.listeners || 0
      }))
    } catch (error) {
      console.error('Zeno.FM get stations by country error:', error.message)
      return []
    }
  }

  getStreamURL(stationId) {
    return `https://stream.zeno.fm/${stationId}`
  }
}

module.exports = new ZenoFMAPI()
