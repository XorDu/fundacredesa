/**
 * curricula.js
 * Lógica del formulario de subida de currículum vitae – FUNDACREDESA
 */

// ── OCULTAR PANTALLA DE CARGA ─────────────────────────────────────
// main.js no se carga en esta página, así que lo manejamos aquí
window.addEventListener('load', () => {
    const loading = document.getElementById('loading');
    if (loading) {
        loading.style.opacity = '0';
        loading.style.transition = 'opacity 0.4s ease';
        setTimeout(() => { loading.style.display = 'none'; }, 420);
    }
});

const CV_API = '/api/curricula';

// ── CAPTCHA MATEMÁTICO ──────────────────────────────────────────
let captchaAnswer = 0;

function generarCaptcha() {
    const ops = ['+', '-', '×'];
    const opIdx = Math.floor(Math.random() * 3);
    let a, b, result;

    a = Math.floor(Math.random() * 9) + 1;
    b = Math.floor(Math.random() * 9) + 1;

    if (opIdx === 0) {
        result = a + b;
    } else if (opIdx === 1) {
        // Aseguramos resultado positivo
        if (a < b) { let tmp = a; a = b; b = tmp; }
        result = a - b;
    } else {
        b = Math.floor(Math.random() * 5) + 1; // Máx ×5 para mantenerlo razonable
        result = a * b;
    }

    captchaAnswer = result;
    document.getElementById('captchaA').textContent = a;
    document.getElementById('captchaOp').textContent = ops[opIdx];
    document.getElementById('captchaB').textContent = b;
    document.getElementById('cv_captcha').value = '';
}

document.getElementById('captchaRefresh')?.addEventListener('click', generarCaptcha);

// ── DROP ZONE / FILE INPUT ────────────────────────────────────────
const dropZone = document.getElementById('cvDropZone');
const fileInput = document.getElementById('cv_archivo');
const dropContent = document.getElementById('cvDropContent');
const dropPreview = document.getElementById('cvDropPreview');
const fileNameEl = document.getElementById('cvFileName');
const fileSizeEl = document.getElementById('cvFileSize');
const removeBtn  = document.getElementById('cvRemoveFile');

function mostrarArchivoSeleccionado(file) {
    if (!file) return;
    const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
    fileNameEl.textContent = file.name;
    fileSizeEl.textContent = sizeMB + ' MB';
    dropContent.style.display = 'none';
    dropPreview.style.display = 'flex';
    dropZone.style.borderColor = 'var(--teal)';
    dropZone.style.background  = 'rgba(0,181,204,0.05)';
    document.getElementById('err_cv').textContent = '';
}

function quitarArchivo() {
    fileInput.value = '';
    dropContent.style.display = 'block';
    dropPreview.style.display = 'none';
    dropZone.style.borderColor = '';
    dropZone.style.background  = '';
}

fileInput?.addEventListener('change', function () {
    if (this.files.length > 0) {
        const file = this.files[0];
        if (file.type !== 'application/pdf') {
            document.getElementById('err_cv').textContent = 'Solo se aceptan archivos PDF.';
            this.value = '';
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            document.getElementById('err_cv').textContent = 'El archivo supera el límite de 5 MB.';
            this.value = '';
            return;
        }
        mostrarArchivoSeleccionado(file);
    }
});

removeBtn?.addEventListener('click', function (e) {
    e.stopPropagation();
    quitarArchivo();
});

// Drag & Drop events
dropZone?.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('drag-over');
});
dropZone?.addEventListener('dragleave', () => dropZone.classList.remove('drag-over'));
dropZone?.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('drag-over');
    const file = e.dataTransfer.files[0];
    if (file) {
        if (file.type !== 'application/pdf') {
            document.getElementById('err_cv').textContent = 'Solo se aceptan archivos PDF.';
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            document.getElementById('err_cv').textContent = 'El archivo supera el límite de 5 MB.';
            return;
        }
        // Asignar al input
        const dt = new DataTransfer();
        dt.items.add(file);
        fileInput.files = dt.files;
        mostrarArchivoSeleccionado(file);
    }
});

