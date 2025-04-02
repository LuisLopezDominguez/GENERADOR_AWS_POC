/**
 * Redimensiona una imagen si excede los límites aceptados por Bedrock Vision.
 * - Llama Vision tiene un límite de 26214400 píxeles (e.g. 5120x5120)
 * - Este helper convierte imágenes a formato PNG y las redimensiona proporcionalmente si superan el ancho/largo permitido.
 */

export async function resizeImageFile(file, maxWidth = 1024, maxHeight = 1024) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const reader = new FileReader();

        reader.onload = (e) => {
            img.onload = () => {
                const originalWidth = img.width;
                const originalHeight = img.height;

                // Determinar si hay que redimensionar
                let newWidth = originalWidth;
                let newHeight = originalHeight;

                const widthRatio = maxWidth / originalWidth;
                const heightRatio = maxHeight / originalHeight;
                const scaleFactor = Math.min(widthRatio, heightRatio);

                if (scaleFactor < 1) {
                    newWidth = Math.floor(originalWidth * scaleFactor);
                    newHeight = Math.floor(originalHeight * scaleFactor);
                }

                const canvas = document.createElement('canvas');
                canvas.width = newWidth;
                canvas.height = newHeight;
                const ctx = canvas.getContext('2d');

                ctx.drawImage(img, 0, 0, newWidth, newHeight);

                // Convertir el canvas a Blob tipo PNG
                canvas.toBlob(
                    async (blob) => {
                        const resizedFile = new File([blob], file.name, { type: 'image/png' });

                        console.log('📏 Tamaño original:', originalWidth, 'x', originalHeight);
                        console.log('📉 Tamaño redimensionado:', newWidth, 'x', newHeight);
                        console.log('🧱 Peso original:', file.size, 'bytes');
                        console.log('📦 Peso redimensionado:', resizedFile.size, 'bytes');

                        resolve(resizedFile);
                    },
                    'image/png',
                    1.0 // Calidad máxima
                );
            };

            img.onerror = (err) => {
                reject(new Error('No se pudo cargar la imagen.'));
            };

            img.src = e.target.result;
        };

        reader.onerror = (err) => {
            reject(new Error('No se pudo leer el archivo.'));
        };

        reader.readAsDataURL(file);
    });
}
