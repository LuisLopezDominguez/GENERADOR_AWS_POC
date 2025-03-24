import React from 'react';
import { Typography, Button, Paper, TextField } from '@mui/material';

const GeneratedContent = ({ onBack }) => {
    return (
        <Paper elevation={3} sx={{ padding: '2rem', margin: '2rem', width: '100%', backgroundColor: '#fff', color: '#000' }}>
            <Typography variant="h4" gutterBottom>
                Contenido Generado
            </Typography>
            <Typography variant="body1" gutterBottom>
                Selecciona una red social
            </Typography>
            <Button variant="contained" sx={{ margin: '0.5rem', backgroundColor: '#1976d2', color: '#fff' }}>
                LinkedIn
            </Button>
            <Button variant="contained" sx={{ margin: '0.5rem', backgroundColor: '#1976d2', color: '#fff' }}>
                Facebook
            </Button>
            <TextField
                label="Título Generado"
                variant="outlined"
                fullWidth
                sx={{ marginTop: '1rem', backgroundColor: 'transparent', color: '#fff' }}
            />
            <TextField
                label="Contenido de la publicación"
                variant="outlined"
                multiline
                rows={4}
                fullWidth
                sx={{ marginTop: '1rem', backgroundColor: 'transparent', color: '#fff' }}
            />
            <Typography variant="body1" gutterBottom>
                Imagen
            </Typography>
            {/* Add more content as needed */}
            <Button variant="contained" sx={{ marginTop: '2rem', backgroundColor: '#ff9800', color: '#fff', '&:hover': { backgroundColor: '#e65100' } }} onClick={onBack}>
                Volver
            </Button>
        </Paper>
    );
};

export default GeneratedContent;