import styled from "styled-components"

import { Button, Grid } from "@material-ui/core"

const Container = styled(Grid)`
  position: fixed;
  height: 140px;
  top: 0;
  left: 0;
  padding: 0 2px 18px;
  z-index: 999;
  background-color: #f1f1f1;
`
const SubButton = styled(Button)`
  margin: 0 20px;
`

function SubNavigation(props) {
  return (
    <Container container justify="center" alignItems="flex-end">
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