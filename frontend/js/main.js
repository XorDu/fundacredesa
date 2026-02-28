/**
 * FUNDACREDESA - main.js
 * Script principal del sitio web institucional.
 *
 * Módulos incluidos:
 *  1. Loading screen
 *  2. Navegación (menú móvil)
 *  3. Hero slider
 *  4. Carousel de noticias
 *  5. Animaciones al scroll (IntersectionObserver)
 *  6. Gráficos SVG (torta y barras)
 *  7. Mapa interactivo de Venezuela
 *  8. Chatbot IA (MagicLoops)
 *  9. Búsqueda
 */

/* ── 1. LOADING SCREEN ───────────────────────────────────────────── */
window.addEventListener('load', () => {
    const el = document.getElementById('loading');
    if (!el) return;
    setTimeout(() => {
        el.classList.add('hidden');
        setTimeout(() => el.remove(), 400);
    }, 700);
});

/* ── 2. NAVEGACIÓN MÓVIL ─────────────────────────────────────────── */
(function initNav() {
    const toggle = document.getElementById('nav-toggle');
    const navList = document.getElementById('nav-list');
    if (!toggle || !navList) return;

    toggle.addEventListener('click', () => {
        const open = navList.classList.toggle('open');
        toggle.setAttribute('aria-expanded', String(open));
    });

    navList.querySelectorAll('.site-nav__link').forEach(link =>
        link.addEventListener('click', () => navList.classList.remove('open'))
    );

    // Marcar enlace activo por URL
    const current = location.pathname.split('/').pop() || 'index.html';
    navList.querySelectorAll('.site-nav__link').forEach(link => {
        const href = link.getAttribute('href')?.split('/').pop() || '';
        if (href === current) link.classList.add('active');
    });
})();

/* ── 3. BÚSQUEDA ─────────────────────────────────────────────────── */
function buscarSitio() {
    const input = document.getElementById('search-input');
    if (!input) return;
    const term = input.value.trim();
    if (term.length > 1) {
        alert(`Búsqueda: "${term}"\n\nFuncionalidad de búsqueda completa próximamente.`);
    }
}
document.getElementById('search-input')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') buscarSitio();
});

/* ── 4. HERO SLIDER ──────────────────────────────────────────────── */
(function initSlider() {
    const track = document.getElementById('slider-track');
    if (!track) return;

    let idx = 0;
    let timer = null;

    const slides = () => track.children;
    const count = () => slides().length;

    function goTo(i) {
        idx = ((i % count()) + count()) % count();
        track.style.transform = `translateX(-${idx * 100}%)`;
    }

    function next() { goTo(idx + 1); reset(); }
    function prev() { goTo(idx - 1); reset(); }
    function reset() {
        clearInterval(timer);
        timer = setInterval(next, 5000);
    }

    // Exponer para botones HTML onclick
    window.sliderNext = next;
    window.sliderPrev = prev;

    reset();
})();

/* ── 5. CAROUSEL DE NOTICIAS ─────────────────────────────────────── */
(function initCarousel() {
    const track = document.getElementById('noticias-track');
    if (!track) return;

    let offset = 0;

    function cardWidth() {
        const card = track.querySelector('.noticia-card');
        if (!card) return 0;
        return card.offsetWidth + parseInt(getComputedStyle(track).gap || '14');
    }

    function maxOffset() {
        const cards = track.querySelectorAll('.noticia-card').length;
        const visible = window.innerWidth > 1000 ? 5
            : window.innerWidth > 700 ? 3 : 2;
        return Math.max(0, cards - visible);
    }

    function move(dir) {
        offset = Math.max(0, Math.min(offset + dir, maxOffset()));
        track.style.transform = `translateX(-${offset * cardWidth()}px)`;
    }

    // Exponer para onclick
    window.noticiasCarouselMove = move;
})();

/* ── 6. ANIMACIONES SCROLL ───────────────────────────────────────── */
(function initScrollAnimations() {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (!e.isIntersecting) return;
            const el = e.target;
            el.classList.add('visible');

            // Barras de progreso
            const bar = el.querySelector('.progress-bar');
            if (bar) {
                const w = bar.dataset.width || '50';
                requestAnimationFrame(() => { bar.style.width = w + '%'; });
            }
            observer.unobserve(el);
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.stat-card, .animate-on-scroll').forEach(el => observer.observe(el));
})();

