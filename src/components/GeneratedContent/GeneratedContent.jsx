import React, { useState, useEffect } from 'react';
import {
    Typography,
    Button,
    Paper,
    TextField,
    Box,
    CircularProgress,
    Divider
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
    const [selectedNetwork, setSelectedNetwork] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const socialNetworks = [
        { name: 'LinkedIn', color: '#0077B5' },
        { name: 'Facebook', color: '#1877F2' },
        { name: 'Twitter', color: '#1DA1F2' },
        { name: 'Instagram', color: '#E1306C' }
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
                        // Para PUBLICACION, asigna título específico y muestra el contenido generado.
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
        setSelectedNetwork(network);
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

                            startIcon={getSocialNetworkicon(network.name)}
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
                <Button variant="contained" endIcon={<SendIcon />}>Publicar</Button>

            </Box>
        </Paper>
    );
};

export default GeneratedContent;
