// ==========================================
// LÓGICA DEL PANEL DE ADMINISTRACIÓN (BACKOFFICE)
// ==========================================

const API_BASE = '/api';
let authToken = '';

document.addEventListener('DOMContentLoaded', () => {
    // 🛡️ BARRERA FRONTEND: Comprobar Token de Seguridad
    authToken = localStorage.getItem('fundacredesa_jwt');
    if (!authToken) {
        // Redirigir al infractor al login si entró con URL copiada
        window.location.href = 'login.html';
        return;
    }

    cargarCategoriasAdmin();
    cargarPublicacionesAdmin();
    cargarSlidersAdmin();
    configurarInputsArchivo();
});

// Selector de Tabs
window.showTab = function(tabName) {
    document.getElementById('tab-publicaciones').style.display = 'none';
    document.getElementById('tab-sliders').style.display = 'none';
    document.getElementById('tab-cvs').style.display = 'none';
    ['btnTabPub', 'btnTabSlider', 'btnTabCVs'].forEach(id => {
        const el = document.getElementById(id);
        if (el) { el.style.background = 'transparent'; el.style.color = 'var(--teal)'; el.style.borderColor = ''; }
    });

    const tabEl = document.getElementById('tab-' + tabName);
    if (tabEl) tabEl.style.display = (tabName === 'cvs') ? 'block' : 'flex';

    const btnMap = { publicaciones: 'btnTabPub', sliders: 'btnTabSlider', cvs: 'btnTabCVs' };
    const activeBtn = document.getElementById(btnMap[tabName]);
    if (activeBtn) {
        const color = (tabName === 'sliders') ? 'var(--orange)' : 'var(--teal)';
        activeBtn.style.background = color;
        activeBtn.style.color = '#fff';
        activeBtn.style.borderColor = color;
    }

    if (tabName === 'cvs') cargarCVsAdmin();
}

// Función centralizada para desloguearse (borrar el token)
function cerrarSesion() {
    localStorage.removeItem('fundacredesa_jwt');
    window.location.href = 'login.html';
}

// Interceptar Botón de Salir Nativo de la Plantilla
document.querySelector('.btn-logout')?.addEventListener('click', (e) => {
    e.preventDefault();
    cerrarSesion();
});

// Estética para inputs de validación visual de subida de ficheros (File)
function configurarInputsArchivo() {
    ['portada', 'pdf', 'sliderImagen'].forEach(tipo => {
        const input = document.getElementById(`${tipo}File`);
        const labelName = document.getElementById(`${tipo}Name`);
        if (input && labelName) {
            input.addEventListener('change', function () {
                if (this.files && this.files.length > 0) {
                    labelName.textContent = this.files[0].name;
                    labelName.style.color = 'var(--teal)';
                } else {
                    labelName.textContent = 'Ningún archivo subido';
                    labelName.style.color = 'var(--gray)';
                }
            });
        }
    });
}

// 1. Llenar automáticamente los 'Select' mediante Fetch de SQL Categorías
async function cargarCategoriasAdmin() {
    const select = document.getElementById('id_categoria');
    try {
        const res = await fetch(`${API_BASE}/categorias`);
        const data = await res.json();

        select.innerHTML = '<option value="">-- Seleccione Categoría --</option>';
        data.forEach(cat => {
            select.innerHTML += `<option value="${cat.id}">${cat.nombre}</option>`;
        });
    } catch (error) {
        select.innerHTML = '<option value="">Error cargando DB</option>';
        console.error("Error Obteniendo categorías", error);
    }
}

