import React, { useState } from 'react';
import { Typography, Button, TextField } from '@mui/material';

const FileUploader = ({ onFileChange }) => {
    const [url, setUrl] = useState('');

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        onFileChange(file);
    };

    const handleUrlChange = (event) => {
        setUrl(event.target.value);
    };

    return (
        <div style={{ marginBottom: '1rem' }}>
            <Typography variant="h6">Carga tu Archivo o URL</Typography>
            <Typography variant="body2" color="text.secondary">
                Puedes cargar un archivo o pegar un link para generar contenido para tu red social
            </Typography>
            <input type="file" onChange={handleFileChange} />
            <Button variant="contained" sx={{ backgroundColor: '#1976d2', color: '#fff', marginLeft: '1rem' }}> {/* Azul */}
                Cargar Archivos
            </Button>
            <TextField
                label="URL"
                variant="outlined"
                value={url}
                onChange={handleUrlChange}
                sx={{ marginTop: '1rem', width: '100%' }}
            />
        </div>
    );
};

export default FileUploader;