import { Component } from "react"

import { ThemeProvider } from "styled-components"

import { CssBaseline } from "@material-ui/core"

import Routes from "./routes/Routes"
import theme from "./theme"

import AuthService from "../service/auth.service"

class App extends Component {
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
