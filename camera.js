takePhotoBtn.addEventListener('click', () => {
    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Dibujar la imagen del video (foto capturada) en el canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Dibujar el marco sobre la foto
    const frameImage = new Image();
    frameImage.src = 'MarcoaNavid.svg'; // Asegúrate de que la ruta sea correcta
    frameImage.onload = () => {
        context.drawImage(frameImage, 0, 0, canvas.width, canvas.height);

        // Convertir el canvas con la foto y el marco en un Data URL
        photoData = canvas.toDataURL("image/jpeg");

        // Mostrar la imagen combinada en el contenedor
        capturedPhoto.src = photoData;
        capturedPhoto.style.display = 'block';
        document.getElementById('frame').style.display = 'none'; // Opcional: ocultar el marco adicional
    };
});

// Guardar foto con marco incluido
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const studentName = document.getElementById('studentName').value;
    const studentCode = document.getElementById('studentCode').value;
    const tutorName = document.getElementById('tutorName').value;

    if (!photoData) {
        alert("¡Primero captura una foto!");
        return;
    }

    // Crear un enlace de descarga con la foto combinada
    const downloadLink = document.createElement('a');
    downloadLink.href = photoData; // Usar el Data URL con el marco aplicado
    downloadLink.download = `foto_${studentName}_${studentCode}_${tutorName}.jpeg`;

    // Simular un clic en el enlace
    downloadLink.click();

    alert("¡Foto guardada con marco!");
});
