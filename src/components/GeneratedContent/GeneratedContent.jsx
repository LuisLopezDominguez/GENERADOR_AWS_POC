import React, { useState, useEffect } from 'react';
import {
    Typography,
    Button,
    Paper,
    TextField,
    Box,
    CircularProgress,
    Divider,
    Snackbar,
    Alert
} from '@mui/material';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SendIcon from '@mui/icons-material/Send';

const GeneratedContent = ({ data, onBack }) => {
    const [title, setTitle] = useState('Contenido generado');
    const [content, setContent] = useState('');
    const [copied, setCopied] = useState(false);
    const [selectedNetworks, setSelectedNetworks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [publishStatus, setPublishStatus] = useState({
        isPublishing: false,
        success: false,
        error: null
    });

    const socialNetworks = [
        { name: 'LinkedIn', color: '#0077B5', enabled: true },
        { name: 'Facebook', color: '#1877F2', enabled: true },
        { name: 'Twitter', color: '#1DA1F2', enabled: false },
        { name: 'Instagram', color: '#E1306C', enabled: false }
    ];

    useEffect(() => {
        if (data) {
            setTimeout(() => {
                try {
                    const tipo = data.contentType?.toUpperCase();

                    if (tipo === 'AUDIO' && data.podcast) {
                        setTitle("Podcast generado");
                        setContent(data.podcast.podcast_text || '');
                    } else if (data.content) {
                        if (tipo === 'PUBLICACION') {
                            setTitle("Publicación generada");
                        } else {
                            setTitle("Contenido generado");
                        }
                        setContent(data.content);
                    } else if (tipo === 'IMAGEN') {
                        setTitle("Imagen generada");
                        setContent("⚠️ Aún no se ha implementado la lógica para mostrar imágenes generadas.");
                    } else if (tipo === 'FLYER') {
                        setTitle("Flyer generado");
                        setContent("⚠️ Aún no se ha implementado la lógica para mostrar flyers generados.");
                    } else if (tipo === 'ARTICULO') {
                        setTitle("Artículo generado");
                        setContent("⚠️ Aún no se ha implementado la lógica para mostrar artículos generados.");
                    } else {
                        setTitle("Contenido generado");
                        setContent("No se pudo interpretar correctamente el contenido generado.");
                    }
                } catch (e) {
                    console.error("Error al procesar el contenido:", e);
                    setTitle("Error");
                    setContent("Hubo un error al procesar el contenido.");
                } finally {
                    setIsLoading(false);
                }
            }, 400);
        }
    }, [data]);

    const handleCopy = () => {
        const textToCopy = `${title}\n\n${content}`;
        navigator.clipboard.writeText(textToCopy).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    const handleNetworkSelect = (network) => {
        const networkData = socialNetworks.find(n => n.name === network);
        if (!networkData?.enabled) return;

        setSelectedNetworks(prev => {
            if (prev.includes(network)) {
                return prev.filter(n => n !== network);
            } else {
                return [...prev, network];
            }
        });
    };

    const handlePublish = async () => {
        if (selectedNetworks.length === 0) {
            setPublishStatus({
                isPublishing: false,
                success: false,
                error: "Por favor, selecciona al menos una red social"
            });
            return;
        }

        setPublishStatus({
            isPublishing: true,
            success: false,
            error: null
        });

        try {
            const publishPromises = [];

            if (selectedNetworks.includes('Facebook')) {
                const facebookPromise = publishToFacebook();
                publishPromises.push(facebookPromise);
            }

            if (selectedNetworks.includes('LinkedIn')) {
                const linkedinPromise = publishToLinkedIn();
                publishPromises.push(linkedinPromise);
            }

            const results = await Promise.allSettled(publishPromises);

            const errors = results
                .filter(result => result.status === 'rejected')
                .map(result => result.reason);

            if (errors.length > 0) {
                setPublishStatus({
                    isPublishing: false,
                    success: false,
                    error: `Error al publicar: ${errors.join(', ')}`
                });
            } else {
                setPublishStatus({
                    isPublishing: false,
                    success: true,
                    error: null
                });

                setTimeout(() => {
                    setPublishStatus(prev => ({ ...prev, success: false }));
                }, 3000);
            }
        } catch (error) {
            console.error('Error al publicar:', error);
            setPublishStatus({
                isPublishing: false,
                success: false,
                error: error.message || 'Error al publicar en redes sociales'
            });
        }
    };

    const publishToFacebook = async () => {
        const FACEBOOK_API_ENDPOINT = 'https://lk03opdrt8.execute-api.us-east-2.amazonaws.com/dev/generate-facebook-post';

        const contentType = data.contentType?.toUpperCase();
        let payload = {};

        if (contentType === 'IMAGEN' || contentType === 'FLYER') {
            payload = {
                image_url: data.imageUrl
            };
        } else {
            payload = {
                text: content,
                image_url: data.imageUrl
            };
        }

        const response = await fetch(FACEBOOK_API_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`Error al publicar en Facebook: ${response.statusText}`);
        }

        return await response.json();
    };

    const publishToLinkedIn = async () => {
        const LINKEDIN_API_ENDPOINT = 'https://17g3e6mvea.execute-api.us-east-2.amazonaws.com/dev/generate-linkedin-post';

        const contentType = data.contentType?.toUpperCase();
        let payload = {};

        if (contentType === 'IMAGEN' || contentType === 'FLYER') {
            payload = {
                image_url: data.imageUrl
            };
        } else {
            payload = {
                text: content,
                image_url: data.imageUrl
            };
        }

        const response = await fetch(LINKEDIN_API_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`Error al publicar en LinkedIn: ${response.statusText}`);
        }

        return await response.json();
    };

    const getSocialNetworkicon = (network) => {
        switch (network) {
            case 'LinkedIn': return <LinkedInIcon />;
            case 'Facebook': return <FacebookIcon />;
            case 'Twitter': return <TwitterIcon />;
            case 'Instagram': return <InstagramIcon />;
            default: return null;
        }
    };

    if (isLoading) {
        return (
            <Paper elevation={3} sx={{ padding: '2rem', margin: '2rem', width: '100%', textAlign: 'center' }}>
                <CircularProgress />
                <Typography variant="body1" sx={{ marginTop: '1rem' }}>
                    Generando contenido...
                </Typography>
            </Paper>
        );
    }

    return (
        <Paper elevation={3} sx={{ padding: '2rem', margin: '2rem', width: '100%', backgroundColor: '#fff' }}>
            <Typography variant="h4" gutterBottom>Contenido Generado</Typography>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ mb: 3 }}>
                <Typography variant="body1" gutterBottom>Selecciona una red social</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {socialNetworks.map((network) => (
                        <Button
                            key={network.name}
                            variant={selectedNetworks.includes(network.name) ? "contained" : "outlined"}
                            sx={{
                                backgroundColor: selectedNetworks.includes(network.name) ? network.color : 'transparent',
                                color: selectedNetworks.includes(network.name) ? '#fff' : network.color,
                                borderColor: network.color,
                                opacity: network.enabled ? 1 : 0.5,
                                '&:hover': {
                                    backgroundColor: network.enabled ?
                                        (selectedNetworks.includes(network.name) ? network.color : 'rgba(0,0,0,0.04)') :
                                        'transparent',
                                    color: network.enabled ?
                                        (selectedNetworks.includes(network.name) ? '#fff' : network.color) :
                                        network.color,
                                    opacity: network.enabled ? 0.9 : 0.5,
                                    cursor: network.enabled ? 'pointer' : 'not-allowed'
                                }
                            }}
                            onClick={() => handleNetworkSelect(network.name)}
                            startIcon={getSocialNetworkicon(network.name)}
                            disabled={!network.enabled}
                            title={network.enabled ? '' : 'Integración no disponible'}
                        >
                            {network.name}
                        </Button>
                    ))}
                </Box>
            </Box>

            <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>Título</Typography>
                <TextField
                    variant="outlined"
                    fullWidth
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </Box>

            <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="h6">Contenido generado</Typography>
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={handleCopy}
                        color={copied ? "success" : "primary"}
                        startIcon={<ContentCopyIcon />}
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

            {data.imageUrl && (
                <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" gutterBottom>Imagen generada</Typography>
                    <Box
                        sx={{
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            border: '1px solid #e0e0e0',
                            borderRadius: '4px',
                            p: 2,
                            backgroundColor: '#f5f5f5'
                        }}
                    >
                        <img
                            src={data.imageUrl}
                            alt="Imagen generada"
                            style={{
                                maxWidth: '100%',
                                maxHeight: '500px',
                                objectFit: 'contain',
                                borderRadius: '4px',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                            }}
                        />
                    </Box>
                    <Button
                        sx={{ mt: 1 }}
                        variant="outlined"
                        href={data.imageUrl}
                        download="imagen_generada.png"
                        startIcon={<ContentCopyIcon />}
                    >
                        Descargar imagen
                    </Button>
                </Box>
            )}

            {data.contentType?.toUpperCase() === 'AUDIO' && data.podcast?.podcast_url && (
                <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" gutterBottom>Reproductor de Podcast</Typography>
                    <audio controls src={data.podcast.podcast_url} style={{ width: '100%' }} />
                    <Button
                        sx={{ mt: 1 }}
                        variant="outlined"
                        href={data.podcast.podcast_url}
                        download="podcast.mp3"
                    >
                        Descargar MP3
                    </Button>
                </Box>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                <Button variant="outlined" onClick={onBack} startIcon={<ArrowBackIcon />}>Volver</Button>
                <Button
                    variant="contained"
                    endIcon={<SendIcon />}
                    onClick={handlePublish}
                    disabled={publishStatus.isPublishing || selectedNetworks.length === 0}
                >
                    {publishStatus.isPublishing ? <CircularProgress size={24} color="inherit" /> : 'Publicar'}
                </Button>
            </Box>

            <Snackbar
                open={!!publishStatus.error || publishStatus.success}
                autoHideDuration={6000}
                onClose={() => setPublishStatus(prev => ({ ...prev, error: null, success: false }))}
            >
                <Alert
                    onClose={() => setPublishStatus(prev => ({ ...prev, error: null, success: false }))}
                    severity={publishStatus.success ? "success" : "error"}
                    sx={{ width: '100%' }}
                >
                    {publishStatus.success ? 'Contenido publicado exitosamente' : publishStatus.error}
                </Alert>
            </Snackbar>
        </Paper>
    );
};

export default GeneratedContent;
