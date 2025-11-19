// BABA RADIO - API Integrations
// All music and radio APIs in one place

module.exports = {
  // Music APIs
  spotify: require('./spotify'),
  jamendo: require('./jamendo'),
  theaudiodb: require('./theaudiodb'),
  
  // Radio APIs
  zenofm: require('./zenofm'),
  radiogarden: require('./radiogarden'),
  
  // Note: iHeartRadio, TuneIn, and Radio Browser are already integrated in radio.js command
}
