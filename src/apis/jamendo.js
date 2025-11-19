const axios = require('axios')

class JamendoAPI {
  constructor() {
    this.baseURL = 'https://api.jamendo.com/v3.0'
    this.clientId = process.env.JAMENDO_CLIENT_ID || 'baba-radio'
  }

  async searchTracks(query, limit = 10) {
    try {
      const response = await axios.get(`${this.baseURL}/tracks`, {
        params: {
          client_id: this.clientId,
          format: 'json',
          limit,
          search: query,
          include: 'musicinfo',
          audioformat: 'mp32'
        }
      })
      return response.data.results.map(track => ({
        id: track.id,
        name: track.name,
        artist: track.artist_name,
        album: track.album_name,
        duration: track.duration * 1000,
        url: track.shareurl,
        stream_url: track.audio,
        image: track.album_image,
        license: track.license_ccurl,
        tags: track.musicinfo?.tags?.genres || []
      }))
    } catch (error) {
      console.error('Jamendo search error:', error.message)
      return []
    }
  }

  async getTrack(trackId) {
    try {
      const response = await axios.get(`${this.baseURL}/tracks`, {
        params: {
          client_id: this.clientId,
          format: 'json',
          id: trackId,
          include: 'musicinfo',
          audioformat: 'mp32'
        }
      })
      if (response.data.results.length === 0) return null
      const track = response.data.results[0]
      return {
        id: track.id,
        name: track.name,
        artist: track.artist_name,
        album: track.album_name,
        duration: track.duration * 1000,
        url: track.shareurl,
        stream_url: track.audio,
        image: track.album_image,
        license: track.license_ccurl,
        tags: track.musicinfo?.tags?.genres || []
      }
    } catch (error) {
      console.error('Jamendo get track error:', error.message)
      return null
    }
  }

  async getPopularTracks(limit = 20) {
    try {
      const response = await axios.get(`${this.baseURL}/tracks`, {
        params: {
          client_id: this.clientId,
          format: 'json',
          limit,
          order: 'popularity_total',
          include: 'musicinfo',
          audioformat: 'mp32'
        }
      })
      return response.data.results.map(track => ({
        id: track.id,
        name: track.name,
        artist: track.artist_name,
        album: track.album_name,
        duration: track.duration * 1000,
        url: track.shareurl,
        stream_url: track.audio,
        image: track.album_image,
        license: track.license_ccurl
      }))
    } catch (error) {
      console.error('Jamendo get popular tracks error:', error.message)
      return []
    }
  }

  async getTracksByGenre(genre, limit = 20) {
    try {
      const response = await axios.get(`${this.baseURL}/tracks`, {
        params: {
          client_id: this.clientId,
          format: 'json',
          limit,
          tags: genre,
          include: 'musicinfo',
          audioformat: 'mp32'
        }
      })
      return response.data.results.map(track => ({
        id: track.id,
        name: track.name,
        artist: track.artist_name,
        album: track.album_name,
        duration: track.duration * 1000,
        url: track.shareurl,
        stream_url: track.audio,
        image: track.album_image,
        license: track.license_ccurl
      }))
    } catch (error) {
      console.error('Jamendo get tracks by genre error:', error.message)
      return []
    }
  }

  async getArtist(artistId) {
    try {
      const response = await axios.get(`${this.baseURL}/artists`, {
        params: {
          client_id: this.clientId,
          format: 'json',
          id: artistId
        }
      })
      if (response.data.results.length === 0) return null
      const artist = response.data.results[0]
      return {
        id: artist.id,
        name: artist.name,
        url: artist.shareurl,
        image: artist.image,
        website: artist.website
      }
    } catch (error) {
      console.error('Jamendo get artist error:', error.message)
      return null
    }
  }

  async getPlaylist(playlistId) {
    try {
      const response = await axios.get(`${this.baseURL}/playlists/tracks`, {
        params: {
          client_id: this.clientId,
          format: 'json',
          id: playlistId,
          audioformat: 'mp32'
        }
      })
      if (response.data.results.length === 0) return null
      const playlist = response.data.results[0]
      return {
        id: playlist.id,
        name: playlist.name,
        tracks: playlist.tracks.map(track => ({
          id: track.id,
          name: track.name,
          artist: track.artist_name,
          duration: track.duration * 1000,
          stream_url: track.audio
        }))
      }
    } catch (error) {
      console.error('Jamendo get playlist error:', error.message)
      return null
    }
  }
}

module.exports = new JamendoAPI()
