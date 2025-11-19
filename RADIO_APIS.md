# 📻 APIs de Radio Integradas - Baba Radio

## ✅ IMPLEMENTACIÓN COMPLETA

Baba Radio ahora integra **3 APIs de radio** para ofrecer acceso a más de **100,000 estaciones** en todo el mundo.

---

## 🎙️ iHeartRadio API

### Información
- **Estaciones:** Miles de estaciones
- **Cobertura:** Principalmente USA
- **Contenido:** Música, noticias, deportes, talk shows
- **Calidad:** Alta (hasta 320kbps)

### Implementación
```javascript
const { search, streamURL } = require('iheart')
const results = await search(query)
const url = await streamURL(station)
```

### Características
- ✅ API oficial integrada
- ✅ Búsqueda por nombre
- ✅ Información detallada (ciudad, frecuencia, banda)
- ✅ Logos de alta calidad
- ✅ Streams estables

---

## 📡 TuneIn API

### Información
- **Estaciones:** 100,000+
- **Cobertura:** Global (todos los países)
- **Contenido:** Radio en vivo, podcasts, deportes
- **Calidad:** Variable (64-320kbps)

### Implementación
```javascript
// TuneIn OpenML API
const response = await axios.get('http://opml.radiotime.com/Search.ashx', {
  params: {
    query: query,
    render: 'json',
    formats: 'mp3,aac'
  }
})
```

### Características
- ✅ API pública OpenML
- ✅ Búsqueda global
- ✅ Filtros por formato (mp3, aac)
- ✅ Información de bitrate
- ✅ Deportes en vivo

### Endpoints Disponibles
- `Search.ashx` - Búsqueda de estaciones
- `Browse.ashx` - Navegar por categorías
- `Tune.ashx` - Obtener URL de stream

---

## 🌍 MyTuner (Radio Browser API)

### Información
- **Estaciones:** 50,000+
- **Cobertura:** Mundial (190+ países)
- **Contenido:** Todo tipo de radio
- **Calidad:** Variable

### Implementación
```javascript
// Radio Browser API (Community)
const response = await axios.get('https://de1.api.radio-browser.info/json/stations/search', {
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
```

### Características
- ✅ API comunitaria gratuita
- ✅ Base de datos actualizada constantemente
- ✅ Filtros avanzados (país, idioma, tags)
- ✅ Sistema de votos
- ✅ Verificación de streams rotos

### Servidores Disponibles
- `de1.api.radio-browser.info` (Alemania)
- `nl1.api.radio-browser.info` (Holanda)
- `at1.api.radio-browser.info` (Austria)

---

## 🎵 Uso en Baba Radio

### Comando Principal
```
/radio estacion:nombre [fuente:all|iheart|tunein|mytuner]
```

### Ejemplos
```
/radio estacion:rock fuente:all
/radio estacion:bbc fuente:tunein
/radio estacion:jazz fuente:mytuner
/radio estacion:kiss fm fuente:iheart
```

### Flujo de Búsqueda
1. Usuario ejecuta `/radio`
2. Bot busca en las APIs seleccionadas
3. Combina resultados (hasta 10 estaciones)
4. Muestra menú de selección
5. Usuario selecciona estación
6. Bot obtiene URL de stream
7. Reproduce en canal de voz

---

## 📊 Comparación de APIs

| Característica | iHeartRadio | TuneIn | MyTuner |
|---------------|-------------|---------|---------|
| Estaciones | Miles | 100,000+ | 50,000+ |
| Cobertura | USA | Global | Global |
| Calidad | Alta | Variable | Variable |
| API | Oficial | Pública | Comunitaria |
| Costo | Gratis | Gratis | Gratis |
| Estabilidad | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |

---

## 🔧 Configuración Técnica

### Dependencias
```json
{
  "iheart": "^3.1.1",
  "axios": "^1.13.2"
}
```

### Headers Requeridos
```javascript
// MyTuner/Radio Browser
headers: {
  'User-Agent': 'BabaRadio/4.0'
}
```

### Rate Limits
- **iHeartRadio:** Sin límite conocido
- **TuneIn:** ~100 requests/minuto
- **MyTuner:** Sin límite (comunitaria)

---

## 🎯 Ventajas de la Integración

### Para Usuarios
1. ✅ **Más opciones** - 100,000+ estaciones
2. ✅ **Cobertura global** - Todos los países
3. ✅ **Mejor disponibilidad** - Si una API falla, hay otras
4. ✅ **Variedad** - Música, noticias, deportes, podcasts
5. ✅ **Calidad** - Múltiples opciones de bitrate

### Para el Bot
1. ✅ **Redundancia** - Alta disponibilidad
2. ✅ **Escalabilidad** - Fácil agregar más APIs
3. ✅ **Flexibilidad** - Usuario elige la fuente
4. ✅ **Sin costos** - Todas las APIs son gratuitas
5. ✅ **Mantenimiento** - APIs mantenidas por terceros

---

## 📝 Información Adicional

### Comando de Información
```
/radioinfo
```
Muestra detalles sobre todas las fuentes disponibles.

### Logs
El bot registra errores de cada API por separado:
```javascript
this.client.log('error', 'iHeart search error:', e)
this.client.log('error', 'TuneIn search error:', e)
this.client.log('error', 'MyTuner search error:', e)
```

### Fallback
Si una API falla, las otras continúan funcionando:
```javascript
try {
  // Buscar en API
} catch (e) {
  // Log error pero continuar
}
```

---

## 🚀 Futuras Mejoras

### Planeadas
- [ ] Cache de resultados
- [ ] Favoritos por usuario
- [ ] Historial de reproducción
- [ ] Recomendaciones personalizadas
- [ ] Integración con Spotify/Apple Music
- [ ] Radio por geolocalización
- [ ] Filtros avanzados (género, idioma, país)

---

## 📞 Soporte

Si tienes problemas con alguna estación:
1. Prueba con otra fuente (`fuente:tunein` o `fuente:mytuner`)
2. Verifica que la estación esté activa
3. Reporta el problema con `/uptime` → Botón de reporte

---

**Desarrollador:** djluisalegre  
**Versión:** 4.0  
**Estado:** ✅ Operacional  
**Última Actualización:** 2025-11-19