// 2. Traer Tabla de Mysql al Admin
async function cargarPublicacionesAdmin() {
    const tbody = document.getElementById('publicacionesTbody');
    tbody.innerHTML = '<tr><td colspan="6" class="ta-c">Cargando datos... <i class="fas fa-spinner fa-spin"></i></td></tr>';

    try {
        const res = await fetch(`${API_BASE}/publicaciones`);
        const data = await res.json();

        if (data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="ta-c text-muted">Aún no se han subido publicaciones.</td></tr>';
            return;
        }

        tbody.innerHTML = '';
        data.forEach(pub => {
            tbody.innerHTML += `
                <tr data-id="${pub.id}">
                    <td class="drag-handle" style="cursor:grab; color:#94a3b8"><i class="fas fa-grip-vertical"></i></td>
                    <td>#${pub.id}</td>
                    <td><img src="${pub.portada_url}" class="thumb-mini" alt="..."></td>
                    <td title="${pub.titulo}"><strong>${pub.titulo.substring(0, 30)}...</strong></td>
                    <td><span class="badge" style="background:#e2e8f0; padding:2px 6px; border-radius:4px; font-size:11px;">${pub.categoria_nombre || 'Sin categoría'}</span></td>
                    <td><b style="color:var(--orange)">${pub.prioridad}</b></td>
                    <td>
                        <button onclick="abrirModalEdicion(${pub.id}, \`${pub.titulo.replace(/`/g, '')}\`, \`${pub.descripcion.replace(/`/g, '')}\`, ${pub.id_categoria})" class="btn btn-outline" title="Editar" style="color:var(--teal); border-color:var(--teal); margin-right:5px;"><i class="fas fa-edit"></i></button>
                        <button onclick="eliminarPublicacion(${pub.id})" class="btn btn-delete" title="Eliminar"><i class="fas fa-trash"></i></button>
                    </td>
                </tr>
            `;
        });

        // Activar Sortable tras pintar los Elementos
        if (typeof Sortable !== 'undefined') initSortable();
    } catch (error) {
        tbody.innerHTML = '<tr><td colspan="6" class="ta-c text-muted">Error conectando al Servidor. Verifica que Node.js esté corriendo.</td></tr>';
    }
}

// 3. Subir Nueva Publicación a la API (POST) con FormData ()
document.getElementById('uploadForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const form = e.target;
    // Si no está el input de prioridad manual se insertará 0 temporalmente
    const formData = new FormData(form);
    const feedback = document.getElementById('uploadFeedback');
    const submitBtn = document.getElementById('btnSubmit');

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Subiendo Archivos...';
    feedback.className = 'feedback-msg';

    try {
        const res = await fetch(`${API_BASE}/publicaciones`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`
            },
            body: formData, // Fetch auto-ajusta el header a multipart/form-data
        });

        const data = await res.json();

        if (res.ok) {
            feedback.textContent = '¡Publicación subida e indexada en la Base de Datos con éxito!';
            feedback.classList.add('success');
            form.reset();
            document.getElementById('portadaName').textContent = 'Ningún archivo subido';
            document.getElementById('pdfName').textContent = 'Ningún archivo subido';
            cargarPublicacionesAdmin(); // Refresca la tabla automáticamente
        } else {
            feedback.textContent = data.error || 'Ocurrió un error al subir los archivos.';
            feedback.classList.add('error');
        }
    } catch (error) {
        feedback.textContent = 'Error crítico al contactar al servidor Localhost.';
        feedback.classList.add('error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-upload"></i> Publicar Documento';

        setTimeout(() => {
            feedback.style.display = 'none';
        }, 8000);
    }
});

// 4. Eliminar Publicación vía API
async function eliminarPublicacion(id) {
    if (!confirm('¡Atención! ¿Estás seguro que deseas eliminar esta investigación de la base de datos? (Los archivos seguirán existiendo en disco local por seguridad)')) return;

    try {
        const res = await fetch(`${API_BASE}/publicaciones/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (res.ok) {
            cargarPublicacionesAdmin(); // Refrescar 
        } else if (res.status === 401 || res.status === 403) {
            alert('Sin Permisos. Token Experiado o Inválido. Volviendo a Login.');
            cerrarSesion();
        } else {
            alert('Error eliminando la publicación del servidor');
        }
    } catch (error) {
        alert('Fallo de conexión.');
    }
}

// 5. Inicializar Drag and Drop (SortableJS) en la tabla
function initSortable() {
    const tbody = document.getElementById('publicacionesTbody');
    if (!tbody || window.sortableInstance) return;

    window.sortableInstance = new Sortable(tbody, {
        animation: 150,
        handle: '.drag-handle', // Solo arrastra por el icono
        onEnd: function () {
            document.getElementById('saveOrderBtn').style.display = 'inline-flex';
        }
    });
}

// 6. Guardar Orden (Reajuste de Prioridades Inversa)
async function guardarNuevoOrden() {
    const rows = document.querySelectorAll('#publicacionesTbody tr');
    let orderData = [];

    // El primero arriba tendrá prioridad más alta. 
    // Si hay 10 filas, la primera tendrá prioridad 10, la segunda 9, etc.
    let total = rows.length;

    rows.forEach((row, index) => {
        const id = row.getAttribute('data-id');
        orderData.push({ id: parseInt(id), nuevaPrioridad: total - index });
    });

    const btn = document.getElementById('saveOrderBtn');
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Guardando...';

    try {
        const res = await fetch(`${API_BASE}/publicaciones/reorder`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ orderData })
        });

        if (res.ok) {
            btn.innerHTML = '<i class="fas fa-check"></i> ¡Orden Guardado!';
            btn.style.color = '#10b981';
            btn.style.borderColor = '#10b981';
            setTimeout(() => {
                btn.style.display = 'none';
                btn.innerHTML = '<i class="fas fa-save"></i> Guardar Nuevo Orden';
                btn.style.color = 'var(--teal)';
                btn.style.borderColor = 'var(--teal)';
            }, 2000);
            cargarPublicacionesAdmin(); // Refrescar visual localmente
        } else {
            alert('Falló el reordenamiento protegido.');
        }
    } catch (e) {
        alert('Fallo de conexión al enviar el nuevo orden.');
    }
}

