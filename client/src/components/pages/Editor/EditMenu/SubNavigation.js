import styled from "styled-components"

import { Button, Grid } from "@material-ui/core"

const Container = styled(Grid)`
  position: fixed;
  left: calc(50% + 104px);
  top: 98px;
  width: 400px;
  padding: 0 2px;
  @media (max-width: 1067px) {
    display: none;
  }
`

function SubNavigation(props) {
  return (
    <Container container justify="space-between">
      <Button
        variant="contained"
        color="primary"
        onClick={() => props.saveChanges()}
      >
        guardar cambios
    </Button>
      <Button variant="contained" color="primary">
        confección de menús
    </Button>
    </Container>
  )
}

export default SubNavigation