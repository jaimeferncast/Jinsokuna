import { Component } from "react"
import { Link, withRouter } from "react-router-dom"

import DropDownMenu from "./DropDownMenu"

import { AppBar, Toolbar, Grid, Button } from "@material-ui/core"

import AuthService from "../../service/auth.service"

class Navigation extends Component {
  constructor() {
    super()
    this.state = {
      mobile: window.screen.width > 768 ? false : true,
    }
    this.authService = new AuthService()
  }

  logoutUser = () => {
    this.authService
      .logout()
      .then(() => {
        this.props.storeUser(undefined)
      })
      .catch((err) => console.log(err))
  }

  render() {
    return (
      <AppBar position="fixed">
        <Toolbar>
          <Grid container justify="space-between" alignItems="center">
            <Grid item>
              <Button onClick={this.logoutUser}>Cerrar sesión</Button>
            </Grid>
            {this.state.mobile
              ? <DropDownMenu {...this.props} />
              : <Grid item>
                <Link to="/">
                  <Button variant={this.props.location.pathname === "/" ? "outlined" : "text"}>
                    Resumen de órdenes
                </Button>
                </Link>
                <Link to="/carta">
                  <Button variant={this.props.location.pathname === "/carta" ? "outlined" : "text"}>
                    confección de carta
                </Button>
                </Link>
                <Link to="/usuario">
                  <Button variant={this.props.location.pathname === "/usuario" ? "outlined" : "text"}>
                    Gestión de usuarios
                </Button>
                </Link>
              </Grid>
            }
          </Grid>
        </Toolbar>
      </AppBar>
    )
  }
}

export default withRouter(Navigation)
