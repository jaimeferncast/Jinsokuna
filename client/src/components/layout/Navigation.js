import { Component } from "react"
import { Link, withRouter } from "react-router-dom"

import styled from "styled-components"

import DropDownMenu from "./DropDownMenu"

import { AppBar, Toolbar, Grid, Button } from "@material-ui/core"
import { withTheme } from "@material-ui/core/styles"
import RestaurantMenuIcon from "@material-ui/icons/RestaurantMenu"

import CustomButton from "../shared/CustomButton"

import AuthService from "../../service/auth.service"

const Navbar = styled(AppBar)`
  position: fixed;
  background-color: ${props => props.theme.palette.sophisticated.dark};
`
const MenuItem = styled.div`
  margin-right: 20px;
  & .MuiButton-root {
    padding: 5px 15px;
  }
`
const Logo = styled(RestaurantMenuIcon)`
  color: ${props => props.theme.palette.sophisticated.primary};
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
      <Navbar>
        <Toolbar>
          <Grid container justify="space-between" alignItems="center" wrap="nowrap">
            <Grid item>
              <Logo fontSize="large" />
            </Grid>
            {this.state.mobile
              ? <DropDownMenu {...this.props} />
              : <Grid item style={{ display: "flex" }}>
                <MenuItem>
                  <Link to="/">
                    <CustomButton variant={this.props.location.pathname === "/" && "outlined"}>
                      Resumen de órdenes
                </CustomButton>
                  </Link>
                </MenuItem>
                <MenuItem>
                  <Link to="/carta">
                    <CustomButton variant={this.props.location.pathname === "/carta" && "outlined"}>
                      confección de carta
                </CustomButton>
                  </Link>
                </MenuItem>
                <MenuItem>
                  <Link to="/usuario">
                    <CustomButton variant={this.props.location.pathname === "/usuario" && "outlined"}>
                      Gestión de usuarios
                </CustomButton>
                  </Link>
                </MenuItem>
              </Grid>
            }
            <Grid item>
              <CustomButton variant="filled" onClick={this.logoutUser}>Cerrar sesión</CustomButton>
            </Grid>
          </Grid>
        </Toolbar>
      </Navbar>
    )
  }
}

export default withRouter(withTheme(Navigation))
