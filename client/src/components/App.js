import { Component } from "react"

import { CssBaseline, ThemeProvider } from "@material-ui/core"
import { createMuiTheme } from '@material-ui/core/styles'

import Routes from "./routes/Routes"
import ThemeContext from "../ThemeContext"

import AuthService from "../service/auth.service"

class App extends Component {
  static contextType = ThemeContext

  constructor() {
    super()

    this.state = {
      loggedUser: null,
    }
    this.authService = new AuthService()
  }

  componentDidMount() {
    this.fetchUser()
  }

  fetchUser() {
    this.authService
      .isLoggedIn()
      .then((response) => this.storeUser(response.data))
      .catch((err) => {
        this.storeUser(err.loggedUser)
      })
  }

  storeUser(loggedUser) {
    this.setState({ loggedUser })
  }

  render() {
    const { palette, font } = this.context
    const theme = createMuiTheme({
      palette: {
        primary: palette.primary,
      }
    })

    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {this.state.loggedUser !== null && (
          <Routes
            storeUser={(user) => this.storeUser(user)}
            loggedUser={this.state.loggedUser}
          />
        )}
      </ThemeProvider>
    )
  }
}

export default App
