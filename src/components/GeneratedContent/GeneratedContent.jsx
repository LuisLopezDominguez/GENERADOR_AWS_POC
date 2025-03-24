import React, { useState, useEffect } from 'react';
import { Typography, Button, Paper, TextField, Box, CircularProgress, Divider } from '@mui/material';

const GeneratedContent = ({ data, onBack }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [copied, setCopied] = useState(false);
    const [selectedNetwork, setSelectedNetwork] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    // Redes sociales disponibles
    const socialNetworks = [
        { name: 'LinkedIn', color: '#0077B5' },
        { name: 'Facebook', color: '#1877F2' },
        { name: 'Twitter', color: '#1DA1F2' },
        { name: 'Instagram', color: '#E1306C' }
    ];

    useEffect(() => {
        if (data) {
            // Procesamiento breve para mostrar los datos
            setTimeout(() => {
                try {
                    // Procesar datos de Web Scraping
                    if (data.scraped_content && data.scraped_content.length > 0) {
                        // Usar el título del primer sitio, si está disponible
                        let generatedTitle = "";
                        for (const page of data.scraped_content) {
                            if (page.title && page.title.trim()) {
                                generatedTitle = page.title;
                                break;
                            }
                        }

                        // Si no hay título, usar uno predeterminado
                        if (!generatedTitle) {
                            generatedTitle = getTitleByContentType(data.contentType);
                        }

                        // Generar contenido combinado de los sitios
                        let generatedContent = "";
                        data.scraped_content.forEach((sitio) => {
                            if (sitio.main_text && sitio.main_text.trim()) {
                                const domain = extractDomain(sitio.url);
                                generatedContent += `📄 De ${domain}:\n\n`;
                                generatedContent += sitio.main_text.substring(0, 500) + "...\n\n";
                            }
                        });

                        // Añadir fuentes
                        generatedContent += "\nFuentes: " + data.scraped_content
                            .map(s => s.url || "URL")
                            .join(", ");

                        setTitle(generatedTitle);
                        setContent(generatedContent);
                    }
                    // Procesar datos de OCR
                    else if (data.extracted_text) {
                        // Título basado en el nombre del archivo
                        const fileTitle = data.source_file
                            ? `Contenido extraído de "${data.source_file}"`
                            : getTitleByContentType(data.contentType);

                        // Procesar el texto extraído
                        let formattedText = data.extracted_text;

                        // Adaptar el contenido según el tipo seleccionado
                        let finalContent = formattedText;

                        // Para artículos, añadir un poco de contexto
                        if (data.contentType === 'ARTICULO') {
                            finalContent = `A continuación se presenta un artículo basado en el texto extraído:\n\n${formattedText}`;
                        }

                        setTitle(fileTitle);
                        setContent(finalContent);
                    }
                    // Caso por defecto
                    else {
                        setTitle(getTitleByContentType(data.contentType));
                        setContent("No se pudo extraer contenido. Por favor, edita este texto manualmente.");
                    }
                } catch (error) {
                    console.error("Error al procesar datos:", error);
                    setTitle("Error al procesar datos");
                    setContent("Hubo un error al procesar el contenido extraído.");
                } finally {
                    setIsLoading(false);
                }
            }, 500);
        } else {
            setTitle("No hay datos disponibles");
            setContent("No se ha podido generar contenido porque no se recibieron datos.");
            setIsLoading(false);
        }
    }, [data]);

    // Función para obtener un título según el tipo de contenido
    const getTitleByContentType = (contentType) => {
        switch (contentType) {
            case 'IMAGEN':
                return "Nueva imagen para redes sociales";
            case 'FLYER':
                return "Flyer promocional";
            case 'AUDIO':
                return "Audio para compartir";
            case 'ARTICULO':
                return "Artículo de interés";
            default:
                return "Contenido para publicación";
        }
    };

    // Función para extraer el dominio de una URL
    const extractDomain = (url) => {
        try {
            return new URL(url).hostname;
        } catch (e) {
            return url;
        }
    };

    const handleCopy = () => {
        const textToCopy = `${title}\n\n${content}`;
        navigator.clipboard.writeText(textToCopy).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    const handleNetworkSelect = (network) => {
        setSelectedNetwork(network);
    };

    if (isLoading) {
        return (
            <Paper elevation={3} sx={{
                padding: '2rem',
                margin: '2rem',
                width: '100%',
                backgroundColor: '#fff',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '300px'
            }}>
                <CircularProgress color="primary" />
                <Typography variant="h6" sx={{ mt: 2 }}>
                    Generando contenido...
                </Typography>
            </Paper>
        );
    }

    return (
        <Paper elevation={3} sx={{
            padding: '2rem',
            margin: '2rem',
            width: '100%',
            backgroundColor: '#fff'
        }}>
            <Typography variant="h4" gutterBottom>
                Contenido Generado
            </Typography>

            <Box sx={{ mb: 3 }}>
                <Typography variant="body1" gutterBottom>
                    Selecciona una red social
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {socialNetworks.map((network) => (
                        <Button
                            key={network.name}
                            variant={selectedNetwork === network.name ? "contained" : "outlined"}
                            sx={{
                                backgroundColor: selectedNetwork === network.name ? network.color : 'transparent',
                                color: selectedNetwork === network.name ? '#fff' : network.color,
                                borderColor: network.color,
                                '&:hover': {
                                    backgroundColor: network.color,
                                    color: '#fff',
                                    opacity: 0.9
                                }
                            }}
                            onClick={() => handleNetworkSelect(network.name)}
                        >
                            {network.name}
                        </Button>
                    ))}
                </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                    Título
                </Typography>
                <TextField
                    variant="outlined"
                    fullWidth
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </Box>

            <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="h6">
                        Contenido de la publicación
                    </Typography>
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={handleCopy}
                        color={copied ? "success" : "primary"}
                    >
                        {copied ? "¡Copiado!" : "Copiar"}
                    </Button>
                </Box>
                <TextField
                    variant="outlined"
                    multiline
                    rows={8}
                    fullWidth
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                <Button
                    variant="outlined"
                    onClick={onBack}
                >
                    Volver
                </Button>
                <Button
                    variant="contained"
                    sx={{
                        backgroundColor: '#ff9800',
                        color: '#fff',
                        '&:hover': { backgroundColor: '#e65100' }
                    }}
                >
                    Publicar
                </Button>
            </Box>
        </Paper>
    );
};

export default GeneratedContent;