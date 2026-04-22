const API_URL = "http://localhost:3000/api";

async function getPuntos(idTour) {
    const res = await fetch(`${API_URL}/tours/${idTour}/puntos`);
    return res.json();
}

async function getProgreso(idTour) {
    const res = await fetch(`/api/progreso/${idTour}`);
    return await res.json();
}

async function getAvisos(idTour) {
    const res = await fetch(`${API_URL}/avisos/${idTour}`);
    return await res.json();
}