const form = document.getElementById('studentForm');
const video = document.getElementById('camera');
const canvas = document.getElementById('snapshot');
const takePhotoBtn = document.getElementById('takePhoto');
const capturedPhoto = document.getElementById('capturedPhoto');
const frame = document.getElementById('frame');

// Acceso a la cámara
navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        video.srcObject = stream;
    })
    .catch(err => console.error("Error al acceder a la cámara:", err));

let photoData = "";

// Capturar foto
takePhotoBtn.addEventListener('click', () => {
    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    photoData = canvas.toDataURL("image/jpeg");

    // Mostrar la imagen capturada
    capturedPhoto.src = photoData;
    capturedPhoto.style.display = 'block';

    // Ajustar el marco al tamaño de la foto capturada
    capturedPhoto.onload = () => {
        const photoWidth = capturedPhoto.width;
        const photoHeight = capturedPhoto.height;

        // Dibujar la foto en el canvas
        context.drawImage(capturedPhoto, 0, 0, photoWidth, photoHeight);

        // Dibujar el marco en el canvas
        const frameImg = new Image();
        frameImg.src = frame.src;
        frameImg.onload = () => {
            context.drawImage(frameImg, 0, 0, photoWidth, photoHeight);
        };
    };
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

    // Crear un enlace de descarga
    const downloadLink = document.createElement('a');
    downloadLink.href = canvas.toDataURL("image/jpeg");
    downloadLink.download = `foto_${studentName}_${studentCode}_${tutorName}.jpeg`;

    // Simular un clic en el enlace
    downloadLink.click();

    alert("¡Foto guardada!");
});