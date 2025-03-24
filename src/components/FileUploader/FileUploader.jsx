import React, { useState } from 'react';
import { Typography, Button, TextField, Chip, Box } from '@mui/material';

const FileUploader = ({ onFileChange, onUrlChange }) => {
    const [url, setUrl] = useState('');
    const [urls, setUrls] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [error, setError] = useState('');

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            onFileChange(file);

            // Al seleccionar un archivo, limpiamos las URLs
            setUrls([]);
            if (onUrlChange) onUrlChange([]);
        }
    };

    const handleUrlChange = (event) => {
        setUrl(event.target.value);
    };

    const isValidUrl = (urlString) => {
        try {
            new URL(urlString);
            return true;
        } catch (_) {
            return false;
        }
    };

    const addUrl = () => {
        const trimmedUrl = url.trim();
        if (!trimmedUrl) {
            setError('La URL no puede estar vacía');
            return;
        }

        if (!isValidUrl(trimmedUrl)) {
            setError('La URL no es válida');
            return;
        }

        if (urls.includes(trimmedUrl)) {
            setError('Esta URL ya ha sido añadida');
            return;
        }

        const newUrls = [...urls, trimmedUrl];
        setUrls(newUrls);
        setUrl('');
        setError('');

        // Al añadir URLs, limpiamos el archivo seleccionado
        setSelectedFile(null);
        onFileChange(null);

        // Notificar al componente padre
        if (onUrlChange) onUrlChange(newUrls);
    };

    const removeUrl = (urlToRemove) => {
        const newUrls = urls.filter(u => u !== urlToRemove);
        setUrls(newUrls);

        // Notificar al componente padre
        if (onUrlChange) onUrlChange(newUrls);
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault(); // Evitar envío del formulario
            addUrl();
        }
    };

    return (
        <div style={{ marginBottom: '2rem' }}>
            <Typography variant="h6">Carga tu Archivo o URL</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ marginBottom: '1rem' }}>
                Puedes cargar un archivo o pegar links para generar contenido para tu red social
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                <input
                    type="file"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                    id="file-upload"
                    disabled={urls.length > 0}
                />
                <label htmlFor="file-upload">
                    <Button
                        variant="contained"
                        component="span"
                        sx={{
                            backgroundColor: '#1976d2',
                            color: '#fff',
                            '&:hover': { backgroundColor: '#1565c0' },
                            '&.Mui-disabled': {
                                backgroundColor: '#e0e0e0',
                                color: '#9e9e9e'
                            }
                        }}
                        disabled={urls.length > 0}
                    >
                        Seleccionar Archivo
                    </Button>
                </label>
                {selectedFile && (
                    <Box sx={{ marginLeft: '1rem', display: 'flex', alignItems: 'center' }}>
                        <Typography variant="body2">
                            {selectedFile.name}
                        </Typography>
                        <Button
                            size="small"
                            onClick={() => {
                                setSelectedFile(null);
                                onFileChange(null);
                            }}
                            sx={{ minWidth: '24px', ml: 1 }}
                        >
                            X
                        </Button>
                    </Box>
                )}
            </Box>

            <Typography variant="body2" sx={{ marginTop: '1.5rem', marginBottom: '0.5rem' }}>
                O añade URLs para analizar:
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TextField
                    label="URL"
                    variant="outlined"
                    value={url}
                    onChange={handleUrlChange}
                    onKeyPress={handleKeyPress}
                    error={!!error}
                    helperText={error}
                    sx={{ flexGrow: 1 }}
                    disabled={selectedFile !== null}
                />
                <Button
                    onClick={addUrl}
                    variant="contained"
                    color="primary"
                    sx={{ marginLeft: '0.5rem', height: '56px' }}
                    disabled={selectedFile !== null}
                >
                    +
                </Button>
            </Box>

            {urls.length > 0 && (
                <Box sx={{ marginTop: '1rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {urls.map((url, index) => (
                        <Chip
                            key={index}
                            label={url}
                            onDelete={() => removeUrl(url)}
                            color="primary"
                            variant="outlined"
                        />
                    ))}
                </Box>
            )}
        </div>
    );
};

export default FileUploader;