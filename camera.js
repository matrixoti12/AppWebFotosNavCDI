let streamRef = null;
let isFrontCamera = false;
let photoData = null;

// Elementos del DOM
const form = document.getElementById('studentForm');
const video = document.getElementById('camera');
const canvas = document.getElementById('snapshot');
const takePhotoBtn = document.getElementById('takePhoto');
const capturedPhoto = document.getElementById('capturedPhoto');
const cameraSwitchBtn = document.getElementById('cameraSwitch');

// Inicializar cámara
async function startCamera(useFrontCamera = false) {
    try {
        if (streamRef) {
            streamRef.getTracks().forEach(track => track.stop());
        }

        const stream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: useFrontCamera ? 'user' : 'environment',
                width: { ideal: 1280 },
                height: { ideal: 720 }
            }
        });

        video.srcObject = stream;
        streamRef = stream;
        await video.play();
        isFrontCamera = useFrontCamera;
        takePhotoBtn.disabled = false;
    } catch (error) {
        console.error('Error al acceder a la cámara:', error);
        mostrarMensaje('No se pudo acceder a la cámara', 'error');
    }
}

// Cambiar cámara
cameraSwitchBtn.addEventListener('click', () => {
    startCamera(!isFrontCamera);
});

// Tomar foto
takePhotoBtn.addEventListener('click', () => {
    if (!streamRef) {
        mostrarMensaje('Cámara no disponible', 'error');
        return;
    }

    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    if (isFrontCamera) {
        context.translate(canvas.width, 0);
        context.scale(-1, 1);
    }
    
    context.drawImage(video, 0, 0);

    // Agregar metadatos visuales a la imagen
    const nombre = document.getElementById('studentName').value.trim();
    const codigo = document.getElementById('studentCode').value.trim();
    
    if (nombre && codigo) {
        // Agregar texto con metadatos en la esquina inferior
        context.scale(isFrontCamera ? -1 : 1, 1);
        context.fillStyle = 'rgba(0, 0, 0, 0.5)';
        context.fillRect(0, canvas.height - 60, canvas.width, 60);
        context.fillStyle = 'white';
        context.font = '20px Arial';
        context.textAlign = 'left';
        context.fillText(`Nombre: ${nombre}`, 10, canvas.height - 35);
        context.fillText(`Código: ${codigo}`, 10, canvas.height - 10);
    }
    
    photoData = canvas.toDataURL('image/jpeg', 0.8);
    capturedPhoto.src = photoData;
    capturedPhoto.style.display = 'block';
    
    mostrarMensaje('Foto capturada', 'success');
});

// Guardar registro
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nombre = document.getElementById('studentName').value.trim();
    const codigo = document.getElementById('studentCode').value.trim();

    if (!nombre || !codigo) {
        mostrarMensaje('Completa nombre y código', 'error');
        return;
    }

    if (!photoData) {
        mostrarMensaje('Toma una foto primero', 'error');
        return;
    }

    try {
        // Crear un input de tipo file para seleccionar la carpeta
        const input = document.createElement('input');
        input.type = 'file';
        input.webkitdirectory = true;
        input.directory = true;

        input.addEventListener('change', function() {
            if (this.files.length > 0) {
                const folder = this.files[0].path.split('\\').slice(0, -1).join('\\');
                guardarFoto(nombre, codigo, folder);
            }
        });

        input.click();
    } catch (error) {
        console.error('Error:', error);
        mostrarMensaje('Error al guardar la foto', 'error');
    }
});

// Función para guardar la foto
function guardarFoto(nombre, codigo, folder) {
    try {
        const timestamp = new Date().toISOString().split('.')[0].replace(/[:-]/g, '');
        const fileName = `${nombre}_${codigo}_${timestamp}.jpg`
            .toLowerCase()
            .replace(/\s+/g, '_')
            .replace(/[^a-z0-9_.-]/g, '');

        const link = document.createElement('a');
        link.href = photoData;
        link.download = fileName;
        link.click();

        mostrarMensaje('Foto guardada correctamente', 'success');
        
        if (confirm('¿Deseas tomar otra foto?')) {
            limpiarFormulario();
        }
    } catch (error) {
        console.error('Error al guardar:', error);
        mostrarMensaje('Error al guardar la foto', 'error');
    }
}

// Limpiar formulario
document.getElementById('clearFields').addEventListener('click', () => {
    if (confirm('¿Deseas limpiar el formulario?')) {
        limpiarFormulario();
    }
});

function limpiarFormulario() {
    form.reset();
    capturedPhoto.style.display = 'none';
    photoData = null;
    startCamera(isFrontCamera);
}

// Sistema de mensajes
function mostrarMensaje(texto, tipo = 'info') {
    const mensaje = document.createElement('div');
    mensaje.className = `mensaje mensaje-${tipo}`;
    mensaje.textContent = texto;
    
    document.body.appendChild(mensaje);
    
    requestAnimationFrame(() => {
        mensaje.classList.add('visible');
        
        setTimeout(() => {
            mensaje.classList.remove('visible');
            setTimeout(() => mensaje.remove(), 300);
        }, 2000);
    });
}

// Manejar visibilidad de la página
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        if (streamRef) {
            streamRef.getTracks().forEach(track => track.stop());
        }
    } else {
        startCamera(isFrontCamera);
    }
});

// Estilos para mensajes
const style = document.createElement('style');
style.textContent = `
    .mensaje {
        position: fixed;
        top: 1rem;
        left: 50%;
        transform: translate(-50%, -100%);
        padding: 0.75rem 1.5rem;
        border-radius: 2rem;
        background: rgba(0,0,0,0.8);
        color: white;
        font-size: 0.9rem;
        z-index: 1000;
        transition: transform 0.3s ease;
    }

    .mensaje.visible {
        transform: translate(-50%, 0);
    }

    .mensaje-success {
        background: rgba(25,135,84,0.9);
    }

    .mensaje-error {
        background: rgba(220,53,69,0.9);
    }
`;
document.head.appendChild(style);

// Iniciar con cámara trasera
startCamera(false);