/* ── 7. GRÁFICOS SVG ─────────────────────────────────────────────── */
function createPieChart(id, { labels, data, colors }) {
    const container = document.getElementById(id);
    if (!container) return;
    container.innerHTML = '';

    const total = data.reduce((s, v) => s + v, 0);
    const cx = 100, cy = 100, r = 78;
    let angle = 0;

    const ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('viewBox', '0 0 200 200');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.style.transform = 'rotate(-90deg)';

    data.forEach((value, i) => {
        const pct = value / total;
        const a = pct * 360;
        const [x1, y1] = polar(cx, cy, r, angle);
        const [x2, y2] = polar(cx, cy, r, angle + a);
        const large = a > 180 ? '1' : '0';
        const path = document.createElementNS(ns, 'path');
        path.setAttribute('d', `M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${large},1 ${x2},${y2} Z`);
        path.setAttribute('fill', colors[i]);
        path.setAttribute('stroke', '#fff');
        path.setAttribute('stroke-width', '1.5');
        path.style.cursor = 'pointer';
        path.addEventListener('mouseenter', () => { path.style.opacity = '.75'; });
        path.addEventListener('mouseleave', () => { path.style.opacity = '1'; });
        svg.appendChild(path);
        angle += a;
    });
    container.appendChild(svg);

    // Leyenda
    const legend = document.createElement('div');
    legend.style.cssText = 'display:flex;flex-wrap:wrap;justify-content:center;gap:.6rem;margin-top:.7rem;font-size:.72rem;';
    labels.forEach((label, i) => {
        const item = document.createElement('div');
        item.style.cssText = 'display:flex;align-items:center;gap:.35rem;';
        item.innerHTML = `<div style="width:10px;height:10px;background:${colors[i]};border-radius:2px;flex-shrink:0;"></div><span>${label} (${data[i]}%)</span>`;
        legend.appendChild(item);
    });
    container.appendChild(legend);
}

function createBarChart(id, { labels, data, colors }) {
    const container = document.getElementById(id);
    if (!container) return;
    container.innerHTML = '';

    const ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns, 'svg');
    const maxVal = Math.max(...data);
    const barW = 40, gap = 65, extraTop = 30, chartH = 160;
    const totalW = (barW + gap) * labels.length + gap;

    svg.setAttribute('viewBox', `0 0 ${totalW} ${chartH + 100 + extraTop}`);
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');

    labels.forEach((label, i) => {
        const bh = (data[i] / maxVal) * chartH;
        const x = gap + i * (barW + gap);
        const y = chartH - bh + 28 + extraTop;

        const rect = document.createElementNS(ns, 'rect');
        rect.setAttribute('x', x); rect.setAttribute('y', y);
        rect.setAttribute('width', barW); rect.setAttribute('height', bh);
        rect.setAttribute('fill', colors[i]); rect.setAttribute('rx', '5');
        rect.style.cursor = 'pointer';
        rect.addEventListener('mouseenter', () => { rect.style.opacity = '.7'; });
        rect.addEventListener('mouseleave', () => { rect.style.opacity = '1'; });
        svg.appendChild(rect);

        mkText(svg, ns, `${data[i]}%`, x + barW / 2, y - 16, 'middle', '19', 'bold', '#333');
        mkText(svg, ns, label, x + barW / 2, chartH + 85 + extraTop, 'middle', '14', 'normal', '#555');
    });
    container.appendChild(svg);
}

function mkText(svg, ns, text, x, y, anchor, size, weight, fill) {
    const t = document.createElementNS(ns, 'text');
    t.setAttribute('x', x); t.setAttribute('y', y);
    t.setAttribute('text-anchor', anchor);
    t.setAttribute('font-size', size);
    t.setAttribute('font-weight', weight);
    t.setAttribute('fill', fill);
    t.textContent = text;
    svg.appendChild(t);
}

function polar(cx, cy, r, deg) {
    const rad = (deg * Math.PI) / 180;
    return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
}

// Inicializar gráficos cuando existan los contenedores
window.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('symptoms-chart')) {
        setTimeout(() => {
            createPieChart('symptoms-chart', {
                labels: ['Ansiedad', 'Depresión', 'Ambos', 'Otros'],
                data: [35, 28, 30, 7],
                colors: ['#E87722', '#00B5CC', '#5DADE2', '#CCCCCC']
            });
            createBarChart('risk-factors-chart', {
                labels: ['Economía', 'Migración', 'Pandemia', 'Aislamiento', 'Incertidumbre'],
                data: [90, 85, 75, 70, 80],
                colors: ['#E87722', '#00B5CC', '#5DADE2', '#F5A044', '#0099AC']
            });
        }, 300);
    }
});

