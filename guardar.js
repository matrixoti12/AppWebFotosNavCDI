// Función para manejar la selección de la carpeta
const folderSelect = document.getElementById('folderSelect');
const tutorSelect = document.getElementById('tutorName');
let selectedFolder = ''; // Guardaremos la carpeta seleccionada

// Esta función será llamada cuando el usuario seleccione una carpeta
folderSelect.addEventListener('change', (e) => {
    // Obtener el nombre de la carpeta seleccionada
    const relativePath = e.target.files[0].webkitRelativePath;
    selectedFolder = relativePath.split('/')[0]; // Extraer solo el nombre de la carpeta
    console.log('Carpeta seleccionada:', selectedFolder);
});

// Función para obtener la foto capturada
function getCapturedPhoto() {
    // Aquí deberías tener una función que capture la foto de la cámara
    // Por ejemplo, usando un canvas para crear la imagen base64
    return canvas.toDataURL("image/jpeg");
}

// Cuando el usuario haga clic en "Tomar Foto", se capturará la foto y se asignará al tutor seleccionado
const takePhotoBtn = document.getElementById('takePhoto');
takePhotoBtn.addEventListener('click', () => {
    const photoData = getCapturedPhoto(); // Asumimos que esta función devuelve la imagen capturada
    if (!selectedFolder) {
        alert("¡Por favor selecciona una carpeta primero!");
        return;
    }
    
    // Simulamos la descarga de la foto en la carpeta seleccionada
    savePhotoToFolder(photoData);
});

// Función para guardar la foto con el nombre del tutor y la carpeta seleccionada
function savePhotoToFolder(photoData) {
    const tutorName = tutorSelect.value;  // Obtenemos el nombre del tutor
    const link = document.createElement('a');
    
    // Usamos el nombre del tutor y la carpeta seleccionada para formar el nombre del archivo
    const fileName = `${selectedFolder}_${tutorName}_foto.jpeg`;
    
    // Creamos un enlace de descarga
    link.href = photoData;
    link.download = fileName; // Establecemos el nombre del archivo a descargar
    link.click();
}
