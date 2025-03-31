import React, { useState } from 'react';
import FileUploader from '../FileUploader/FileUploader';
import ContentTypeSelector from '../ContentTypeSelector/ContentTypeSelector';
import TechnicalFields from '../TechnicalFields/TechnicalFields';
import GeneratedContent from '../GeneratedContent/GeneratedContent';
import PodcastOptions from '../PodcastOptions/PodcastOptions';
import {
    Typography,
    Button,
    Paper,
    CircularProgress,
    Snackbar,
    Alert,
    TextField
} from '@mui/material';

import { resizeImageFile } from '../../helpers/processImageFile/resizeImageFile';
import { convertPdfToImages } from '../../helpers/processImageFile/convertPdfToImages';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';

// Endpoints
const WEBSCRAPING_API_ENDPOINT = 'https://6z7btlmzah.execute-api.us-east-2.amazonaws.com/api-aws/scrape';
const OCR_API_ENDPOINT = 'https://fq5ksi9kw8.execute-api.us-east-2.amazonaws.com/OCR/process';
const PODCAST_API_ENDPOINT = 'https://t7cqja44wh.execute-api.us-east-2.amazonaws.com/prod/podcast';

const NewPublication = () => {
    const [archivo, setArchivo] = useState(null);
    const [urls, setUrls] = useState([]);
    const [userPrompt, setUserPrompt] = useState('');
    const [tipoContenido, setTipoContenido] = useState('PUBLICACION');

    const [tipoVoz, setTipoVoz] = useState('Conchita');
    const [tono, setTono] = useState('Formal');
    const [tipoPodcast, setTipoPodcast] = useState('Educativo');
    const [objetivoPodcast, setObjetivoPodcast] = useState('Informar');
    const [creatividad, setCreatividad] = useState(0.8);

    const [resolucion, setResolucion] = useState('');
    const [formato, setFormato] = useState('');
    const [aspectRatio, setAspectRatio] = useState('');

    const [showGeneratedContent, setShowGeneratedContent] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [generatedData, setGeneratedData] = useState(null);

    // Estado opcional para almacenar la respuesta del API al cambiar el tipo de contenido
    const [contentData, setContentData] = useState(null);

    const handleFileChange = (file) => setArchivo(file);
    const handleUrlChange = (urlsList) => setUrls(urlsList);

    // Actualiza el tipo de contenido y llama al API para actualizar el JSON a enviar
    const handleContentTypeSelect = async (tipo) => {
        setTipoContenido(tipo);

        const payload = {
            content_type: tipo, // Debe ser uno de: IMAGEN, FLYER, PUBLICACION, ARTICULO
            user_prompt: userPrompt, // Valor del textbox "¿Qué quieres lograr con este contenido?"
            knowledge_context: "" // Puedes asignar aquí el contexto de conocimiento que requieras
        };

        try {
            const response = await fetch(
                "https://2rmkzczpi6.execute-api.us-east-2.amazonaws.com/dev/generate-content",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                }
            );
            const data = await response.json();
            console.log("Respuesta del API:", data);
            setContentData(data); // Guarda la respuesta si la necesitas
        } catch (error) {
            console.error("Error al llamar al API:", error);
        }
    };

    const getPlaceholderByTipoContenido = (tipo) => {
        switch (tipo) {
            case 'AUDIO':
                return 'Ej: Quiero un podcast breve y educativo sobre ahorro para jóvenes';
            case 'IMAGEN':
                return 'Ej: Quiero una imagen colorida para una campaña de donación';
            case 'FLYER':
                return 'Ej: Necesito un flyer para promocionar un evento de tecnología';
            case 'ARTICULO':
                return 'Ej: Quiero un artículo de blog que hable sobre sostenibilidad en empresas';
            case 'PUBLICACION':
            default:
                return 'Ej: Quiero una publicación atractiva para redes sociales que invite a participar en un sorteo';
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log("Iniciando generación de contenido...");

        if (!archivo && urls.length === 0) {
            setError('Por favor, proporciona un archivo o al menos una URL.');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            let knowledge = '';
            let processedData = {};

            // Process URLs or file to extract knowledge
            if (urls.length > 0) {
                // Existing URL processing code
                const scrapingRequestData = { urls };
                const response = await fetch(WEBSCRAPING_API_ENDPOINT, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(scrapingRequestData)
                });

                const responseText = await response.text();
                const initialData = JSON.parse(responseText);
                const bodyData = JSON.parse(initialData.body);

                const scraped_content = bodyData.results || [];
                const cleanKnowledge = scraped_content.map((page, i) => {
                    const title = page.title?.trim();
                    const mainText = page.main_text?.trim();
                    if (!mainText) return null;
                    const header = title ? `${title}` : `Página ${i + 1}`;
                    return `${header}\n${mainText}`;
                }).filter(Boolean).join('\n\n---\n\n');

                knowledge = cleanKnowledge.trim();

                processedData = {
                    success: true,
                    contentType: tipoContenido,
                    scraped_content,
                    knowledge,
                    technicalProperties: {
                        resolution: resolucion,
                        format: formato,
                        aspectRatio: aspectRatio
                    },
                    stats: bodyData.stats
                };
            } else if (archivo) {
                // Existing file processing code
                console.log('Procesando archivo mediante OCR...');

                let fileToUpload = archivo;

                if (archivo.type.startsWith('image/')) {
                    fileToUpload = await resizeImageFile(archivo);
                } else if (archivo.type === 'application/pdf') {
                    const images = await convertPdfToImages(archivo);
                    if (images.length > 0) {
                        fileToUpload = images[0];
                    } else {
                        throw new Error('No se pudo convertir el PDF a imagen.');
                    }
                }

                const formData = new FormData();
                formData.append('file', fileToUpload);
                formData.append('filename', fileToUpload.name);

                const response = await fetch(OCR_API_ENDPOINT, {
                    method: 'POST',
                    body: formData
                });

                const responseText = await response.text();
                const ocrData = JSON.parse(responseText);
                const extractedText = (ocrData.combined || '').trim();

                knowledge = extractedText;

                processedData = {
                    success: true,
                    contentType: tipoContenido,
                    extracted_text: extractedText,
                    source_file: ocrData.file_name || archivo.name,
                    knowledge,
                    technicalProperties: {
                        resolution: resolucion,
                        format: formato,
                        aspectRatio: aspectRatio
                    },
                    originalResponse: ocrData
                };
            }

            // Call the content generation API with the extracted knowledge
            const contentGenerationPayload = {
                content_type: tipoContenido,
                user_prompt: userPrompt,
                knowledge_context: knowledge || "" // Use the extracted knowledge
            };

            console.log("Llamando a la API de generación de contenido...");
            const contentResponse = await fetch(
                "https://2rmkzczpi6.execute-api.us-east-2.amazonaws.com/dev/generate-content",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(contentGenerationPayload)
                }
            );
            
            const contentData = await contentResponse.json();
            console.log("Respuesta de la API de generación:", contentData);
            
            // Extract the "resumen" field from the response
            const generatedContent = contentData.resumen || "";
            
            // Merge the content generation response with the processed data
            processedData = {
                ...processedData,
                generatedContent: contentData,
                // Add the extracted content directly to be used by GeneratedContent component
                content: generatedContent
            };

            setGeneratedData(processedData);

            // Existing podcast generation code for AUDIO type
            if (tipoContenido === 'AUDIO' && knowledge) {
                const podcastRequest = {
                    knowledge,
                    prompt: userPrompt,
                    tipo_voz: tipoVoz,
                    tono,
                    tipoPodcast,
                    objetivoPodcast,
                    creatividad: parseFloat(creatividad)
                };

                const podcastResponse = await fetch(PODCAST_API_ENDPOINT, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(podcastRequest)
                });

                const podcastData = await podcastResponse.json();

                setGeneratedData(prev => ({
                    ...prev,
                    podcast: {
                        podcast_text: podcastData.podcast_text,
                        podcast_url: podcastData.podcast_url,
                        audio_base64: podcastData.audio_base64,
                        metadata: podcastData.metadata
                    }
                }));
            }

            setShowGeneratedContent(true);
        } catch (error) {
            console.error('Error al generar contenido:', error);
            setError(error.message || 'Ocurrió un error al procesar la solicitud.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleBack = () => setShowGeneratedContent(false);

    if (showGeneratedContent) {
        return <GeneratedContent data={generatedData} onBack={handleBack} />;
    }

    return (
        <Paper elevation={3} sx={{ padding: '2rem', margin: '2rem', backgroundColor: '#ffffff' }}>
            <Typography variant="h4" gutterBottom>Nueva publicación</Typography>
            <FileUploader onFileChange={handleFileChange} onUrlChange={handleUrlChange} />
            <ContentTypeSelector onContentTypeSelect={handleContentTypeSelect} />

            <Typography variant="subtitle1" sx={{ mt: 2 }}>
                ¿Qué quieres lograr con este contenido?
            </Typography>

            <TextField
                placeholder={getPlaceholderByTipoContenido(tipoContenido)}
                multiline
                minRows={3}
                fullWidth
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
                sx={{ mb: 2 }}
            />

            {tipoContenido === 'AUDIO' ? (
                <PodcastOptions
                    tipoVoz={tipoVoz}
                    creatividad={creatividad}
                    setTipoVoz={setTipoVoz}
                    setCreatividad={setCreatividad}
                    tono={tono}
                    setTono={setTono}
                    tipoPodcast={tipoPodcast}
                    setTipoPodcast={setTipoPodcast}
                    objetivoPodcast={objetivoPodcast}
                    setObjetivoPodcast={setObjetivoPodcast}
                />
            ) : (
                <TechnicalFields
                    resolucion={resolucion}
                    formato={formato}
                    aspectRatio={aspectRatio}
                    onResolucionChange={(e) => setResolucion(e.target.value)}
                    onFormatoChange={(e) => setFormato(e.target.value)}
                    onAspectRatioChange={(e) => setAspectRatio(e.target.value)}
                />
            )}

            <Button
                variant="contained"
                sx={{ mt: 2 }}
                onClick={handleSubmit}
                disabled={isLoading}
                size="large"
                fullWidth
                startIcon={<AutoFixHighIcon />}
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
