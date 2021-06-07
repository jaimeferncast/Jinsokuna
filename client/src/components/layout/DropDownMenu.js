import { useState, useContext } from "react"
import { Link, withRouter } from "react-router-dom"

import styled from "styled-components"

import { IconButton, Menu, MenuItem } from "@material-ui/core"
import MenuIcon from "@material-ui/icons/Menu"

import ThemeContext from "../../ThemeContext"
import CustomButton from "../shared/CustomButton"

const DropDown = styled(Menu)`
  & .MuiPopover-paper {
    border: 1px solid #767676;
    background-color: ${props => props.palette.dark};
  }
  & a {
    text-decoration: none;
  }
`

function DropDownMenu(props) {
  const { palette } = useContext(ThemeContext)

  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <div>
      <IconButton onClick={handleClick}>
        <MenuIcon />
      </IconButton>
      <DropDown
        palette={palette}
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleClose}
      >
        <MenuItem>
          <Link to="/">
            <CustomButton
              width="-webkit-fill-available"
              variant={props.location.pathname === "/" ? "outlined" : "text"}
              onClick={handleClose}
            >confección de carta</CustomButton>
          </Link>
        </MenuItem>
        <MenuItem>
          <Link to="/pedidos">
            <CustomButton
              width="-webkit-fill-available"
              variant={props.location.pathname === "/pedidos" ? "outlined" : "text"}
              onClick={handleClose}
            >Resumen de órdenes</CustomButton>
          </Link>
        </MenuItem>
        <MenuItem>
          <Link to="/usuario">
            <CustomButton
              width="-webkit-fill-available"
              variant={props.location.pathname === "/usuario" ? "outlined" : "text"}
              onClick={handleClose}
            >Gestión de usuarios</CustomButton>
          </Link>
        </MenuItem>
        <MenuItem>
          <CustomButton
            width="-webkit-fill-available"
            variant="contained"
            color="primary"
            onClick={props.logoutUser}
          >Cerrar sesión</CustomButton>
        </MenuItem>
      </DropDown>
    </div>
  )
}

export default withRouter(DropDownMenu)
