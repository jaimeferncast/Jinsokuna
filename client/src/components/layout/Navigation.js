import { Component } from "react"
import { Link, withRouter } from "react-router-dom"

import styled from "styled-components"

import { AppBar, Toolbar, Grid } from "@material-ui/core"
import RestaurantMenuIcon from "@material-ui/icons/RestaurantMenu"

import ThemeContext from "../../ThemeContext"
import DropDownMenu from "./DropDownMenu"
import CustomButton from "../shared/CustomButton"

import AuthService from "../../service/auth.service"

const Navbar = styled(AppBar)`
  position: fixed;
  background-color: ${props => props.palette.dark};
`
const MenuItem = styled.div`
  margin-right: 20px;
`
const Logo = styled(RestaurantMenuIcon)`
  color: ${props => props.palette.primary.main};
`

class Navigation extends Component {
  static contextType = ThemeContext

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
    const { palette } = this.context

    return (
      <Navbar palette={palette}>
        <Toolbar>
          <Grid container justify="space-between" alignItems="center" wrap="nowrap">
            <Grid item>
              <Logo palette={palette} fontSize="large" />
            </Grid>
            {this.state.mobile
              ? <DropDownMenu {...this.props} />
              : <Grid item style={{ display: "flex" }}>
                <MenuItem>
                  <Link to="/">
                    <CustomButton type={this.props.location.pathname === "/" ? "outlined" : "text"}>
                      Resumen de órdenes
                </CustomButton>
                  </Link>
                </MenuItem>
                <MenuItem>
                  <Link to="/carta">
                    <CustomButton type={this.props.location.pathname === "/carta" ? "outlined" : "text"}>
                      confección de carta
                </CustomButton>
                  </Link>
                </MenuItem>
                <MenuItem>
                  <Link to="/usuario">
                    <CustomButton type={this.props.location.pathname === "/usuario" ? "outlined" : "text"}>
                      Gestión de usuarios
                </CustomButton>
                  </Link>
                </MenuItem>
              </Grid>
            }
            <Grid item>
              <CustomButton type="filled" onClick={this.logoutUser}>Cerrar sesión</CustomButton>
            </Grid>
          </Grid>
        </Toolbar>
      </Navbar>
    )
  }
}

export default withRouter(Navigation)
