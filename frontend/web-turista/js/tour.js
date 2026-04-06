const params = new URLSearchParams(window.location.search);
const idTour = params.get("id");

let turistaLat = null;
let turistaLng = null;
let alertaActiva = false;

if (!idTour) {
    document.body.innerHTML = "<h2>No se encontró el tour</h2>";
} else {
    cargarPuntos();
}

async function cargarPuntos() {

    try {

        const puntos = await getPuntos(idTour);

        const lista = document.getElementById("lista-puntos");
        lista.innerHTML = "";

        if (puntos.length > 0) {
            initMap(puntos[0].latitud, puntos[0].longitud);
        }

        puntos.forEach((p, i) => {

            const li = document.createElement("li");

            li.innerHTML = `
                <strong>${p.nombre}</strong><br>
                ${p.descripcion}<br>
                📍 ${p.latitud}, ${p.longitud}
            `;

            lista.appendChild(li);

            agregarMarcador(p, i, puntos.length);
        });

        dibujarRuta(puntos);

    } catch (error) {
        console.error(error);
        document.body.innerHTML = "<h2>Error cargando el tour</h2>";
    }

}

function obtenerUbicacionTurista() {
    navigator.geolocation.watchPosition((pos) => {
        turistaLat = pos.coords.latitude;
        turistaLng = pos.coords.longitude;
    }, (err) => {
        console.error("Error GPS:", err);
    }, {
        enableHighAccuracy: true
    });
}

// 🔄 PROGRESO
async function actualizarProgreso() {

    const progreso = await getProgreso(idTour);

    if (progreso) {

        const latGuia = parseFloat(progreso.latitud_actual);
        const lngGuia = parseFloat(progreso.longitud_actual);

        actualizarGuia(latGuia, lngGuia);

        // 👇 NUEVO: comparar distancia
        if (turistaLat && turistaLng) {

            const distancia = calcularDistancia(
                turistaLat, turistaLng,
                latGuia, lngGuia
            );

            console.log("Distancia:", distancia);

            // 🔥 200 metros
            if (distancia > 0.2 && !alertaActiva) {
                alertaActiva = true;

                alert("⚠️ Te estás alejando del grupo");

            }

            // si vuelve a acercarse
            if (distancia <= 0.2) {
                alertaActiva = false;
            }
        }
    }
}

function calcularDistancia(lat1, lon1, lat2, lon2) {
    const R = 6371; // km

    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;

    const a =
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI/180) *
        Math.cos(lat2 * Math.PI/180) *
        Math.sin(dLon/2) * Math.sin(dLon/2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c; // en km
}

// cada 5 segundos
setInterval(actualizarProgreso, 5000);

obtenerUbicacionTurista();