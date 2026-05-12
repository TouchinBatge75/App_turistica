const token = localStorage.getItem("token");
const guia = JSON.parse(localStorage.getItem("guia"));

const form = document.getElementById("formCrearTour");
const mensaje = document.getElementById("mensaje");

if (!token) {
    window.location.href = "/app-guia/login.html";
}

document.getElementById("info-guia").textContent =
    guia ? `Bienvenido, ${guia.nombre}` : "Guía";

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value;
    const descripcion = document.getElementById("descripcion").value;
    const fecha = document.getElementById("fecha").value;
    const hora = document.getElementById("hora").value;

    if (!nombre || !descripcion || !fecha || !hora) {
        mensaje.textContent = "Completa todos los campos";
        return;
    }

    try {
        const res = await fetch("http://localhost:3000/api/tours/crear", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify({
                nombre,
                descripcion,
                fecha,
                hora
            })
        });

        const data = await res.json();

        if (data.id_tour) {
            localStorage.setItem("id_tour_actual", data.id_tour);

            window.location.href = `/app-guia/panel.html?id_tour=${data.id_tour}`;
        } else {
            mensaje.textContent = data.error || "No se pudo crear el tour";
        }

    } catch (error) {
        console.error(error);
        mensaje.textContent = "Error al conectar con el servidor";
    }
});