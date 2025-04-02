import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2', // tu color primario (ej. azul)
        },
        secondary: {
            main: '#ff9800', // tu color secundario (ej. naranja)
        },

        background: {
            // Mediterranean blue background
            default: '#f0f8ff',
        },
    },
    typography: {
        fontFamily: 'Roboto, Arial, sans-serif',
    },
});

export default theme;