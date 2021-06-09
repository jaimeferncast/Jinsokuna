import { Component } from "react"
import { Link, withRouter } from "react-router-dom"

import styled from "styled-components"

import { AppBar, Toolbar, Grid } from "@material-ui/core"
import RoomServiceIcon from "@material-ui/icons/RoomService"
import PhonelinkRingIcon from "@material-ui/icons/PhonelinkRing"

import ThemeContext from "../../ThemeContext"
import DropDownMenu from "./DropDownMenu"
import ThemeSelection from "./ThemeSelection"
import CustomButton from "../shared/CustomButton"

import AuthService from "../../service/auth.service"

const Navbar = styled(AppBar)`
  position: fixed;
  background-color: ${props => props.palette.dark};
`
const ItemsContainer = styled(Grid)`
  display: flex;
  @media (max-width: 1067px) {
    display: none;
  }
`
const MenuItem = styled.div`
  margin-right: 20px;
`
const LogosContainer = styled(Grid)`
  display: flex;
  margin-top: 5px;
  @media (max-width: 599px) {
    margin-left: -5px;
  }
`
const LogoOne = styled(RoomServiceIcon)`
  font-size: 1.5rem;
  margin-top: 11px;
  margin-left: -5px;
  @media (max-width: 599px) {
    font-size: 1.2rem;
  }
`
const LogoTwo = styled(PhonelinkRingIcon)`
  font-size: 1.5rem;
  margin-bottom: -8px;
  @media (max-width: 599px) {
    font-size: 1.2rem;
  }
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
      .catch((err) => alert(err))
  }

  render() {
    const { palette } = this.context

    return (
      <Navbar palette={palette}>
        <Toolbar>
          <Grid container justify="space-between" alignItems="center" wrap="nowrap">
            <LogosContainer item>
              <LogoTwo color="action" />
              <LogoOne color="action" />
            </LogosContainer>
            <ThemeSelection display={this.props.isMenuSelected ? "yes" : "no"} />
            <DropDownMenu {...this.props} logoutUser={this.logoutUser} />
            <ItemsContainer item>
              <MenuItem palette={palette}>
                <Link to="/">
                  <CustomButton variant={this.props.location.pathname === "/" ? "outlined" : "text"}>
                    confección de carta
                      </CustomButton>
                </Link>
              </MenuItem>
              <MenuItem palette={palette}>
                <Link to="/pedidos">
                  <CustomButton variant={this.props.location.pathname === "/pedidos" ? "outlined" : "text"}>
                    Resumen de órdenes
                      </CustomButton>
                </Link>
              </MenuItem>
              <MenuItem palette={palette}>
                <Link to="/usuario">
                  <CustomButton variant={this.props.location.pathname === "/usuario" ? "outlined" : "text"}>
                    Gestión de usuarios
                      </CustomButton>
                </Link>
              </MenuItem>
            </ItemsContainer>
            <ItemsContainer item>
              <CustomButton
                variant="contained"
                color="primary"
                onClick={this.logoutUser}
              >Cerrar sesión</CustomButton>
            </ItemsContainer>
          </Grid>
        </Toolbar>
      </Navbar >
    )
  }
}

export default withRouter(Navigation)
