import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';

const TopBar = () => {
    return (
        <AppBar position="static" sx={{ backgroundColor: '#1976d2' }}> {/* Azul AWS */}
            <Toolbar>
                <Typography variant="h6">
                    Generador de Contenido AWS
                </Typography>
            </Toolbar>
        </AppBar>
    );
};

export default TopBar;