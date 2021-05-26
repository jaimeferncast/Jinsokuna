import { useContext } from "react"

import styled from "styled-components"

import { Grid } from "@material-ui/core"

import ThemeContext from "../../../../ThemeContext"
import CustomButton from "../../../shared/CustomButton"

const Container = styled(Grid)`
  height: 80px;
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 999;
  background-color: ${props => props.palette.dark + '99'};
`
const SubButton = styled(CustomButton)`
  margin: 0 20px;
`

function SubNavigation(props) {
  const { palette, changePalette } = useContext(ThemeContext)

  return (
    <Container palette={palette} container justify="center" alignItems="center">
      <SubButton
        variant="contained"
        color="primary"
        onClick={() => props.saveChanges()}
      >
        guardar cambios
      </SubButton>
      <SubButton
        variant="contained"
        color="primary"
      >
        confección de menús
      </SubButton>
      <SubButton
        variant="contained"
        color="primary"
        onClick={() => changePalette("organic")}
      >
        cambiar paleta
      </SubButton>
    </Container>
  )
}

export default SubNavigation