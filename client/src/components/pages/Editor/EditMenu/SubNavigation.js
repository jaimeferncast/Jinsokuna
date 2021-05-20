import styled from "styled-components"

import { Button, Grid } from "@material-ui/core"

const Container = styled(Grid)`
  position: fixed;
  height: 56px;
  bottom: 0;
  left: 0;
  z-index: 999;
  background-color: black;
`
const SubButton = styled(Button)`
  margin: 0 20px;
`

function SubNavigation(props) {
  return (
    <Container container justify="center" alignItems="center">
      <SubButton
        variant="contained"
        color="primary"
        onClick={() => props.saveChanges()}
      >
        guardar cambios
    </SubButton>
      <SubButton variant="contained" color="primary">
        confección de menús
    </SubButton>
    </Container>
  )
}

export default SubNavigation