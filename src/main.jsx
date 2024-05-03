import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './Components/App';
import { ThemeProvider, createTheme, experimental_sx as sx } from '@mui/material/styles';


const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        text: {
            primary: '#B0B8C4',
        }
    },
    overrides: {
        MuiInput: {
            input: {
                "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
                    "-webkit-appearance": "none",
                    display: "none"
                }
            }
        }
    }
});

ReactDOM.createRoot(document.getElementById('root')).render(
    <ThemeProvider theme={darkTheme}>
        <App />
    </ThemeProvider>
)