// 7. Funciones del Modal de Edición
window.abrirModalEdicion = function (id, titulo, descripcion, id_categoria) {
    document.getElementById('edit_id').value = id;
    document.getElementById('edit_titulo').value = titulo;
    document.getElementById('edit_desc').value = descripcion;

    // Clonar las categorías actuales hacia el selector del modal
    const catOriginal = document.getElementById('id_categoria').innerHTML;
    const catEdit = document.getElementById('edit_categoria');
    catEdit.innerHTML = catOriginal;
    catEdit.value = id_categoria;

    document.getElementById('editModal').style.display = 'block';
};

window.cerrarModalEdicion = function () {
    document.getElementById('editModal').style.display = 'none';
};

// 8. Enviar Edición al Servidor
document.getElementById('editForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('btnSaveEdit');
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Guardando...';
    btn.disabled = true;

    const id = document.getElementById('edit_id').value;
    const data = {
        titulo: document.getElementById('edit_titulo').value,
        descripcion: document.getElementById('edit_desc').value,
        id_categoria: document.getElementById('edit_categoria').value
    };

    try {
        const res = await fetch(`${API_BASE}/publicaciones/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (res.ok) {
            cerrarModalEdicion();
            cargarPublicacionesAdmin();
        } else if (res.status === 401 || res.status === 403) {
            alert('Sin Permisos. Token Inválido o IP Bloqueada.');
            cerrarSesion();
        } else {
            alert('Error en el backend al modificar datos.');
        }
    } catch (error) {
        alert('Fallo de conexión al enviar edición.');
    } finally {
        btn.innerHTML = '<i class="fas fa-save"></i> Guardar Cambios';
        btn.disabled = false;
    }
});

// ==========================================
// HERO SLIDERS: LOGICA DE ADMINISTRACIÓN
// ==========================================

// Cargar Sliders
async function cargarSlidersAdmin() {
    const tbody = document.getElementById('slidersTbody');
    if (!tbody) return;
    tbody.innerHTML = '<tr><td colspan="6" class="ta-c">Cargando datos... <i class="fas fa-spinner fa-spin"></i></td></tr>';

    try {
        const res = await fetch(`${API_BASE}/sliders`);
        const data = await res.json();

        if (data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="ta-c text-muted">Aún no se han subido sliders.</td></tr>';
            return;
        }

        tbody.innerHTML = '';
        data.forEach(slider => {
            tbody.innerHTML += `
                <tr data-id="${slider.id}">
                    <td class="drag-handle-slider" style="cursor:grab; color:#94a3b8"><i class="fas fa-grip-vertical"></i></td>
                    <td>#${slider.id}</td>
                    <td><img src="${slider.imagen_url}" class="thumb-mini" style="max-width:80px;border-radius:4px" alt="..."></td>
                    <td title="${slider.titulo}"><strong>${slider.titulo.substring(0, 30)}...</strong></td>
                    <td><b style="color:var(--orange)">${slider.prioridad}</b></td>
                    <td>
                        <button onclick="abrirModalEdicionSlider(${slider.id}, \`${slider.titulo.replace(/`/g, '')}\`, \`${slider.descripcion.replace(/`/g, '')}\`)" class="btn btn-outline" title="Editar" style="color:var(--orange); border-color:var(--orange); margin-right:5px;"><i class="fas fa-edit"></i></button>
                        <button onclick="eliminarSlider(${slider.id})" class="btn btn-delete" title="Eliminar"><i class="fas fa-trash"></i></button>
                    </td>
                </tr>
            `;
        });

        if (typeof Sortable !== 'undefined') initSliderSortable();
    } catch (error) {
        tbody.innerHTML = '<tr><td colspan="6" class="ta-c text-muted">Error conectando al Servidor.</td></tr>';
    }
}

// Subir Slider (POST)
document.getElementById('uploadSliderForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const feedback = document.getElementById('uploadSliderFeedback');
    const submitBtn = document.getElementById('btnSubmitSlider');

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Subiendo...';
    feedback.className = 'feedback-msg';

    try {
        const res = await fetch(`${API_BASE}/sliders`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${authToken}` },
            body: formData,
        });
        const data = await res.json();
        if (res.ok) {
            feedback.textContent = '¡Slider subido con éxito!';
            feedback.classList.add('success');
            form.reset();
            document.getElementById('sliderImagenName').textContent = 'Ningún archivo subido';
            cargarSlidersAdmin();
        } else {
            feedback.textContent = data.error || 'Ocurrió un error al subir el slider.';
            feedback.classList.add('error');
        }
    } catch (error) {
        feedback.textContent = 'Error de conexión.';
        feedback.classList.add('error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-upload"></i> Publicar Slider';
        setTimeout(() => feedback.style.display = 'none', 8000);
    }
});

