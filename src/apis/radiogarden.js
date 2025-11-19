const axios = require('axios')

class RadioGardenAPI {
  constructor() {
    this.baseURL = 'http://radio.garden/api'
  }

  async searchStations(query) {
    try {
      const response = await axios.get(`${this.baseURL}/search`, {
        params: { q: query }
      })
      if (!response.data.hits || !response.data.hits.hits) return []
      return response.data.hits.hits.map(hit => {
        const station = hit._source
        return {
          id: station.channelId,
          name: station.title,
          country: station.country,
          city: station.place,
          stream_url: this.getStreamURL(station.channelId),
          website: station.website,
          geo: {
            lat: station.geo?.[0],
            lon: station.geo?.[1]
          }
        }
      })
    } catch (error) {
      console.error('Radio Garden search error:', error.message)
      return []
    }
  }

  async getStation(stationId) {
    try {
      const response = await axios.get(`${this.baseURL}/ara/content/channel/${stationId}`)
      const station = response.data.data
      return {
        id: station.id,
        name: station.title,
        country: station.country,
        city: station.place,
        stream_url: this.getStreamURL(stationId),
        website: station.website,
        description: station.subtitle
      }
    } catch (error) {
      console.error('Radio Garden get station error:', error.message)
      return null
    }
  }

  async getStationsByPlace(placeId) {
    try {
      const response = await axios.get(`${this.baseURL}/ara/content/page/${placeId}`)
      const content = response.data.data.content
      const stations = []
      
      content.forEach(section => {
        if (section.items) {
          section.items.forEach(item => {
            if (item.page && item.page.url) {
              const channelId = item.page.url.split('/').pop()
              stations.push({
                id: channelId,
                name: item.page.title,
                stream_url: this.getStreamURL(channelId)
              })
            }
          })
        }
      })
      
      return stations
    } catch (error) {
      console.error('Radio Garden get stations by place error:', error.message)
      return []
    }
  }

  async getPlaces() {
    try {
      const response = await axios.get(`${this.baseURL}/ara/content/places`)
      return response.data.data.list.map(place => ({
        id: place.id,
        name: place.title,
        country: place.country,
        size: place.size,
        geo: {
          lat: place.geo[0],
          lon: place.geo[1]
        }
      }))
    } catch (error) {
      console.error('Radio Garden get places error:', error.message)
      return []
    }
  }

  async getPopularStations() {
    try {
      const response = await axios.get(`${this.baseURL}/ara/content/popular`)
      if (!response.data.data || !response.data.data.content) return []
      
      const stations = []
      response.data.data.content.forEach(section => {
        if (section.items) {
          section.items.forEach(item => {
            if (item.page && item.page.url) {
              const channelId = item.page.url.split('/').pop()
              stations.push({
                id: channelId,
                name: item.page.title,
                subtitle: item.page.subtitle,
                stream_url: this.getStreamURL(channelId)
              })
            }
          })
        }
      })
      
      return stations
    } catch (error) {
      console.error('Radio Garden get popular stations error:', error.message)
      return []
    }
  }

  async getCountries() {
    try {
      const response = await axios.get(`${this.baseURL}/ara/content/places`)
      const places = response.data.data.list
      const countries = {}
      
      places.forEach(place => {
        if (!countries[place.country]) {
          countries[place.country] = {
            name: place.country,
            count: 0
          }
        }
        countries[place.country].count++
      })
      
      return Object.values(countries).sort((a, b) => b.count - a.count)
    } catch (error) {
      console.error('Radio Garden get countries error:', error.message)
      return []
    }
  }

  getStreamURL(stationId) {
    return `http://radio.garden/api/ara/content/listen/${stationId}/channel.mp3`
  }
}

module.exports = new RadioGardenAPI()
