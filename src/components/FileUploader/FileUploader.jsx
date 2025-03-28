import React, { useState } from 'react';
import {
    Typography,
    Button,
    TextField,
    Chip,
    Box,
    Tabs,
    Tab,
    Paper,
    Alert
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import LinkIcon from '@mui/icons-material/Link';
import CloseIcon from '@mui/icons-material/Close';

const FileUploader = ({ onFileChange, onUrlChange }) => {
    const [tabValue, setTabValue] = useState(0);
    const [url, setUrl] = useState('');
    const [urls, setUrls] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [error, setError] = useState('');
    const [fileError, setFileError] = useState('');

    // Allowed file types
    const allowedFileTypes = [
        'application/pdf',                                      // PDF
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // DOCX
        'text/plain',                                           // TXT
        'image/png',                                            // PNG
        'image/jpeg'                                            // JPG/JPEG
    ];

    // File extensions for the accept attribute
    const acceptedFileExtensions = '.pdf,.docx,.txt,.png,.jpg,.jpeg';

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
        setFileError('');

        // Clear previous selections when switching tabs
        if (newValue === 0) {
            setUrls([]);
            if (onUrlChange) onUrlChange([]);
        } else {
            setSelectedFile(null);
            onFileChange(null);
        }
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Validate file type
        if (!allowedFileTypes.includes(file.type)) {
            setFileError(`Tipo de archivo no permitido. Solo se admiten: PDF, DOCX, TXT, PNG, JPG`);
            setSelectedFile(null);
            onFileChange(null);
            return;
        }

        // File is valid
        setFileError('');
        setSelectedFile(file);
        onFileChange(file);
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
        <Paper elevation={0} sx={{ marginBottom: '2rem', border: '1px solid #e0e0e0', borderRadius: '8px', overflow: 'hidden' }}>
            <Typography variant="h6" sx={{ padding: '16px 16px 8px 16px' }}>
                Fuente de contenido
            </Typography>

            <Tabs
                value={tabValue}
                onChange={handleTabChange}
                variant="fullWidth"
                sx={{ borderBottom: 1, borderColor: 'divider' }}
            >
                <Tab
                    icon={<CloudUploadIcon />}
                    label="Subir archivo"
                    iconPosition="start"
                />
                <Tab
                    icon={<LinkIcon />}
                    label="Añadir URLs"
                    iconPosition="start"
                />
            </Tabs>

            <Box sx={{ padding: '24px 16px' }}>
                {tabValue === 0 ? (
                    // File Upload Tab
                    <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ marginBottom: '1rem' }}>
                            Sube un archivo para generar contenido para tu red social
                        </Typography>

                        {fileError && (
                            <Alert severity="error" sx={{ mb: 2 }}>
                                {fileError}
                            </Alert>
                        )}

                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                border: '2px dashed #1976d2',
                                borderRadius: '8px',
                                padding: '30px',
                                backgroundColor: '#f5f8ff',
                                cursor: 'pointer'
                            }}
                            component="label"
                            htmlFor="file-upload"
                        >
                            <input
                                type="file"
                                onChange={handleFileChange}
                                style={{ display: 'none' }}
                                id="file-upload"
                                accept={acceptedFileExtensions}
                            />
                            <CloudUploadIcon sx={{ fontSize: 48, color: '#1976d2', mb: 2 }} />
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                {selectedFile ? selectedFile.name : 'Arrastra tu archivo aquí o haz clic para seleccionar'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                Soporta archivos PDF, DOCX, TXT, PNG, JPG
                            </Typography>

                            {selectedFile && (
                                <Button
                                    variant="outlined"
                                    size="small"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedFile(null);
                                        onFileChange(null);
                                    }}
                                    sx={{ mt: 2 }}
                                >
                                    Eliminar archivo
                                </Button>
                            )}
                        </Box>
                    </Box>
                ) : (
                    // URL Tab
                    <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ marginBottom: '1rem' }}>
                            Añade URLs para analizar y generar contenido
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
                                placeholder="https://ejemplo.com"
                            />
                            <Button
                                onClick={addUrl}
                                variant="contained"
                                color="primary"
                                sx={{ marginLeft: '0.5rem', height: '56px' }}
                            >
                                Añadir
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
                                        deleteIcon={<CloseIcon />}
                                        sx={{ maxWidth: '100%', overflow: 'hidden' }}
                                    />
                                ))}
                            </Box>
                        )}
                    </Box>
                )}
            </Box>
        </Paper>
    );
};

export default FileUploader;