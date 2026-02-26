// Solución: asegurar que la pantalla de carga se oculte correctamente
window.addEventListener('DOMContentLoaded', function() {
    const loading = document.getElementById('loading');
    if (loading) {
        setTimeout(() => {
            loading.classList.add('hidden');
            setTimeout(() => {
                if (loading.parentNode) loading.parentNode.removeChild(loading);
            }, 500);
        }, 1000);
    }
});