// ── VALIDACIÓN ────────────────────────────────────────────────────
function validarCampos() {
    let valido = true;

    const nombre = document.getElementById('cv_nombre').value.trim();
    if (!nombre || nombre.length < 3) {
        document.getElementById('err_nombre').textContent = 'Ingresa tu nombre completo (mínimo 3 caracteres).';
        document.getElementById('cv_nombre').classList.add('input-error');
        valido = false;
    } else {
        document.getElementById('err_nombre').textContent = '';
        document.getElementById('cv_nombre').classList.remove('input-error');
    }

    const cedula = document.getElementById('cv_cedula').value.trim();
    if (!cedula || !/^[VEve]-?\d{6,8}$/.test(cedula)) {
        document.getElementById('err_cedula').textContent = 'Formato inválido. Ej: V-12345678';
        document.getElementById('cv_cedula').classList.add('input-error');
        valido = false;
    } else {
        document.getElementById('err_cedula').textContent = '';
        document.getElementById('cv_cedula').classList.remove('input-error');
    }

    const email = document.getElementById('cv_email').value.trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        document.getElementById('err_email').textContent = 'Ingresa un correo electrónico válido.';
        document.getElementById('cv_email').classList.add('input-error');
        valido = false;
    } else {
        document.getElementById('err_email').textContent = '';
        document.getElementById('cv_email').classList.remove('input-error');
    }

    if (!fileInput.files || fileInput.files.length === 0) {
        document.getElementById('err_cv').textContent = 'Debes adjuntar tu CV en formato PDF.';
        valido = false;
    } else {
        document.getElementById('err_cv').textContent = '';
    }

    const respuestaCaptcha = parseInt(document.getElementById('cv_captcha').value);
    if (isNaN(respuestaCaptcha) || respuestaCaptcha !== captchaAnswer) {
        document.getElementById('err_captcha').textContent = 'Respuesta incorrecta. Verifica la operación.';
        document.getElementById('cv_captcha').classList.add('input-error');
        valido = false;
    } else {
        document.getElementById('err_captcha').textContent = '';
        document.getElementById('cv_captcha').classList.remove('input-error');
    }

    return valido;
}

// ── ENVÍO DEL FORMULARIO ──────────────────────────────────────────
document.getElementById('cvUploadForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validarCampos()) return;

    const btn = document.getElementById('cvBtnSubmit');
    const errMsg = document.getElementById('cvErrorMsg');

    btn.disabled = true;
    btn.classList.add('loading');
    btn.querySelector('span').textContent = 'Enviando...';
    errMsg.style.display = 'none';

    const formData = new FormData(e.target);

    try {
        const res = await fetch(CV_API, {
            method: 'POST',
            body: formData
        });

        const data = await res.json();

        if (res.ok) {
            document.getElementById('cvFormCard').querySelector('.cv-form').style.display = 'none';
            document.getElementById('cvSuccess').style.display = 'block';
            generarCaptcha(); // Resetear captcha para el próximo uso
        } else {
            errMsg.textContent = data.error || 'Ocurrió un error al enviar tu currículum. Por favor, inténtalo de nuevo.';
            errMsg.style.display = 'block';
            generarCaptcha(); // Regenerar captcha tras error
        }
    } catch (error) {
        console.error('Error enviando CV:', error);
        errMsg.textContent = 'No se pudo conectar con el servidor. Verifica tu conexión e inténtalo más tarde.';
        errMsg.style.display = 'block';
    } finally {
        btn.disabled = false;
        btn.classList.remove('loading');
        btn.querySelector('span').textContent = 'Enviar mi Currículum';
    }
});

// ── RESET FORM ────────────────────────────────────────────────────
window.resetCVForm = function () {
    document.getElementById('cvUploadForm').reset();
    document.getElementById('cvSuccess').style.display = 'none';
    document.getElementById('cvUploadForm').style.display = 'block';
    document.getElementById('cvErrorMsg').style.display = 'none';
    quitarArchivo();
    generarCaptcha();
};

// ── INIT ──────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    generarCaptcha();
});