/* ── 8. MAPA INTERACTIVO ─────────────────────────────────────────── */
const ESTADOS = {
    'VE-A': { nombre: 'Distrito Capital', info: 'Se abordó el cuestionario digital en: Superintendencia de la Seguridad Social, Casa Petra Barreto de la Vega, CDI Pedro Fontes de Montalbán, Universidad Bolivariana de Venezuela (UBV), INASS, U.E. Pedro Fontes y UNES.' },
    'VE-B': { nombre: 'Anzoátegui', info: 'Investigación próxima a realizar.' },
    'VE-C': { nombre: 'Apure', info: 'Investigación próxima a realizar.' },
    'VE-D': { nombre: 'Aragua', info: 'Investigación próxima a realizar.' },
    'VE-E': { nombre: 'Barinas', info: 'Investigación próxima a realizar.' },
    'VE-F': { nombre: 'Bolívar', info: 'Investigación próxima a realizar.' },
    'VE-G': { nombre: 'Carabobo', info: 'Durante noviembre 2024 se realizaron visitas a FONDECO y la comunidad Charneca. En diciembre 2024 se desarrolló un taller vivencial con trabajadores de la institución y miembros de los BRAC.' },
    'VE-H': { nombre: 'Cojedes', info: 'Investigación próxima a realizar.' },
    'VE-I': { nombre: 'Falcón', info: 'Investigación próxima a realizar.' },
    'VE-J': { nombre: 'Guárico', info: 'Investigación próxima a realizar.' },
    'VE-K': { nombre: 'Lara', info: 'Investigación próxima a realizar.' },
    'VE-L': { nombre: 'Mérida', info: 'Investigación próxima a realizar.' },
    'VE-M': { nombre: 'Miranda', info: 'En noviembre 2024 se realizaron reuniones en la Sede del PSUV y en la comunidad de Charallave (municipio Cristóbal Rojas) para presentar el proyecto e inducir sobre el cuestionario digital.' },
    'VE-N': { nombre: 'Monagas', info: 'Investigación próxima a realizar.' },
    'VE-O': { nombre: 'Nueva Esparta', info: 'Investigación próxima a realizar.' },
    'VE-P': { nombre: 'Portuguesa', info: 'Investigación próxima a realizar.' },
    'VE-R': { nombre: 'Sucre', info: 'Investigación próxima a realizar.' },
    'VE-S': { nombre: 'Táchira', info: 'Investigación próxima a realizar.' },
    'VE-T': { nombre: 'Trujillo', info: 'Investigación próxima a realizar.' },
    'VE-U': { nombre: 'Yaracuy', info: 'Investigación próxima a realizar.' },
    'VE-V': { nombre: 'Zulia', info: 'Investigación próxima a realizar.' },
    'VE-W': { nombre: 'Dependencias Federales', info: 'Investigación próxima a realizar.' },
    'VE-X': { nombre: 'Vargas (La Guaira)', info: 'En noviembre 2024 se inició el abordaje gracias a representantes de la Comuna Guaicamacuto, visitando distintas casas en el sector parte baja del teleférico.' },
    'VE-Y': { nombre: 'Delta Amacuro', info: 'Investigación próxima a realizar.' },
    'VE-Z': { nombre: 'Amazonas', info: 'Investigación próxima a realizar.' }
};

window.addEventListener('DOMContentLoaded', () => {
    const panel = document.getElementById('map-info-panel');
    let selected = null;

    Object.keys(ESTADOS).forEach(id => {
        // El SVG puede estar inline en el documento
        document.querySelectorAll(`#${id}`).forEach(path => {
            path.style.cursor = 'pointer';
            path.setAttribute('tabindex', '0');
            path.setAttribute('role', 'button');
            path.setAttribute('aria-label', ESTADOS[id].nombre);

            path.addEventListener('click', () => selectEstado(id, path));
            path.addEventListener('keydown', e => {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectEstado(id, path); }
            });
        });
    });

    function selectEstado(id, path) {
        if (!panel) return;
        const estado = ESTADOS[id];
        if (!estado) return;

        // Deseleccionar anterior
        if (selected && selected !== path) {
            selected.classList.remove('map-selected');
        }
        path.classList.toggle('map-selected', true);
        selected = path;

        panel.innerHTML = `
      <h3><i class="fas fa-map-marker-alt"></i> ${estado.nombre}</h3>
      <p>${estado.info}</p>
    `;
        panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
});

/* ── 9. CHATBOT IA ───────────────────────────────────────────────── */
const AI_URL = 'https://magicloops.dev/loop/b0a77adb-d5f4-4a25-974b-0604c96891bc';

function usarPregunta(btn) {
    const input = document.getElementById('ai-input');
    if (!input) return;
    input.value = btn.textContent.trim();
    input.focus();
}

