import { useContext } from "react"

import styled from "styled-components"

import { Grid } from "@material-ui/core"

import ThemeContext from "../../../../../ThemeContext"
import CustomButton from "../../../../shared/CustomButton"

const Container = styled(Grid)`
  height: 80px;
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 1000;
  background-color: ${props => props.palette.dark + 'cc'};
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
        guardar cambios y volver
      </SubButton>
      <SubButton
        variant="contained"
        color="primary"
      >
        vista previa de carta
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