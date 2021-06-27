import { useContext, useState } from "react"

import styled from "styled-components"

import ThemeContext from "../../../ThemeContext"
import Navigation from "../../layout/Navigation"
import Orders from "./Orders/Orders"
import EditMenu from "./EditMenu/EditMenu"
import EditUsers from "./EditUsers/EditUsers"

export const Main = styled.main`
  padding: 100px 30px 80px;
  background-color: ${props => props.palette.secondary.main};
  min-height: 100vh;
  @media (max-width: 1067px) {
    padding: 100px 10px 80px;
  }
`

function EditorIndex(props) {
  const { palette } = useContext(ThemeContext)
  const [isSelected, isMenuSelected] = useState(false)

  return (
    <>
      <Navigation
        storeUser={props.storeUser}
        isMenuSelected={isSelected}
      />
      <Main palette={palette}>
        {props.location.pathname === "/pedidos"
          ? <Orders />
          : props.location.pathname === "/usuarios"
            ? <EditUsers />
            : <EditMenu isMenuSelected={(isSelected) => isMenuSelected(isSelected)} />
        }
      </Main>
    </>
  )
}

export default EditorIndex