async function enviarMensajeIA(inputId = 'ai-input', msgBoxId = 'ai-messages', btnId = 'ai-send-btn') {
    const input = document.getElementById(inputId);
    const msgBox = document.getElementById(msgBoxId);
    const sendBtn = document.getElementById(btnId);
    if (!input || !msgBox) return;

    const text = input.value.trim();
    if (!text) return;

    addMsg(msgBox, text, 'user');
    input.value = '';
    if (sendBtn) { sendBtn.disabled = true; sendBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>'; }

    const typingId = 'typing-' + Date.now();
    msgBox.innerHTML += `
    <div class="ai-msg ai-msg--bot" id="${typingId}">
      <div class="ai-msg__avatar"><i class="fas fa-robot"></i></div>
      <div class="ai-msg__bubble"><div class="typing-dots"><span></span><span></span><span></span></div></div>
    </div>`;
    msgBox.scrollTop = msgBox.scrollHeight;

    try {
        const res = await fetch(AI_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: text })
        });
        document.getElementById(typingId)?.remove();
        const data = res.ok ? await res.json() : null;
        const reply = data?.answer || data?.response || data?.output
            || 'He recibido tu consulta. Por favor intenta nuevamente en unos momentos.';
        addMsg(msgBox, reply, 'bot');
    } catch {
        document.getElementById(typingId)?.remove();
        addMsg(msgBox, 'No se pudo conectar con el servidor. Verifica tu conexión.', 'bot');
    }

    if (sendBtn) { sendBtn.disabled = false; sendBtn.innerHTML = '<i class="fas fa-paper-plane"></i>' + (btnId === 'ai-send-btn' ? ' Enviar' : ''); }
    msgBox.scrollTop = msgBox.scrollHeight;
}

function addMsg(container, text, type) {
    const isUser = type === 'user';
    const div = document.createElement('div');
    div.className = `ai-msg ai-msg--${isUser ? 'user' : 'bot'}`;
    div.innerHTML = `
    <div class="ai-msg__avatar"><i class="fas fa-${isUser ? 'user' : 'robot'}"></i></div>
    <div class="ai-msg__bubble">${text}</div>`;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
}

// Enter key in main textareas
document.getElementById('ai-input')?.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); enviarMensajeIA(); }
});

/* ── 10. CHATBOT FLOTANTE GLOBAL ─────────────────────────────────── */
window.addEventListener('DOMContentLoaded', () => {
    // Injectar Burbuja Global
    const fChat = document.createElement('div');
    fChat.innerHTML = `
        <div class="chat-bubble" id="chat-bubble" title="Asistente IA Fundacredesa">
            <i class="fas fa-comment-dots"></i>
        </div>
        <div class="chat-window" id="chat-window">
            <div class="chat-window__header">
                <span><i class="fas fa-robot"></i> Asistente IA</span>
                <button class="chat-window__close" id="chat-close"><i class="fas fa-times"></i></button>
            </div>
            <div class="ai-messages" id="float-ai-messages" style="flex:1;">
                <div class="ai-msg ai-msg--bot">
                    <div class="ai-msg__avatar"><i class="fas fa-robot"></i></div>
                    <div class="ai-msg__bubble">¡Hola! Soy el asistente virtual de Fundacredesa. ¿En qué te puedo ayudar hoy?</div>
                </div>
            </div>
            <div class="ai-chat-input">
                <textarea id="float-ai-input" placeholder="Pregunta sobre estadísticas, investigaciones..." rows="1"></textarea>
                <button class="ai-chat-input__btn" id="float-ai-send" onclick="enviarMensajeIA('float-ai-input', 'float-ai-messages', 'float-ai-send')" style="padding:0 12px;">
                    <i class="fas fa-paper-plane"></i>
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(fChat);

    const bubble = document.getElementById('chat-bubble');
    const windowEl = document.getElementById('chat-window');
    const closeBtn = document.getElementById('chat-close');
    const floatInput = document.getElementById('float-ai-input');

    bubble.addEventListener('click', () => {
        windowEl.classList.add('open');
        bubble.style.display = 'none';
        floatInput.focus();
    });

    closeBtn.addEventListener('click', () => {
        windowEl.classList.remove('open');
        bubble.style.display = 'flex';
    });

    floatInput.addEventListener('keydown', e => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            enviarMensajeIA('float-ai-input', 'float-ai-messages', 'float-ai-send');
        }
    });
});

console.info('%cFundacredesa 2024 — Socializando el Saber Científico', 'color:#E87722;font-weight:bold;font-size:13px;');
