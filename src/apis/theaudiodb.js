const axios = require('axios')

class TheAudioDBAPI {
  constructor() {
    this.baseURL = 'https://www.theaudiodb.com/api/v1/json'
    this.apiKey = process.env.THEAUDIODB_API_KEY || '2'
  }

  async searchArtist(artistName) {
    try {
      const response = await axios.get(`${this.baseURL}/${this.apiKey}/search.php`, {
        params: { s: artistName }
      })
      if (!response.data.artists) return []
      return response.data.artists.map(artist => ({
        id: artist.idArtist,
        name: artist.strArtist,
        genre: artist.strGenre,
        style: artist.strStyle,
        biography: artist.strBiographyEN,
        formed: artist.intFormedYear,
        country: artist.strCountry,
        website: artist.strWebsite,
        facebook: artist.strFacebook,
        twitter: artist.strTwitter,
        image: artist.strArtistThumb,
        logo: artist.strArtistLogo,
        fanart: artist.strArtistFanart
      }))
    } catch (error) {
      console.error('TheAudioDB search artist error:', error.message)
      return []
    }
  }

  async getArtist(artistId) {
    try {
      const response = await axios.get(`${this.baseURL}/${this.apiKey}/artist.php`, {
        params: { i: artistId }
      })
      if (!response.data.artists || response.data.artists.length === 0) return null
      const artist = response.data.artists[0]
      return {
        id: artist.idArtist,
        name: artist.strArtist,
        genre: artist.strGenre,
        style: artist.strStyle,
        biography: artist.strBiographyEN,
        formed: artist.intFormedYear,
        country: artist.strCountry,
        website: artist.strWebsite,
        facebook: artist.strFacebook,
        twitter: artist.strTwitter,
        image: artist.strArtistThumb,
        logo: artist.strArtistLogo,
        fanart: artist.strArtistFanart,
        members: artist.intMembers
      }
    } catch (error) {
      console.error('TheAudioDB get artist error:', error.message)
      return null
    }
  }

  async getAlbum(albumId) {
    try {
      const response = await axios.get(`${this.baseURL}/${this.apiKey}/album.php`, {
        params: { m: albumId }
      })
      if (!response.data.album || response.data.album.length === 0) return null
      const album = response.data.album[0]
      return {
        id: album.idAlbum,
        name: album.strAlbum,
        artist: album.strArtist,
        year: album.intYearReleased,
        genre: album.strGenre,
        style: album.strStyle,
        description: album.strDescriptionEN,
        image: album.strAlbumThumb,
        cover: album.strAlbumCDart,
        sales: album.intSales,
        score: album.intScore,
        scoreVotes: album.intScoreVotes
      }
    } catch (error) {
      console.error('TheAudioDB get album error:', error.message)
      return null
    }
  }

  async searchAlbum(albumName) {
    try {
      const response = await axios.get(`${this.baseURL}/${this.apiKey}/searchalbum.php`, {
        params: { s: albumName }
      })
      if (!response.data.album) return []
      return response.data.album.map(album => ({
        id: album.idAlbum,
        name: album.strAlbum,
        artist: album.strArtist,
        year: album.intYearReleased,
        genre: album.strGenre,
        image: album.strAlbumThumb
      }))
    } catch (error) {
      console.error('TheAudioDB search album error:', error.message)
      return []
    }
  }

  async getArtistAlbums(artistId) {
    try {
      const response = await axios.get(`${this.baseURL}/${this.apiKey}/album.php`, {
        params: { i: artistId }
      })
      if (!response.data.album) return []
      return response.data.album.map(album => ({
        id: album.idAlbum,
        name: album.strAlbum,
        year: album.intYearReleased,
        genre: album.strGenre,
        image: album.strAlbumThumb,
        description: album.strDescriptionEN
      }))
    } catch (error) {
      console.error('TheAudioDB get artist albums error:', error.message)
      return []
    }
  }

  async getTrack(trackId) {
    try {
      const response = await axios.get(`${this.baseURL}/${this.apiKey}/track.php`, {
        params: { h: trackId }
      })
      if (!response.data.track || response.data.track.length === 0) return null
      const track = response.data.track[0]
      return {
        id: track.idTrack,
        name: track.strTrack,
        album: track.strAlbum,
        artist: track.strArtist,
        genre: track.strGenre,
        duration: track.intDuration,
        description: track.strDescriptionEN,
        musicVideo: track.strMusicVid,
        score: track.intScore,
        scoreVotes: track.intScoreVotes
      }
    } catch (error) {
      console.error('TheAudioDB get track error:', error.message)
      return null
    }
  }

  async getAlbumTracks(albumId) {
    try {
      const response = await axios.get(`${this.baseURL}/${this.apiKey}/track.php`, {
        params: { m: albumId }
      })
      if (!response.data.track) return []
      return response.data.track.map(track => ({
        id: track.idTrack,
        name: track.strTrack,
        duration: track.intDuration,
        trackNumber: track.intTrackNumber,
        musicVideo: track.strMusicVid
      }))
    } catch (error) {
      console.error('TheAudioDB get album tracks error:', error.message)
      return []
    }
  }

  async getMusicVideo(artistId) {
    try {
      const response = await axios.get(`${this.baseURL}/${this.apiKey}/mvid.php`, {
        params: { i: artistId }
      })
      if (!response.data.mvids) return []
      return response.data.mvids.map(video => ({
        id: video.idMvid,
        artist: video.strArtist,
        track: video.strTrack,
        description: video.strDescriptionEN,
        url: video.strMusicVid,
        thumbnail: video.strTrackThumb
      }))
    } catch (error) {
      console.error('TheAudioDB get music video error:', error.message)
      return []
    }
  }
}

module.exports = new TheAudioDBAPI()
