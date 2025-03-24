import React, { useState } from 'react';
import FileUploader from '../FileUploader/FileUploader';
import ContentTypeSelector from '../ContentTypeSelector/ContentTypeSelector';
import TechnicalFields from '../TechnicalFields/TechnicalFields';
import GeneratedContent from '../GeneratedContent/GeneratedContent'; // Import the new component
import { Typography, Button, Paper } from '@mui/material';

const NewPublication = () => {
    const [archivo, setArchivo] = useState(null);
    const [tipoContenido, setTipoContenido] = useState('');
    const [resolucion, setResolucion] = useState('');
    const [formato, setFormato] = useState('');
    const [aspectRatio, setAspectRatio] = useState('');
    const [showGeneratedContent, setShowGeneratedContent] = useState(false); // State to toggle screens

    const handleFileChange = (file) => {
        setArchivo(file);
    };

    const handleContentTypeSelect = (tipo) => {
        setTipoContenido(tipo);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        // Simulate API call
        setTimeout(() => {
            setShowGeneratedContent(true); // Show the new screen
        }, 1000);
    };

    const handleBack = () => {
        setShowGeneratedContent(false); // Go back to the form
    };

    if (showGeneratedContent) {
        return <GeneratedContent onBack={handleBack} />;
    }

    return (
        <Paper elevation={3} sx={{ padding: '2rem', margin: '2rem', width: '100%', backgroundColor: '#ffffff' }}>
            <Typography variant="h4" gutterBottom>
                Nueva publicación
            </Typography>

            <FileUploader onFileChange={handleFileChange} />
            <ContentTypeSelector onContentTypeSelect={handleContentTypeSelect} />
            <TechnicalFields
                resolucion={resolucion}
                formato={formato}
                aspectRatio={aspectRatio}
                onResolucionChange={(e) => setResolucion(e.target.value)}
                onFormatoChange={(e) => setFormato(e.target.value)}
                onAspectRatioChange={(e) => setAspectRatio(e.target.value)}
            />

            <Button variant="contained" sx={{ backgroundColor: '#ff9800', color: '#fff', '&:hover': { backgroundColor: '#e65100' } }} onClick={handleSubmit}>
                Generar contenido
            </Button>
        </Paper>
    );
};

export default NewPublication;