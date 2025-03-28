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
                        minHeight: '48px',
                        '& .MuiAccordionSummary-content': {
                            margin: '12px 0'
                        }
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <SettingsIcon color="primary" />
                        <Typography variant="h6">Propiedades Técnicas</Typography>
                    </Box>
                </AccordionSummary>
                <AccordionDetails sx={{ pt: 0, pb: 2 }}>
                    <Stack spacing={2}>
                        <TextField
                            label="Resolución"
                            variant="outlined"
                            value={resolucion}
                            onChange={onResolucionChange}
                            placeholder="Ejemplo: 1920x1080"
                            size="small"
                        />
                        <TextField
                            label="Formato"
                            variant="outlined"
                            value={formato}
                            onChange={onFormatoChange}
                            placeholder="Ejemplo: JPG, PNG, MP4"
                            size="small"
                        />
                        <TextField
                            label="Aspect Ratio"
                            variant="outlined"
                            value={aspectRatio}
                            onChange={onAspectRatioChange}
                            placeholder="Ejemplo: 16:9, 4:3, 1:1"
                            size="small"
                        />
                    </Stack>
                </AccordionDetails>
            </Accordion>
        </Box>
    );
};

export default TechnicalFields;