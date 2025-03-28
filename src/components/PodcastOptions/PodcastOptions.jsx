import React from 'react';
import { Box, Typography, Select, MenuItem, InputLabel, Slider, FormControl } from '@mui/material';

const PodcastOptions = ({
    tipoVoz,
    setTipoVoz,
    creatividad,
    setCreatividad,
    tono,
    setTono,
    tipoPodcast,
    setTipoPodcast,
    objetivoPodcast,
    setObjetivoPodcast }) => {
    return (
        <Box sx={{ mt: 3 }}>
            <Typography variant="h6">Parámetros de podcast</Typography>

            <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel id="tipo-voz-label">Voz</InputLabel>
                <Select
                    labelId="tipo-voz-label"
                    value={tipoVoz}
                    label="Voz"
                    onChange={(e) => setTipoVoz(e.target.value)}
                >
                    <MenuItem value="Conchita">Conchita (ES)</MenuItem>
                    <MenuItem value="Lucia">Lucia (ES)</MenuItem>
                    <MenuItem value="Enrique">Enrique (ES)</MenuItem>
                    <MenuItem value="Mia">Mia (EN)</MenuItem>
                </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel id="tono-label">Tono</InputLabel>
                <Select
                    labelId="tono-label"
                    value={tono}
                    onChange={(e) => setTono(e.target.value)}
                    label="Tono"
                >
                    {['Formal', 'Informal', 'Emotivo', 'Chistoso', 'Amigable'].map((tone) => (
                        <MenuItem key={tone} value={tone}>{tone}</MenuItem>
                    ))}
                </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel id="tipo-podcast-label">Tipo de Podcast</InputLabel>
                <Select
                    labelId="tipo-podcast-label"
                    value={tipoPodcast}
                    onChange={(e) => setTipoPodcast(e.target.value)}
                    label="Tipo de Podcast"
                >
                    {['Educativo', 'Publicitario', 'Deportivo', 'Cultural', 'Noticias', 'Motivacional'].map((tipo) => (
                        <MenuItem key={tipo} value={tipo}>{tipo}</MenuItem>
                    ))}
                </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel id="objetivo-label">Objetivo</InputLabel>
                <Select
                    labelId="objetivo-label"
                    value={objetivoPodcast}
                    onChange={(e) => setObjetivoPodcast(e.target.value)}
                    label="Objetivo"
                >
                    {['Informar', 'Inspirar', 'Entretener', 'Convencer', 'Educar', 'Vender'].map((obj) => (
                        <MenuItem key={obj} value={obj}>{obj}</MenuItem>
                    ))}
                </Select>
            </FormControl>



            <Typography gutterBottom sx={{ mt: 3 }}>
                Creatividad: {creatividad}
            </Typography>
            <Slider
                value={creatividad}
                onChange={(e, val) => setCreatividad(val)}
                step={0.1}
                min={0}
                max={1}
                valueLabelDisplay="auto"
            />
        </Box>
    );
};

export default PodcastOptions;
