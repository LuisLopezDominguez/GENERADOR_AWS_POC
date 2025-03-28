import React, { useState } from 'react';
import { Typography, Button, Stack } from '@mui/material';
// Import the icons
import ImageIcon from '@mui/icons-material/Image';
import ArticleIcon from '@mui/icons-material/Article';
import MicIcon from '@mui/icons-material/Mic';
import FeedIcon from '@mui/icons-material/Feed';
import ViewQuiltIcon from '@mui/icons-material/ViewQuilt';

const ContentTypeSelector = ({ onContentTypeSelect }) => {
    const tiposDeContenido = ['IMAGEN', 'FLYER', 'AUDIO', 'PUBLICACION', 'ARTICULO'];
    const [selected, setSelected] = useState(null);

    // Function to get the appropriate icon for each content type
    const getIcon = (tipo) => {
        switch (tipo) {
            case 'IMAGEN':
                return <ImageIcon />;
            case 'FLYER':
                return <ViewQuiltIcon />;
            case 'AUDIO':
                return <MicIcon />;
            case 'PUBLICACION':
                return <FeedIcon />;
            case 'ARTICULO':
                return <ArticleIcon />;
            default:
                return null;
        }
    };

    const handleClick = (tipo) => {
        setSelected(tipo);
        onContentTypeSelect(tipo); // Informar al componente padre
    };

    return (
        <div style={{ marginBottom: '1rem' }}>
            <Typography variant="h6">Tipo de contenido</Typography>
            <Stack direction="row" spacing={1} sx={{ marginTop: '0.5rem' }}>
                {tiposDeContenido.map((tipo) => (
                    <Button
                        key={tipo}
                        variant={selected === tipo ? "contained" : "outlined"}
                        onClick={() => handleClick(tipo)}
                        startIcon={getIcon(tipo)}
                        sx={{
                            padding: '8px 16px',
                            borderRadius: '4px',
                        }}
                    >
                        {tipo}
                    </Button>
                ))}
            </Stack>
        </div>
    );
};

export default ContentTypeSelector;
