import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '& .MuiInputBase-input': {
            color: 'black', // Boja teksta
          },
          '& .MuiInputLabel-root': {
            color: 'black', // Boja oznake
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'black', // Boja okvira
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'black', // Boja okvira na hover
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: 'black', // Boja okvira kada je fokusiran
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: 'black', // Boja oznake
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          backgroundColor: 'white', // Pozadina input-a
        },
      },
    },
  },
});

export default theme;