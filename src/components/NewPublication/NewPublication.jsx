import React, { useState } from 'react';
import FileUploader from '../FileUploader/FileUploader';
import ContentTypeSelector from '../ContentTypeSelector/ContentTypeSelector';
import TechnicalFields from '../TechnicalFields/TechnicalFields';
import GeneratedContent from '../GeneratedContent/GeneratedContent';
import { Typography, Button, Paper, CircularProgress, Snackbar, Alert } from '@mui/material';

// Configuración de endpoints
const WEBSCRAPING_API_ENDPOINT = 'https://6z7btlmzah.execute-api.us-east-2.amazonaws.com/api-aws/scrape';
const OCR_API_ENDPOINT = 'https://fq5ksi9kw8.execute-api.us-east-2.amazonaws.com/OCR/process';

const NewPublication = () => {
    const [archivo, setArchivo] = useState(null);
    const [urls, setUrls] = useState([]);
    const [tipoContenido, setTipoContenido] = useState('PUBLICACION');
    const [resolucion, setResolucion] = useState('');
    const [formato, setFormato] = useState('');
    const [aspectRatio, setAspectRatio] = useState('');
    const [showGeneratedContent, setShowGeneratedContent] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [generatedData, setGeneratedData] = useState(null);

    const handleFileChange = (file) => {
        console.log("Archivo seleccionado:", file);
        setArchivo(file);
    };

    const handleUrlChange = (urlsList) => {
        console.log("URLs cambiadas:", urlsList);
        setUrls(urlsList);
    };

    const handleContentTypeSelect = (tipo) => {
        console.log("Tipo de contenido seleccionado:", tipo);
        setTipoContenido(tipo);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log("Iniciando generación de contenido...");

        // Validar que se haya ingresado al menos un archivo o una URL
        if (!archivo && urls.length === 0) {
            const errorMsg = 'Por favor, proporciona un archivo o al menos una URL.';
            console.error(errorMsg);
            setError(errorMsg);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            let processedData;

            // Determinar qué API llamar basado en si tenemos un archivo o URLs
            if (urls.length > 0) {
                // ===== PROCESAMIENTO WEB SCRAPING =====
                console.log('Procesando URLs mediante Web Scraping:', urls);

                // Crear objeto de datos para enviar
                const scrapingRequestData = {
                    urls: urls
                };

                const response = await fetch(WEBSCRAPING_API_ENDPOINT, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(scrapingRequestData)
                });

                if (!response.ok) {
                    throw new Error(`Error en la llamada a Web Scraping API: ${response.status}`);
                }

                const responseText = await response.text();

                // Primer parsing para obtener la respuesta principal
                const initialData = JSON.parse(responseText);

                // La respuesta tiene una estructura donde el contenido real está en "body" como string
                if (initialData.statusCode === 200 && initialData.body) {
                    // Segundo parsing para obtener el contenido real del body
                    const bodyData = JSON.parse(initialData.body);

                    // Extraer y procesar los resultados del scraping
                    if (bodyData.results && Array.isArray(bodyData.results)) {
                        // Transformar los datos para GeneratedContent
                        processedData = {
                            success: true,
                            contentType: tipoContenido,
                            scraped_content: bodyData.results,
                            technicalProperties: {
                                resolution: resolucion,
                                format: formato,
                                aspectRatio: aspectRatio
                            },
                            stats: bodyData.stats
                        };
                    } else {
                        throw new Error("No se encontraron resultados de scraping");
                    }
                } else {
                    throw new Error(`Error en la respuesta: ${initialData.statusCode}`);
                }
            }
            else if (archivo) {
                // ===== PROCESAMIENTO OCR =====
                console.log('Procesando archivo mediante OCR:', archivo);

                // Crear un objeto FormData para enviar el archivo
                const formData = new FormData();
                formData.append('file', archivo);
                formData.append('filename', archivo.name);

                console.log("Enviando archivo a la API de OCR:", archivo.name, archivo.type, archivo.size);

                // Enviar la solicitud a la API de OCR
                const response = await fetch(OCR_API_ENDPOINT, {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) {
                    throw new Error(`Error en la llamada a OCR API: ${response.status}`);
                }

                // Obtener los datos de la respuesta
                const responseText = await response.text();
                console.log("Respuesta recibida del OCR API (primeros 100 caracteres):", responseText.substring(0, 100));

                let ocrData;
                try {
                    ocrData = JSON.parse(responseText);
                } catch (jsonError) {
                    console.error("Error al parsear JSON de OCR:", jsonError);
                    throw new Error("Formato de respuesta no válido de la API de OCR");
                }

                // Procesar el texto extraído según la estructura de respuesta
                // La respuesta tiene campos como text_extraction y combined
                const extractedText = ocrData.text_extraction || ocrData.combined || ocrData.text || "";

                // Crear los datos procesados para GeneratedContent
                processedData = {
                    success: true,
                    contentType: tipoContenido,
                    extracted_text: extractedText,
                    source_file: ocrData.file_name || archivo.name,
                    technicalProperties: {
                        resolution: resolucion,
                        format: formato,
                        aspectRatio: aspectRatio
                    },
                    originalResponse: ocrData
                };

                console.log("Datos procesados correctamente de OCR:", processedData.source_file);
            }

            // Establecer los datos generados y mostrar el componente de contenido
            setGeneratedData(processedData);
            setShowGeneratedContent(true);

        } catch (error) {
            console.error('Error al generar contenido:', error);
            setError(error.message || 'Ocurrió un error al procesar la solicitud. Por favor, intenta de nuevo más tarde.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleBack = () => {
        setShowGeneratedContent(false);
    };

    if (showGeneratedContent) {
        return <GeneratedContent data={generatedData} onBack={handleBack} />;
    }

    return (
        <Paper elevation={3} sx={{ padding: '2rem', margin: '2rem', width: '100%', backgroundColor: '#ffffff' }}>
            <Typography variant="h4" gutterBottom>
                Nueva publicación
            </Typography>

            <FileUploader
                onFileChange={handleFileChange}
                onUrlChange={handleUrlChange}
            />

            <ContentTypeSelector onContentTypeSelect={handleContentTypeSelect} />

            <TechnicalFields
                resolucion={resolucion}
                formato={formato}
                aspectRatio={aspectRatio}
                onResolucionChange={(e) => setResolucion(e.target.value)}
                onFormatoChange={(e) => setFormato(e.target.value)}
                onAspectRatioChange={(e) => setAspectRatio(e.target.value)}
            />

            <Button
                variant="contained"
                sx={{
                    backgroundColor: '#ff9800',
                    color: '#fff',
                    '&:hover': { backgroundColor: '#e65100' }
                }}
                onClick={handleSubmit}
                disabled={isLoading}
            >
                {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Generar contenido'}
            </Button>

            <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError(null)}>
                <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
                    {error}
                </Alert>
            </Snackbar>
        </Paper>
    );
};

export default NewPublication;