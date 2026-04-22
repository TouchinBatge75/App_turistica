const token = localStorage.getItem("token");
const guia = JSON.parse(localStorage.getItem("guia"));
const mensajePanel = document.getElementById("mensajePanel");

let puntosTour = [];
let progresoActual = null;

if (!token) {
    window.location.href = "login.html";
}

document.getElementById("info-guia").textContent =
    guia ? `Bienvenido, ${guia.nombre}` : "Guía";

document.getElementById("btnAviso").addEventListener("click", async () => {
    const idTour = document.getElementById("idTour").value;
    const mensaje = document.getElementById("mensajeAviso").value;

    if (!mensaje.trim()) {
        mensajePanel.textContent = "Escribe un aviso antes de enviarlo";
        return;
    }

    try {
        const res = await fetch("http://localhost:3000/api/avisos/crear", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify({
                id_tour: idTour,
                mensaje: mensaje,
                tipo: "info"
            })
        });

        const data = await res.json();
        mensajePanel.textContent = data.mensaje || data.error;

    } catch (error) {
        console.error(error);
        mensajePanel.textContent = "Error al enviar aviso";
    }
});

document.getElementById("btnActualizar").addEventListener("click", async () => {
    const idTour = document.getElementById("idTour").value;
    const idPuntoActual = document.getElementById("idPuntoActual").value;
    const latitud = document.getElementById("latitud").value;
    const longitud = document.getElementById("longitud").value;

    try {
        const res = await fetch(`http://localhost:3000/api/progreso/${idTour}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify({
                id_punto_actual: idPuntoActual,
                latitud_actual: latitud,
                longitud_actual: longitud
            })
        });

        const data = await res.json();
        mensajePanel.textContent = data.mensaje || data.error;
        await cargarProgresoActual();

    } catch (error) {
        console.error(error);
        mensajePanel.textContent = "Error al actualizar progreso";
    }
});

async function cargarPuntosTour() {
    const idTour = document.getElementById("idTour").value;

    try {
        const res = await fetch(`http://localhost:3000/api/tours/${idTour}/puntos`);
        puntosTour = await res.json();

        console.log("Puntos del tour:", puntosTour);

    } catch (error) {
        console.error(error);
        mensajePanel.textContent = "Error al cargar puntos del tour";
    }
}

async function cargarProgresoActual() {
    const idTour = document.getElementById("idTour").value;

    try {
        const res = await fetch(`http://localhost:3000/api/progreso/${idTour}`);
        progresoActual = await res.json();

        if (progresoActual && progresoActual.id_punto_actual) {
            const punto = puntosTour.find(p => p.id_punto == progresoActual.id_punto_actual);

            document.getElementById("puntoActualTexto").textContent =
                punto
                    ? `Punto actual: ${punto.nombre}`
                    : `Punto actual: ${progresoActual.id_punto_actual}`;
        } else {
            document.getElementById("puntoActualTexto").textContent = "Punto actual: --";
        }

    } catch (error) {
        console.error(error);
        mensajePanel.textContent = "Error al cargar progreso";
    }
}

async function avanzarSiguientePunto() {
    const idTour = document.getElementById("idTour").value;

    if (!puntosTour.length) {
        mensajePanel.textContent = "No hay puntos cargados para este tour";
        return;
    }

    let siguientePunto = null;

    if (!progresoActual || !progresoActual.id_punto_actual) {
        siguientePunto = puntosTour[0];
    } else {
        const indexActual = puntosTour.findIndex(
            p => p.id_punto == progresoActual.id_punto_actual
        );

        if (indexActual !== -1 && indexActual < puntosTour.length - 1) {
            siguientePunto = puntosTour[indexActual + 1];
        } else {
            mensajePanel.textContent = "Ya estás en el último punto del recorrido";
            return;
        }
    }

    try {
        const res = await fetch(`http://localhost:3000/api/progreso/${idTour}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify({
                id_punto_actual: siguientePunto.id_punto,
                latitud_actual: siguientePunto.latitud,
                longitud_actual: siguientePunto.longitud
            })
        });

        const data = await res.json();
        mensajePanel.textContent = data.mensaje || data.error;

        await cargarProgresoActual();

    } catch (error) {
        console.error(error);
        mensajePanel.textContent = "Error al avanzar al siguiente punto";
    }
}

document.getElementById("btnSiguientePunto").addEventListener("click", avanzarSiguientePunto);


document.getElementById("idTour").addEventListener("change", async () => {
    await cargarPuntosTour();
    await cargarProgresoActual();
});

(async function iniciarPanel() {
    await cargarPuntosTour();
    await cargarProgresoActual();
})();