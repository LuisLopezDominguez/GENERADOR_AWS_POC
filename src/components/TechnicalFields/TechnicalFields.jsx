import React from 'react';
import { Typography, TextField, Stack } from '@mui/material';

const TechnicalFields = ({
    resolucion,
    formato,
    aspectRatio,
    onResolucionChange,
    onFormatoChange,
    onAspectRatioChange,
}) => {
    return (
        <div style={{ marginBottom: '1rem' }}>
            <Typography variant="h6">Propiedades Técnicas</Typography>
            <Stack spacing={2} sx={{ marginTop: '0.5rem' }}>
                <TextField
                    label="Resolución"
                    variant="outlined"
                    value={resolucion}
                    onChange={onResolucionChange}
                />
                <TextField
                    label="Formato"
                    variant="outlined"
                    value={formato}
                    onChange={onFormatoChange}
                />
                <TextField
                    label="Aspect Ratio"
                    variant="outlined"
                    value={aspectRatio}
                    onChange={onAspectRatioChange}
                />
            </Stack>
        </div>
    );
};

export default TechnicalFields;