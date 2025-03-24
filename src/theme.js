import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#4caf50', // tu color primario (ej. verde)
        },
        secondary: {
            main: '#ff9800', // tu color secundario (ej. naranja)
        },
        background: {
            default: '#2e8b57', // Mediterranean blue background
        },
    },
    typography: {
        fontFamily: 'Roboto, Arial, sans-serif',
    },
});

export default theme;