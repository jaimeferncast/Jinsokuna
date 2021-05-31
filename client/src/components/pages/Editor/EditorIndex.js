import { useContext } from "react"

import styled from "styled-components"

import ThemeContext from "../../../ThemeContext"
import Navigation from "../../layout/Navigation"
import Orders from "./Orders/Orders"
import EditMenu from "./EditMenu/EditMenu"
import EditUsers from "./EditUsers/EditUsers"

export const Main = styled.main`
  padding: 100px 30px 100px;
  background-color: ${props => props.palette.secondary.main};
  min-height: 100vh;
`

function EditorIndex(props) {
  const { palette } = useContext(ThemeContext)

  return (
    <>
      <Navigation
        storeUser={props.storeUser}
      />
      <Main palette={palette}>
        {props.location.pathname === "/carta"
          ? <EditMenu />
          : props.location.pathname === "/usuario"
            ? <EditUsers />
            : <Orders />
        }
      </Main>
    </>
  )
}

export default EditorIndex