const params = new URLSearchParams(window.location.search);
const idTour = params.get("id");

let turistaLat = 18.849289;
let turistaLng = -97.105461;

let alertaActiva = false;
let ultimaLatGuia = null;
let ultimaLngGuia = null;

let listaPuntos = [];

if (!idTour) {
    document.body.innerHTML = "<h2>No se encontró el tour</h2>";
} else {
    cargarPuntos();
}

async function cargarPuntos() {
    try {
        const puntos = await getPuntos(idTour);
        listaPuntos = puntos;

        const lista = document.getElementById("lista-puntos");
        lista.innerHTML = "";

        if (puntos.length > 0) {
            initMap(puntos[0].latitud, puntos[0].longitud);
        }

        puntos.forEach((p, i) => {
            const li = document.createElement("li");

            li.id = "punto-" + p.id_punto;

            li.innerHTML = `
                <strong>${p.nombre}</strong><br>
                ${p.descripcion}
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
        const idPuntoActual = progreso.id_punto_actual;

        const latGuia = parseFloat(progreso.latitud_actual);
        const lngGuia = parseFloat(progreso.longitud_actual);

        ultimaLatGuia = latGuia;
        ultimaLngGuia = lngGuia;

        actualizarGuia(latGuia, lngGuia);

        // Mostrar punto actual
        const index = listaPuntos.findIndex(p => p.id_punto == idPuntoActual);

        if (index !== -1) {
            const punto = listaPuntos[index];

            document.getElementById("nombre-punto").textContent =
                `📍 Punto actual: ${punto.nombre}`;

            document.getElementById("progreso-puntos").textContent =
                `${index + 1} de ${listaPuntos.length}`;
        }

        // Limpiar resaltado de la lista
        listaPuntos.forEach(p => {
            const el = document.getElementById("punto-" + p.id_punto);
            if (el) el.classList.remove("punto-activo");
        });

        // Resaltar actual en la lista
        const actualEl = document.getElementById("punto-" + idPuntoActual);
        if (actualEl) actualEl.classList.add("punto-activo");

        // Resaltar actual en el mapa
        resaltarMarcador(idPuntoActual);

        // Alerta de distancia
        if (turistaLat !== null && turistaLng !== null) {
            const distancia = calcularDistancia(
                turistaLat, turistaLng,
                latGuia, lngGuia
            );

            const distanciaMetros = Math.round(distancia * 1000);

            console.log("Distancia (m):", distanciaMetros);

            document.getElementById("texto-distancia").textContent =
                `Estás a ${distanciaMetros} m del guía`;

            if (distancia > 0.05 && !alertaActiva) {
                alertaActiva = true;
                mostrarAlerta();
            }

            if (distancia <= 0.05 && alertaActiva) {
                alertaActiva = false;
                ocultarAlerta();
                document.getElementById("texto-distancia").textContent = "";
                limpiarRutaAlGuia();
            }
        }
    }
}

function calcularDistancia(lat1, lon1, lat2, lon2) {
    const R = 6371;

    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
}

function mostrarAlerta() {
    const alerta = document.getElementById("alerta-distancia");
    if (alerta) {
        alerta.classList.remove("alerta-oculta");
    }
}

function ocultarAlerta() {
    const alerta = document.getElementById("alerta-distancia");
    if (alerta) {
        alerta.classList.add("alerta-oculta");
    }
}

function renderAvisos(avisos) {
    const contenedor = document.getElementById("lista-avisos");

    if (!contenedor) return;

    if (!avisos || avisos.length === 0) {
        contenedor.innerHTML = "<p>No hay avisos por el momento.</p>";
        return;
    }

    contenedor.innerHTML = "";

    avisos.forEach(aviso => {
        const div = document.createElement("div");
        div.classList.add("aviso-item");

        div.innerHTML = `
            <div class="aviso-tipo">${aviso.tipo || "info"}</div>
            <div>${aviso.mensaje}</div>
            <div class="aviso-fecha">${new Date(aviso.fecha_envio).toLocaleString()}</div>
        `;

        contenedor.appendChild(div);
    });
}


async function actualizarAvisos() {
    try {
        const avisos = await getAvisos(idTour);

        if (!avisos || avisos.length === 0) return;

        const ultimo = avisos[0];

        // evitar repetir el mismo aviso
        if (ultimoAvisoId !== ultimo.id_aviso) {
            ultimoAvisoId = ultimo.id_aviso;
            mostrarAvisoTemporal(ultimo);
        }

    } catch (error) {
        console.error("Error avisos:", error);
    }
}

let ultimoAvisoId = null;

function mostrarAvisoTemporal(aviso) {

    const cont = document.getElementById("aviso-temporal");

    cont.innerHTML = `
        <strong>${aviso.tipo || "info"}</strong><br>
        ${aviso.mensaje}
    `;

    cont.classList.remove("aviso-oculto");

    // ocultar después de 5 segundos
    setTimeout(() => {
        cont.classList.add("aviso-oculto");
    }, 5000);
}

document.getElementById("btn-ir-guia").addEventListener("click", () => {
    if (ultimaLatGuia !== null && ultimaLngGuia !== null) {
        irAlGuia(ultimaLatGuia, ultimaLngGuia);

        dibujarRutaAlGuia(
            turistaLat, turistaLng,
            ultimaLatGuia, ultimaLngGuia
        );
    }
});

// cada 5 segundos
setInterval(actualizarProgreso, 5000);
setInterval(actualizarAvisos, 5000);
actualizarAvisos();