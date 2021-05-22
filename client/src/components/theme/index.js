import { blue, amber, pink } from '@material-ui/core/colors'

const theme = {
  palette: {
    primary: {
      main: blue[600],
      light: blue[200],
      dark: blue[900],
    },
    secondary: {
      main: '#f57757',
      light: amber[50],
    },
    third: {
      main: pink[500],
    },
    validationSuccess: {
      main: '#43bd4a',
    },
    sophisticated: {
      light: '#d9dbdf',
      dark: '#0b172a',
      primary: '#bc4123',
      primaryLight: '#c35439',
      secondary: '#463942',
    }
  },
  font: {
    primary: 'roboto',
    coffee: 'arapey',
  },
}

export default theme