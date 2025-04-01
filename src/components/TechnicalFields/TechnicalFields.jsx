import React, { useState } from 'react';
import {
    Typography,
    TextField,
    Stack,
    Box,
    Accordion,
    AccordionSummary,
    AccordionDetails
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const TechnicalFields = ({
    resolucion,
    formato,
    aspectRatio,
    onResolucionChange,
    onFormatoChange,
    onAspectRatioChange,
    // New image generation parameters
    cfgScale,
    steps,
    onCfgScaleChange,
    onStepsChange
}) => {
    const [expanded, setExpanded] = useState(false);

    const handleAccordionChange = () => {
        setExpanded(!expanded);
    };

    return (
        <Box sx={{ marginBottom: '1rem' }}>
            <Accordion
                expanded={expanded}
                onChange={handleAccordionChange}
                sx={{
                    boxShadow: 'none',
                    border: '1px solid rgba(0, 0, 0, 0.12)',
                    borderRadius: '8px',
                    '&:before': {
                        display: 'none',
                    }
                }}
            >
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    sx={{
                        backgroundColor: 'rgba(0, 0, 0, 0.03)',
                        borderRadius: '8px 8px 0 0',
                    }}
                >
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <SettingsIcon color="primary" />
                        <Typography>Propiedades técnicas</Typography>
                    </Stack>
                </AccordionSummary>
                <AccordionDetails>
                    <Stack spacing={2}>
                        {/* Existing fields */}
                        <TextField
                            label="Resolución"
                            variant="outlined"
                            fullWidth
                            size="small"
                            value={resolucion}
                            onChange={onResolucionChange}
                            placeholder="Ej: 1920x1080"
                        />
                        <TextField
                            label="Formato"
                            variant="outlined"
                            fullWidth
                            size="small"
                            value={formato}
                            onChange={onFormatoChange}
                            placeholder="Ej: JPG, PNG, etc."
                        />
                        <TextField
                            label="Aspect Ratio"
                            variant="outlined"
                            fullWidth
                            size="small"
                            value={aspectRatio}
                            onChange={onAspectRatioChange}
                            placeholder="Ej: 16:9, 4:3, etc."
                        />

                        {/* New image generation parameters */}
                        <Typography variant="subtitle2" sx={{ mt: 2 }}>
                            Parámetros de generación de imagen
                        </Typography>

                        <TextField
                            label="Escala de configuración (CFG Scale)"
                            variant="outlined"
                            fullWidth
                            size="small"
                            type="number"
                            value={cfgScale}
                            onChange={onCfgScaleChange}
                            placeholder="Valor entre 1-20 (recomendado: 12)"
                            helperText="Controla qué tan fielmente la imagen sigue el prompt. Valores más altos = más fidelidad."
                            InputProps={{ inputProps: { min: 1, max: 20 } }}
                        />

                        <TextField
                            label="Pasos de generación (Steps)"
                            variant="outlined"
                            fullWidth
                            size="small"
                            type="number"
                            value={steps}
                            onChange={onStepsChange}
                            placeholder="Valor entre 20-100 (recomendado: 73)"
                            helperText="Controla la calidad y detalle. Valores más altos = más detalle pero más tiempo."
                            InputProps={{ inputProps: { min: 20, max: 100 } }}
                        />
                    </Stack>
                </AccordionDetails>
            </Accordion>
        </Box>
    );
};

export default TechnicalFields;
