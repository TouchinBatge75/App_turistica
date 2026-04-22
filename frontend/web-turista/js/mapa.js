let map;
let marcadorGuia;
let ruta;
let posicionActual = null;

// 🔵 ICONOS
const iconoInicio = L.icon({
    iconUrl: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
    iconSize: [32, 32]
});

const iconoNormal = L.icon({
    iconUrl: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
    iconSize: [32, 32]
});

const iconoFinal = L.icon({
    iconUrl: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
    iconSize: [32, 32]
});


// 🚀 INICIAR MAPA
function initMap(lat, lng) {
    map = L.map('map').setView([lat, lng], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
    }).addTo(map);
}


// 📍 MARCADORES
function agregarMarcador(punto, index, total) {

    let icono = iconoNormal;

    if (index === 0) icono = iconoInicio;
    if (index === total - 1) icono = iconoFinal;

    L.marker(
        [parseFloat(punto.latitud), parseFloat(punto.longitud)],
        { icon: icono }
    )
    .addTo(map)
    .bindPopup(`<b>${punto.nombre}</b>`);
}


// 🛣️ RUTA
function dibujarRuta(puntos) {

    const coordenadas = puntos.map(p => [
        parseFloat(p.latitud),
        parseFloat(p.longitud)
    ]);

    if (ruta) {
        map.removeLayer(ruta);
    }

    ruta = L.polyline(coordenadas, {
        color: 'blue',
        weight: 4
    }).addTo(map);

    map.fitBounds(ruta.getBounds());
}


// 🧍‍♂️ ACTUALIZAR GUÍA
function actualizarGuia(lat, lng) {

    const nuevaPosicion = [lat, lng];

    // primera vez
    if (!marcadorGuia) {
        marcadorGuia = L.marker(nuevaPosicion)
            .addTo(map)
            .bindPopup("Guía en tiempo real");

        posicionActual = nuevaPosicion;
        return;
    }

    // animación
    animarMovimiento(posicionActual, nuevaPosicion);

    posicionActual = nuevaPosicion;
}


// 🎬 ANIMACIÓN SUAVE
function animarMovimiento(origen, destino) {

    let pasos = 20;
    let i = 0;

    const latDiff = (destino[0] - origen[0]) / pasos;
    const lngDiff = (destino[1] - origen[1]) / pasos;

    const intervalo = setInterval(() => {

        if (i >= pasos) {
            clearInterval(intervalo);
            return;
        }

        const nuevaLat = origen[0] + latDiff * i;
        const nuevaLng = origen[1] + lngDiff * i;

        marcadorGuia.setLatLng([nuevaLat, nuevaLng]);

        i++;

    }, 100);
}

function irAlGuia(lat, lng) {
    map.setView([lat, lng], 17, { animate: true });
}