import styled from "styled-components"

import Navigation from "../../layout/Navigation"
import Orders from "./Orders/Orders"
import EditMenu from "./EditMenu/EditMenu"
import EditUser from "./EditUser/EditUser"

const Main = styled.main`
  padding: 80px 30px 30px;
  background-color: #f1f1f1;
  height: 100vh;
`

function EditorIndex(props) {
  return (
    <>
      <Navigation
        storeUser={props.storeUser}
      />
      <Main>
        {props.location.pathname === "/carta"
          ? <EditMenu />
          : props.location.pathname === "/usuario"
            ? <EditUser />
            : <Orders />
        }
      </Main>
    </>
  )
}

export default EditorIndex