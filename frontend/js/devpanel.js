/* ================================================================
   devpanel.js — Panel flotante del Equipo Desarrollador
   FUNDACREDESA · Inyectado en el DOM al cargar la página
   ================================================================ */

(function () {
    // ── DATOS DEL EQUIPO (Pirámide: nivel 1 arriba → nivel 3 abajo) ──────────
    const equipo = [
        // Nivel 1 – Líder del proyecto
        [
            {
                nombre: 'Valentina Rivas',
                puesto: 'Directora de Proyecto\n& Arquitectura de Software',
                rol: 'LÍDER',
                avatar: '../assets/images/avatar_valentina.png',
                lead: true
            }
        ],
        // Nivel 2 – Desarrollo core
        [
            {
                nombre: 'Sebastián López',
                puesto: 'Desarrollador Full-Stack\n& DevOps',
                rol: 'BACKEND',
                avatar: '../assets/images/avatar_sebastian.png'
            },
            {
                nombre: 'Andrés Morales',
                puesto: 'Ingeniero de IA\n& Chatbot RAG',
                rol: 'INTELIGENCIA ARTIFICIAL',
                avatar: '../assets/images/avatar_andres.png'
            }
        ],
        // Nivel 3 – Especialistas
        [
            {
                nombre: 'María Fernández',
                puesto: 'Desarrolladora Frontend\n& Diseño UI/UX',
                rol: 'FRONTEND',
                avatar: '../assets/images/avatar_maria.png'
            },
            {
                nombre: 'Carlos Mendoza',
                puesto: 'DBA & Seguridad\nde Sistemas',
                rol: 'BASE DE DATOS',
                avatar: '../assets/images/avatar_carlos.png'
            }
        ]
    ];

    // ── CONSTRUIR HTML DEL PANEL ──────────────────────────────────────────────
    function buildPanel() {
        let pyramidHTML = '';

        equipo.forEach((fila, idx) => {
            // Separador entre filas
            if (idx > 0) {
                pyramidHTML += `
                <div class="dev-separator">
                    <i class="fas fa-chevron-down" style="color:#cbd5e1;font-size:0.6rem;"></i>
                </div>`;
            }

            const rowItems = fila.map(p => `
                <div class="dev-card ${p.lead ? 'dev-card--lead' : ''}">
                    <span class="dev-role-badge">${p.rol}</span>
                    <img src="${p.avatar}" alt="${p.nombre}" class="dev-avatar"
                         onerror="this.src='../assets/images/logo_fundacredesa.png'">
                    <div class="dev-name">${p.nombre}</div>
                    <div class="dev-position">${p.puesto.replace(/\n/g, '<br>')}</div>
                </div>
            `).join('');

            pyramidHTML += `<div class="dev-row">${rowItems}</div>`;
        });

        const techChips = [
            { icon: 'fa-node-js', label: 'Node.js', brand: true },
            { icon: 'fa-database', label: 'MySQL' },
            { icon: 'fa-js-square', label: 'Vanilla JS', brand: true },
            { icon: 'fa-google', label: 'Gemini AI', brand: true },
            { icon: 'fa-server', label: 'Express.js' },
            { icon: 'fa-lock', label: 'JWT + IP Firewall' },
        ].map(t => `
            <span class="dev-chip">
                <i class="${t.brand ? 'fab' : 'fas'} ${t.icon}"></i>
                ${t.label}
            </span>
        `).join('');

        return `
        <div class="dev-overlay" id="devOverlay" role="dialog" aria-modal="true" aria-label="Equipo desarrollador">
            <div class="dev-panel" id="devPanel">
                <div class="dev-panel__header">
                    <button class="dev-panel__close" id="devClose" aria-label="Cerrar panel">
                        <i class="fas fa-times"></i>
                    </button>
                    <div class="dev-panel__badge">
                        <i class="fas fa-code"></i> Equipo de Desarrollo
                    </div>
                    <h2 class="dev-panel__title">Los que hicieron esto posible</h2>
                    <p class="dev-panel__subtitle">Plataforma Web Institucional FUNDACREDESA · 2024</p>
                </div>

                <div class="dev-pyramid">
                    ${pyramidHTML}
                </div>

                <div class="dev-tech-chips">
                    ${techChips}
                </div>

                <div class="dev-panel__footer">
                    Desarrollado con ❤️ para potenciar la investigación científica en
                    <span>Venezuela 🇻🇪</span>
                </div>
            </div>
        </div>`;
    }

    // ── INYECTAR BOTÓN EN FOOTER ──────────────────────────────────────────────
    function injectTrigger() {
        // Buscar el footer links nav para insertar el botón al lado
        const footerInner = document.querySelector('.site-footer__inner');
        if (!footerInner) return;

        // Crear el botón trigger
        const btn = document.createElement('button');
        btn.className = 'dev-trigger';
        btn.id = 'devTrigger';
        btn.setAttribute('aria-label', 'Ver equipo desarrollador');
        btn.innerHTML = '<i class="fas fa-users-cog"></i> Desarrolladores';
        footerInner.appendChild(btn);
    }

    // ── EVENTOS ──────────────────────────────────────────────────────────────
    function initEvents() {
        const trigger  = document.getElementById('devTrigger');
        const overlay  = document.getElementById('devOverlay');
        const closeBtn = document.getElementById('devClose');

        if (!trigger || !overlay) return;

        trigger.addEventListener('click', () => {
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        closeBtn?.addEventListener('click', closePanel);

        // Cerrar al hacer clic fuera del panel
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closePanel();
        });

        // Cerrar con Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && overlay.classList.contains('active')) {
                closePanel();
            }
        });
    }

    function closePanel() {
        const overlay = document.getElementById('devOverlay');
        if (!overlay) return;
        overlay.style.animation = 'none';
        overlay.style.opacity = '0';
        overlay.style.transition = 'opacity 0.2s ease';
        setTimeout(() => {
            overlay.classList.remove('active');
            overlay.style.opacity = '';
            overlay.style.transition = '';
            document.body.style.overflow = '';
        }, 200);
    }

    // ── INIT ─────────────────────────────────────────────────────────────────
    document.addEventListener('DOMContentLoaded', () => {
        // Inyectar el panel al body
        document.body.insertAdjacentHTML('beforeend', buildPanel());
        // Inyectar el botón en el footer
        injectTrigger();
        // Activar eventos
        initEvents();
    });

})();
