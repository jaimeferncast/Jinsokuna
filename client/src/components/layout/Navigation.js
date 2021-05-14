import { Component } from "react"
import { Link, withRouter } from "react-router-dom"

import styled from "styled-components"

import DropDownMenu from "./DropDownMenu"

import { AppBar, Toolbar, Grid, Button } from "@material-ui/core"

import AuthService from "../../service/auth.service"

const MenuItem = styled.div`
  margin-left: 20px;
  & .MuiButton-outlined {
    border: 1px solid rgba(0, 0, 0, 0.50);
  }
  & .MuiButton-text {
    border: 1px solid rgba(0, 0, 0, 0);
    padding: 5px 15px;
  }
`

class Navigation extends Component {
  constructor() {
    super()
    this.state = {
      mobile: window.screen.width > 1067 ? false : true,
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
          <Grid container justify="space-between" alignItems="center" wrap="nowrap">
            <Grid item>
              <Button onClick={this.logoutUser}>Cerrar sesión</Button>
            </Grid>
            {this.state.mobile
              ? <DropDownMenu {...this.props} />
              : <Grid item style={{ display: "flex" }}>
                <MenuItem>
                  <Link to="/">
                    <Button variant={this.props.location.pathname === "/" ? "outlined" : "text"}>
                      Resumen de órdenes
                </Button>
                  </Link>
                </MenuItem>
                <MenuItem>
                  <Link to="/carta">
                    <Button variant={this.props.location.pathname === "/carta" ? "outlined" : "text"}>
                      confección de carta
                </Button>
                  </Link>
                </MenuItem>
                <MenuItem>
                  <Link to="/usuario">
                    <Button variant={this.props.location.pathname === "/usuario" ? "outlined" : "text"}>
                      Gestión de usuarios
                </Button>
                  </Link>
                </MenuItem>
              </Grid>
            }
          </Grid>
        </Toolbar>
      </AppBar>
    )
  }
}

export default withRouter(Navigation)
