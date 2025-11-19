# 🔧 Solución de Problemas de Audio - BABA RADIO

## ❌ Problema: El bot se conecta pero no reproduce audio

### Síntomas
- El bot muestra el embed "▶️ Reproduciendo Ahora"
- El bot aparece en el canal de voz
- No se escucha ningún audio

### Causas Comunes y Soluciones

#### 1. ✅ Permisos de Discord

El bot necesita los siguientes permisos en el canal de voz:

- **Ver Canal** (View Channel)
- **Conectar** (Connect)
- **Hablar** (Speak)
- **Usar Actividad de Voz** (Use Voice Activity)

**Cómo verificar:**
1. Ve a Configuración del Servidor → Roles
2. Encuentra el rol del bot
3. Asegúrate de que tenga estos permisos
4. O da permisos específicos en el canal de voz

#### 2. 🎧 Lavalink Node

**Verificar conexión:**
```bash
# Ver logs del bot
tail -f bot.log | grep Lavalink

# Buscar:
# ✅ Lavalink node ajie-v4-ssl connected!
```

**Si no hay nodo conectado:**
- Espera unos segundos, los nodos se reconectan automáticamente
- Verifica tu conexión a internet
- Usa `/debug` para ver el estado de los nodos

#### 3. 🔊 Estado del Player

**Usar comando de debug:**
```
/debug
```

Esto mostrará:
- Estado de Lavalink
- Nodos conectados
- Estado del player
- Track actual
- Canal de voz

#### 4. 🎵 Formato de Audio

**Fuentes soportadas:**
- ✅ YouTube (ytsearch:)
- ✅ Spotify (requiere plugin)
- ✅ SoundCloud
- ✅ Enlaces directos MP3/OGG/WAV
- ✅ Radio streams

**Probar con diferentes fuentes:**
```
/play never gonna give you up
/play https://www.youtube.com/watch?v=dQw4w9WgXcQ
```

#### 5. 🌐 Región del Servidor

Algunos servidores de Discord tienen problemas con ciertos nodos de Lavalink.

**Solución:**
- El bot usa múltiples nodos con failover automático
- Si un nodo falla, prueba otro automáticamente

#### 6. 🔄 Reiniciar el Player

Si el player se queda atascado:

```
/stop
/play <canción>
```

#### 7. 📡 Verificar Intents de Discord

El bot necesita estos intents habilitados:

```javascript
GatewayIntentBits.Guilds
GatewayIntentBits.GuildVoiceStates  // ← CRÍTICO
GatewayIntentBits.GuildMessages
```

**Verificar en Discord Developer Portal:**
1. Ve a https://discord.com/developers/applications
2. Selecciona tu aplicación
3. Ve a "Bot" → "Privileged Gateway Intents"
4. Asegúrate de que esté habilitado (no es privilegiado)

#### 8. 🎚️ Volumen

El volumen por defecto es 100%. Si no escuchas nada:

```
/volume 100
```

#### 9. 🔌 Conexión de Voz

**Verificar que el bot esté realmente conectado:**

1. El bot debe aparecer en la lista de miembros del canal de voz
2. Debe tener el ícono de "conectado" (verde)
3. No debe estar muteado por el servidor

#### 10. 🐛 Logs de Error

**Ver errores en tiempo real:**
```bash
tail -f bot.log | grep -E "(error|Error|ERROR)"
```

**Buscar:**
- `trackError` - Error al reproducir track
- `trackStuck` - Track atascado
- `playerDestroy` - Player destruido inesperadamente

---

## 🔍 Comandos de Diagnóstico

### `/debug` (Solo Owner)
Muestra información completa del sistema de música:
- Estado de Lavalink
- Nodos conectados
- Estado del player
- Track actual
- Canal de voz

### `/ping`
Verifica la latencia del bot

### `/botinfo`
Información general del bot

---

## 🚀 Solución Rápida

Si nada funciona, prueba estos pasos en orden:

1. **Sal y vuelve a entrar al canal de voz**
2. **Usa `/stop` y luego `/play` de nuevo**
3. **Reinicia el bot** (si tienes acceso)
4. **Verifica permisos del bot** en el canal de voz
5. **Prueba en otro canal de voz**
6. **Prueba con otra canción/fuente**

---

## 📝 Reportar Problema

Si el problema persiste, proporciona esta información:

```
/debug
```

Y comparte:
- Comando usado: `/play <qué>`
- Mensaje de error (si hay)
- Output de `/debug`
- Logs del bot (últimas 50 líneas)

---

## ✅ Verificación de Funcionamiento

**Test básico:**
```
1. Únete a un canal de voz
2. /play never gonna give you up
3. Espera 5 segundos
4. Deberías escuchar audio
```

**Si funciona:**
- ✅ Lavalink está conectado
- ✅ Permisos correctos
- ✅ Player funcionando

**Si no funciona:**
- Usa `/debug` para diagnóstico
- Revisa los logs
- Verifica permisos

---

## 🔧 Para Desarrolladores

### Verificar Raw Events

El bot necesita recibir eventos `VOICE_SERVER_UPDATE` y `VOICE_STATE_UPDATE`:

```javascript
client.on('raw', (d) => {
  if (['VOICE_SERVER_UPDATE', 'VOICE_STATE_UPDATE'].includes(d.t)) {
    console.log('Voice event:', d.t)
    client.lavalink.sendRawData(d)
  }
})
```

### Verificar Player Events

```javascript
lavalink.on('trackStart', (player, track) => {
  console.log('▶️ Playing:', track.info.title)
})

lavalink.on('trackError', (player, track, payload) => {
  console.error('❌ Error:', payload.exception)
})
```

### Test Manual

```javascript
const player = client.lavalink.getPlayer(guildId)
console.log('Player state:', {
  connected: player.connected,
  playing: player.playing,
  paused: player.paused,
  volume: player.volume,
  queue: player.queue.tracks.length
})
```

---

Made with ❤️ by the BABA RADIO Team