// Eliminar Slider
async function eliminarSlider(id) {
    if (!confirm('¿Seguro que deseas eliminar este slider?')) return;
    try {
        const res = await fetch(`${API_BASE}/sliders/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        if (res.ok) {
            cargarSlidersAdmin();
        } else {
            alert('Error eliminando el slider.');
        }
    } catch (error) {
        alert('Fallo de conexión.');
    }
}

// Drag & Drop Sliders
function initSliderSortable() {
    const tbody = document.getElementById('slidersTbody');
    if (!tbody || window.sliderSortableInstance) return;
    window.sliderSortableInstance = new Sortable(tbody, {
        animation: 150,
        handle: '.drag-handle-slider',
        onEnd: function () {
            document.getElementById('saveSliderOrderBtn').style.display = 'inline-flex';
        }
    });
}

// Guardar Orden Sliders
async function guardarNuevoOrdenSliders() {
    const rows = document.querySelectorAll('#slidersTbody tr');
    let orderData = [];
    let total = rows.length;
    rows.forEach((row, index) => {
        const id = row.getAttribute('data-id');
        orderData.push({ id: parseInt(id), nuevaPrioridad: total - index });
    });

    const btn = document.getElementById('saveSliderOrderBtn');
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Guardando...';

    try {
        const res = await fetch(`${API_BASE}/sliders/reorder`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ orderData })
        });
        if (res.ok) {
            btn.innerHTML = '<i class="fas fa-check"></i> ¡Orden Guardado!';
            btn.style.color = '#10b981';
            btn.style.borderColor = '#10b981';
            setTimeout(() => {
                btn.style.display = 'none';
                btn.innerHTML = '<i class="fas fa-save"></i> Guardar Orden Sliders';
                btn.style.color = 'var(--orange)';
                btn.style.borderColor = 'var(--orange)';
            }, 2000);
            cargarSlidersAdmin();
        } else {
            alert('Falló el reordenamiento.');
        }
    } catch (e) {
        alert('Fallo de conexión.');
    }
}

// ==========================================
// EDICIÓN DE SLIDERS MODAL 
// ==========================================

window.abrirModalEdicionSlider = function (id, titulo, descripcion) {
    document.getElementById('edit_slider_id').value = id;
    document.getElementById('edit_slider_titulo').value = titulo;
    document.getElementById('edit_slider_desc').value = descripcion;
    document.getElementById('editSliderModal').style.display = 'block';
};

window.cerrarModalEdicionSlider = function () {
    document.getElementById('editSliderModal').style.display = 'none';
};

document.getElementById('editSliderForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('btnSaveEditSlider');
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Guardando...';
    btn.disabled = true;

    const id = document.getElementById('edit_slider_id').value;
    const data = {
        titulo: document.getElementById('edit_slider_titulo').value,
        descripcion: document.getElementById('edit_slider_desc').value
    };

    try {
        const res = await fetch(`${API_BASE}/sliders/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (res.ok) {
            cerrarModalEdicionSlider();
            cargarSlidersAdmin();
        } else if (res.status === 401 || res.status === 403) {
            alert('Sin Permisos. Token Inválido o IP Bloqueada.');
            cerrarSesion();
        } else {
            alert('Error en el backend al modificar datos del slider.');
        }
    } catch (error) {
        alert('Fallo de conexión al enviar edición.');
    } finally {
        btn.innerHTML = '<i class="fas fa-save"></i> Guardar Cambios';
        btn.disabled = false;
    }
});

