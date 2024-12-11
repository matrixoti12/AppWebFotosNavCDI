const form = document.getElementById('studentForm');
const video = document.getElementById('camera');
const canvas = document.getElementById('snapshot');
const takePhotoBtn = document.getElementById('takePhoto');
const capturedPhoto = document.getElementById('capturedPhoto');
const cameraSelect = document.getElementById('cameraSelect');

let photoData = "";

// Función para iniciar la cámara
function startCamera(facingMode) {
    navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: facingMode, width: 1280, height: 720 }
    })
    .then(stream => {
        video.srcObject = stream;
    })
    .catch(err => {
        console.error("Error al acceder a la cámara:", err);
        alert("No se pudo acceder a la cámara. Por favor, revisa los permisos.");
    });
}

// Iniciar la cámara con la opción seleccionada
cameraSelect.addEventListener('change', () => {
    const facingMode = cameraSelect.value;
    startCamera(facingMode);
});

// Iniciar la cámara con la opción predeterminada
startCamera(cameraSelect.value);

// Capturar foto
takePhotoBtn.addEventListener('click', () => {
    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    photoData = canvas.toDataURL("image/jpeg");

    // Mostrar la imagen capturada (sin marco por ahora)
    capturedPhoto.src = photoData;
    capturedPhoto.style.display = 'block';
});

// Guardar foto con metadatos
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const studentName = document.getElementById('studentName').value;
    const studentCode = document.getElementById('studentCode').value;
    const tutorName = document.getElementById('tutorName').value;

    if (!photoData) {
        alert("¡Primero captura una foto!");
        return;
    }

    // Crear un enlace de descarga (sin marco por ahora)
    const downloadLink = document.createElement('a');
    downloadLink.href = photoData;  // Usar photoData directamente
    downloadLink.download = `foto_${studentName}_${studentCode}_${tutorName}.jpeg`;

    // Simular un clic en el enlace
    downloadLink.click();

    alert("¡Foto guardada!");
});
