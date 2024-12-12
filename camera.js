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
    .then((stream) => {
        video.srcObject = stream;
        video.play(); // Asegurarse de que el video se reproduce
    })
    .catch((err) => {
        console.error("Error al acceder a la cámara:", err);
        alert("No se pudo acceder a la cámara. Por favor, revisa los permisos.");
    });
}

// Iniciar la cámara con la opción seleccionada
cameraSelect.addEventListener('change', () => {
    const facingMode = cameraSelect.checked ? 'environment' : 'user';
    startCamera(facingMode);
});

// Iniciar la cámara con la opción predeterminada
startCamera(cameraSelect.checked ? 'environment' : 'user');

// Capturar foto y aplicar marco
takePhotoBtn.addEventListener('click', () => {
    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Dibujar la imagen de la cámara en el canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Dibujar el marco encima
    const frameImage = new Image();
    frameImage.src = 'Marco2.svg'; // Ruta del marco
    frameImage.onload = () => {
        context.drawImage(frameImage, 0, 0, canvas.width, canvas.height);

        // Convertir canvas a una imagen en base64
        photoData = canvas.toDataURL("image/jpeg");

        // Mostrar la foto en la interfaz
        capturedPhoto.src = photoData;
        capturedPhoto.style.display = 'block';
    };
});

// Guardar foto con marco incluido
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const studentName = document.getElementById('studentName').value;
    const studentCode = document.getElementById('studentCode').value;
    const tutorName = document.getElementById('tutorName').value;

    if (!photoData) {
        alert("¡Primero captura una foto!");
        return;
    }

    // Crear enlace de descarga
    const downloadLink = document.createElement('a');
    downloadLink.href = photoData;
    downloadLink.download = `foto_${studentName}_${studentCode}_${tutorName}.jpeg`;
    downloadLink.click();

    alert("¡Foto guardada con marco!");
});
