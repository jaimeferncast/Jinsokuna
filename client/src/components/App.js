import { Component } from "react"

import Routes from "./routes/Routes"

import { CssBaseline } from "@material-ui/core"

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
    return (<>
      <CssBaseline />
      {this.state.loggedUser !== null && (
        <Routes
          storeUser={(user) => this.storeUser(user)}
          loggedUser={this.state.loggedUser}
        />
      )}
    </>)
  }
}

export default App
