// Verificar que el DOM cargó
document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("login-form");
    const mensaje = document.getElementById("mensaje");

    if (!form) {
        console.error("No se encontró el formulario #login-form");
        return;
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        console.log("Submit de login disparado");

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        if (!email || !password) {
            mensaje.textContent = "Completa todos los campos";
            return;
        }

        try {
            const res = await fetch("http://localhost:3000/api/guias/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });

            console.log("Status:", res.status);

            const data = await res.json();
            console.log("Respuesta login:", data);

            if (data.token) {
                // Guardar sesión
                localStorage.setItem("token", data.token);
                localStorage.setItem("guia", JSON.stringify(data.guia));

                console.log("Login exitoso, redirigiendo...");

                // 🔥 IMPORTANTE: usa ruta absoluta
                window.location.href = "/app-guia/panel.html";

            } else {
                mensaje.textContent = data.error || "No se pudo iniciar sesión";
            }

        } catch (error) {
            console.error("Error login:", error);
            mensaje.textContent = "Error al conectar con el servidor";
        }
    });

});