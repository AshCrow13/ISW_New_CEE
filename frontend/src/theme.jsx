import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
        main: "#003366",     // Azul UBB
        },
        secondary: {
        main: "#eef7ff",     // Fondo claro
        },
        background: {
        default: "#eef7ff",  // Fondo general
        paper: "#fff"
        },
    },
    typography: {
        fontFamily: [
        'Roboto', 'Arial', 'Helvetica', 'sans-serif'
        ].join(','),
        h4: { fontWeight: 700 },
        h6: { fontWeight: 600 },
        button: { textTransform: "none", fontWeight: 700 }
    },
    shape: {
        borderRadius: 16
    },
    components: {
        MuiPaper: {
        styleOverrides: {
            root: { borderRadius: 24, boxShadow: "0 4px 24px rgba(0,0,0,0.07)" }
        }
        },
        MuiButton: {
        styleOverrides: {
            root: { borderRadius: 16 }
        }
        }
    }
});

export default theme;
