const SpotifyWebApi = require('spotify-web-api-node')

class SpotifyAPI {
  constructor() {
    this.spotifyApi = new SpotifyWebApi({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET
    })
    this.tokenExpirationTime = 0
  }

  async authenticate() {
    try {
      const data = await this.spotifyApi.clientCredentialsGrant()
      this.spotifyApi.setAccessToken(data.body['access_token'])
      this.tokenExpirationTime = Date.now() + (data.body['expires_in'] * 1000)
      return true
    } catch (error) {
      console.error('Spotify authentication error:', error)
      return false
    }
  }

  async ensureAuthenticated() {
    if (Date.now() >= this.tokenExpirationTime - 60000) {
      await this.authenticate()
    }
  }

  async searchTracks(query, limit = 10) {
    await this.ensureAuthenticated()
    try {
      const data = await this.spotifyApi.searchTracks(query, { limit })
      return data.body.tracks.items.map(track => ({
        id: track.id,
        name: track.name,
        artist: track.artists.map(a => a.name).join(', '),
        album: track.album.name,
        duration: track.duration_ms,
        url: track.external_urls.spotify,
        preview_url: track.preview_url,
        image: track.album.images[0]?.url,
        uri: track.uri
      }))
    } catch (error) {
      console.error('Spotify search error:', error)
      return []
    }
  }

  async getTrack(trackId) {
    await this.ensureAuthenticated()
    try {
      const data = await this.spotifyApi.getTrack(trackId)
      const track = data.body
      return {
        id: track.id,
        name: track.name,
        artist: track.artists.map(a => a.name).join(', '),
        album: track.album.name,
        duration: track.duration_ms,
        url: track.external_urls.spotify,
        preview_url: track.preview_url,
        image: track.album.images[0]?.url,
        uri: track.uri,
        popularity: track.popularity
      }
    } catch (error) {
      console.error('Spotify get track error:', error)
      return null
    }
  }

  async getPlaylist(playlistId) {
    await this.ensureAuthenticated()
    try {
      const data = await this.spotifyApi.getPlaylist(playlistId)
      const playlist = data.body
      return {
        id: playlist.id,
        name: playlist.name,
        description: playlist.description,
        owner: playlist.owner.display_name,
        tracks: playlist.tracks.items.map(item => ({
          id: item.track.id,
          name: item.track.name,
          artist: item.track.artists.map(a => a.name).join(', '),
          duration: item.track.duration_ms,
          url: item.track.external_urls.spotify
        })),
        image: playlist.images[0]?.url,
        url: playlist.external_urls.spotify
      }
    } catch (error) {
      console.error('Spotify get playlist error:', error)
      return null
    }
  }

  async getArtist(artistId) {
    await this.ensureAuthenticated()
    try {
      const data = await this.spotifyApi.getArtist(artistId)
      const artist = data.body
      return {
        id: artist.id,
        name: artist.name,
        genres: artist.genres,
        popularity: artist.popularity,
        followers: artist.followers.total,
        image: artist.images[0]?.url,
        url: artist.external_urls.spotify
      }
    } catch (error) {
      console.error('Spotify get artist error:', error)
      return null
    }
  }

  async getArtistTopTracks(artistId, country = 'US') {
    await this.ensureAuthenticated()
    try {
      const data = await this.spotifyApi.getArtistTopTracks(artistId, country)
      return data.body.tracks.map(track => ({
        id: track.id,
        name: track.name,
        artist: track.artists.map(a => a.name).join(', '),
        album: track.album.name,
        duration: track.duration_ms,
        url: track.external_urls.spotify,
        preview_url: track.preview_url,
        image: track.album.images[0]?.url
      }))
    } catch (error) {
      console.error('Spotify get artist top tracks error:', error)
      return []
    }
  }

  async getRecommendations(seedTracks = [], seedArtists = [], seedGenres = [], limit = 20) {
    await this.ensureAuthenticated()
    try {
      const data = await this.spotifyApi.getRecommendations({
        seed_tracks: seedTracks,
        seed_artists: seedArtists,
        seed_genres: seedGenres,
        limit
      })
      return data.body.tracks.map(track => ({
        id: track.id,
        name: track.name,
        artist: track.artists.map(a => a.name).join(', '),
        album: track.album.name,
        duration: track.duration_ms,
        url: track.external_urls.spotify,
        preview_url: track.preview_url,
        image: track.album.images[0]?.url
      }))
    } catch (error) {
      console.error('Spotify get recommendations error:', error)
      return []
    }
  }
}

module.exports = new SpotifyAPI()
