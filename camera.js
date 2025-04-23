const form = document.getElementById('studentForm');
const video = document.getElementById('camera');
const canvas = document.getElementById('snapshot');
const takePhotoBtn = document.getElementById('takePhoto');
const capturedPhoto = document.getElementById('capturedPhoto');
const cameraSelect = document.getElementById('cameraSelect');

let photoData = "";
let streamRef = null;

// Función para mostrar mensajes de estado
function showMessage(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} position-fixed top-0 start-50 translate-middle-x mt-5`;
    alertDiv.style.zIndex = '1050';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.body.appendChild(alertDiv);
    
    setTimeout(() => alertDiv.remove(), 3000);
}

// Función para iniciar la cámara
async function startCamera(facingMode) {
    try {
        if (streamRef) {
            streamRef.getTracks().forEach(track => track.stop());
        }

        const stream = await navigator.mediaDevices.getUserMedia({
            video: { 
                facingMode: facingMode,
                width: { ideal: 1920 },
                height: { ideal: 1080 }
            }
        });
        
        video.srcObject = stream;
        streamRef = stream;
        await video.play();
    } catch (err) {
        console.error("Error al acceder a la cámara:", err);
        showMessage('Error al acceder a la cámara. Revisa los permisos.', 'danger');
    }
}

// Inicializar cámara con la opción seleccionada
cameraSelect.addEventListener('change', () => {
    const facingMode = cameraSelect.checked ? 'environment' : 'user';
    startCamera(facingMode);
});

// Iniciar cámara con opción predeterminada (cámara trasera)
startCamera('environment');
cameraSelect.checked = true;

// Capturar foto
takePhotoBtn.addEventListener('click', () => {
    if (!video.srcObject) {
        showMessage('La cámara no está activa', 'warning');
        return;
    }

    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Capturar imagen de la cámara
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Convertir a base64
    photoData = canvas.toDataURL("image/jpeg", 0.8);
    
    // Mostrar la foto capturada
    capturedPhoto.src = photoData;
    capturedPhoto.style.display = 'block';
    
    showMessage('Foto capturada correctamente', 'success');
    
    // Hacer scroll a la vista previa
    capturedPhoto.scrollIntoView({ behavior: 'smooth' });
});

// Guardar foto en la carpeta del tutor
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const studentName = document.getElementById('studentName').value.trim();
    const studentCode = document.getElementById('studentCode').value.trim();
    const age = document.getElementById('age').value;
    const classroom = document.getElementById('classroom').value;
    const tutorName = document.getElementById('tutorName').value;

    // Validar campos
    if (!studentName || !studentCode || !age || !classroom || !tutorName) {
        showMessage('Por favor completa todos los campos', 'warning');
        return;
    }

    if (!photoData) {
        showMessage('Por favor captura una foto primero', 'warning');
        return;
    }

    try {
        // Crear nombre del archivo
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const fileName = `${studentName}_${studentCode}_${age}_${classroom}_${timestamp}.jpg`
            .toLowerCase()
            .replace(/\s+/g, '_')
            .replace(/[^a-z0-9_.-]/g, '');

        // Crear el enlace de descarga
        const downloadLink = document.createElement('a');
        downloadLink.href = photoData;
        downloadLink.download = fileName;
        
        // Simular click para guardar
        downloadLink.click();

        showMessage(`Foto guardada en la carpeta de ${tutorName}`, 'success');
        
        // Preguntar si desea limpiar el formulario
        if (confirm('¿Deseas limpiar el formulario para un nuevo registro?')) {
            form.reset();
            capturedPhoto.style.display = 'none';
            photoData = "";
            cameraSelect.checked = true;
            startCamera('environment');
        }
    } catch (error) {
        console.error('Error al guardar:', error);
        showMessage('Error al guardar la foto', 'danger');
    }
});

// Limpiar campos
document.getElementById('clearFields').addEventListener('click', () => {
    if (confirm('¿Estás seguro de querer limpiar todos los campos?')) {
        form.reset();
        capturedPhoto.style.display = 'none';
        photoData = "";
        cameraSelect.checked = true;
        startCamera('environment');
        showMessage('Campos limpiados', 'info');
    }
});

// Manejar la visibilidad de la página
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Detener la cámara cuando la app está en segundo plano
        if (streamRef) {
            streamRef.getTracks().forEach(track => track.stop());
        }
    } else {
        // Reiniciar la cámara cuando la app vuelve a primer plano
        startCamera(cameraSelect.checked ? 'environment' : 'user');
    }
});
