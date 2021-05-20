import { blue, amber, pink } from '@material-ui/core/colors'

const theme = {
  palette: {
    primary: {
      main: blue[600],
      light: blue[200],
      dark: blue[900],
    },
    secondary: {
      main: amber[200],
      light: amber[50],
    },
    third: {
      main: pink[500],
    },
    validationSuccess: {
      main: '#43bd4a',
    },
  },
  font: {
    primary: 'roboto',
  },
}

export default theme