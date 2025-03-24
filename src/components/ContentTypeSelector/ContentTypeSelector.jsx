import React from 'react';
import { Typography, Button, Stack } from '@mui/material';

const ContentTypeSelector = ({ onContentTypeSelect }) => {
    const tiposDeContenido = ['imagen', 'flyer', 'audio', 'publicacion', 'articulo'];

    return (
        <div style={{ marginBottom: '1rem' }}>
            <Typography variant="h6">Tipo de contenido</Typography>
            <Stack direction="row" spacing={1} sx={{ marginTop: '0.5rem' }}>
                {tiposDeContenido.map((tipo) => (
                    <Button
                        key={tipo}
                        variant="outlined"
                        onClick={() => onContentTypeSelect(tipo)}
                    >
                        {tipo}
                    </Button>
                ))}
            </Stack>
        </div>
    );
};

export default ContentTypeSelector;