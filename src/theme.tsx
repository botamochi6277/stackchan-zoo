import { createTheme } from '@mui/material/styles';

const my_theme = createTheme({
    typography: {
        fontFamily: [
            '"M PLUS 1"',
            '"Helvetica"',
            'Arial',
            'sans-serif',
        ].join(','),
    }
})


export default my_theme;