// ==========================================
// CURRÍCULUMS (CVs) - PANEL ADMIN
// ==========================================

function formatearFecha(isoStr) {
    if (!isoStr) return '-';
    const d = new Date(isoStr);
    const dia  = String(d.getDate()).padStart(2, '0');
    const mes  = String(d.getMonth() + 1).padStart(2, '0');
    const anio = d.getFullYear();
    const hora = String(d.getHours()).padStart(2, '0');
    const min  = String(d.getMinutes()).padStart(2, '0');
    return `${dia}/${mes}/${anio} ${hora}:${min}`;
}

async function cargarCVsAdmin() {
    const tbody = document.getElementById('cvsTbody');
    const countEl = document.getElementById('cvCount');
    if (!tbody) return;
    tbody.innerHTML = '<tr><td colspan="9" class="ta-c">Cargando... <i class="fas fa-spinner fa-spin"></i></td></tr>';

    try {
        const res = await fetch(`${API_BASE}/curricula`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });

        if (res.status === 401 || res.status === 403) {
            tbody.innerHTML = '<tr><td colspan="9" class="ta-c text-muted">Acceso denegado. Inicia sesión nuevamente.</td></tr>';
            return;
        }

        const data = await res.json();

        if (countEl) countEl.textContent = `${data.length} currículum${data.length !== 1 ? 's' : ''} recibido${data.length !== 1 ? 's' : ''}`;

        if (data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="9" class="ta-c text-muted">Aún no se han recibido currículums.</td></tr>';
            return;
        }

        tbody.innerHTML = '';
        data.forEach(cv => {
            const fechaFormateada = formatearFecha(cv.fecha_subida);
            tbody.innerHTML += `
                <tr>
                    <td><b style="color:var(--gray-light)">#${cv.id}</b></td>
                    <td title="${cv.nombre}">${cv.nombre}</td>
                    <td><span class="badge-cedula">${cv.cedula}</span></td>
                    <td title="${cv.email}"><a href="mailto:${cv.email}">${cv.email}</a></td>
                    <td>${cv.telefono || '<span style="color:#ccc">\u2014</span>'}</td>
                    <td>${cv.area ? `<span class="badge-area" title="${cv.area}">${cv.area}</span>` : '<span style="color:#ccc">\u2014</span>'}</td>
                    <td>
                        <span class="fecha-cell">
                            <i class="fas fa-calendar-alt"></i>
                            ${fechaFormateada}
                        </span>
                    </td>
                    <td>
                        <a href="${cv.cv_pdf_url}" target="_blank" class="btn-cv">
                            <i class="fas fa-file-pdf"></i> Ver CV
                        </a>
                    </td>
                    <td>
                        <button onclick="eliminarCV(${cv.id})" class="btn-del" title="Eliminar CV">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        });
    } catch (error) {
        tbody.innerHTML = '<tr><td colspan="9" class="ta-c text-muted">Error conectando al servidor.</td></tr>';
    }
}

async function eliminarCV(id) {
    if (!confirm('¿Seguro que deseas eliminar este currículum? Esta acción es irreversible.')) return;
    try {
        const res = await fetch(`${API_BASE}/curricula/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        if (res.ok) {
            cargarCVsAdmin();
        } else if (res.status === 401 || res.status === 403) {
            alert('Sin Permisos. Token inválido.');
            cerrarSesion();
        } else {
            alert('Error al eliminar el CV.');
        }
    } catch (error) {
        alert('Fallo de conexión.');
    }
}
