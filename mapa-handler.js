// Manejador de mensajes para el mapa de Venezuela
window.addEventListener("message", function(event) {
    if (event.data && event.data.info && event.data.estado) {
        document.getElementById("info-estado").innerHTML = `
            <h2 style="color:#1976d2; margin-top:0;">${event.data.estado.toUpperCase()}</h2>
            ${event.data.info}
        `;
        setTimeout(function() {
            document.getElementById("info-estado").scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
    }
});
