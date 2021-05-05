import { useState } from "react"
import { Link, withRouter } from "react-router-dom"

import styled from "styled-components"

import { IconButton, Menu, MenuItem, Button } from "@material-ui/core"
import MenuIcon from "@material-ui/icons/Menu"

const DropDown = styled(Menu)`
  border: '1px solid #333333';
`

function DropDownMenu(props) {
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
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleClose}
      >
        <MenuItem>
          <Link to="/">
            <Button
              variant={props.location.pathname === "/" ? "outlined" : ""}
              onClick={handleClose}
            >Resumen de órdenes</Button>
          </Link>
        </MenuItem>
        <MenuItem>
          <Link to="/carta">
            <Button
              variant={props.location.pathname === "/carta" ? "outlined" : ""}
              onClick={handleClose}
            >confección de carta</Button>
          </Link>
        </MenuItem>
        <MenuItem>
          <Link to="/usuario">
            <Button
              variant={props.location.pathname === "/usuario" ? "outlined" : ""}
              onClick={handleClose}
            >Gestión de usuarios</Button>
          </Link>
        </MenuItem>
      </DropDown>
    </div>
  )
}

export default withRouter(DropDownMenu)
