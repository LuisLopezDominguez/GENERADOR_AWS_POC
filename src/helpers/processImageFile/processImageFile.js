// src/helpers/processImageFile.js
import imageCompression from 'browser-image-compression';

/**
 * Redimensiona imágenes grandes para cumplir con los requisitos del modelo
 * y devuelve un nuevo objeto File listo para subir como multipart/form-data.
 * @param {File} imageFile - Archivo de imagen original.
 * @returns {Promise<File>} - Imagen optimizada como objeto File.
 */
export async function processImageFile(imageFile) {
  const MAX_DIMENSION = 4096; // Recomendado para Bedrock Llama Vision

  const options = {
    maxWidthOrHeight: MAX_DIMENSION,
    useWebWorker: true,
    initialQuality: 1,
    fileType: imageFile.type,
  };

  try {
    const compressedFile = await imageCompression(imageFile, options);

    return new File(
      [compressedFile],
      imageFile.name || 'imagen-procesada.png',
      { type: compressedFile.type }
    );
  } catch (error) {
    console.error("❌ Error al redimensionar imagen:", error);
    return imageFile; // Retornar la original si hay fallo
  }
}
