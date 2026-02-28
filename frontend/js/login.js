// Script para manejar el Cifrado Frontal y LocalStorage de Login

document.addEventListener('DOMContentLoaded', () => {

    // 1. Si el usuario ya está logueado, redirigirlo auto a admin
    const currentToken = localStorage.getItem('fundacredesa_jwt');
    if (currentToken) {
        window.location.href = 'admin.html';
        return;
    }

    const API_BASE = 'http://localhost:8080/api/auth/login';
    const form = document.getElementById('loginForm');
    const feedback = document.getElementById('loginFeedback');
    const btnSubmit = document.getElementById('btnSubmit');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();

        btnSubmit.disabled = true;
        btnSubmit.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Validando...';
        feedback.className = 'feedback-msg'; // Reset

        try {
            const res = await fetch(API_BASE, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await res.json();

            if (res.ok && data.token) {
                // Almacenar el JWT de manera persistente en su máquina local 
                localStorage.setItem('fundacredesa_jwt', data.token);
                // Redigir al Cuartel General de Control
                window.location.href = 'admin.html';
            } else {
                feedback.textContent = data.error || 'Credenciales incorrectas o IP Bloqueada por Firewall.';
                feedback.classList.add('error');
            }
        } catch (error) {
            console.error(error);
            feedback.textContent = 'Error de conexión con el Servidor Principal.';
            feedback.classList.add('error');
        } finally {
            btnSubmit.disabled = false;
            btnSubmit.innerHTML = '<i class="fas fa-sign-in-alt"></i> Iniciar Sesión Segura';
        }
    });

});
