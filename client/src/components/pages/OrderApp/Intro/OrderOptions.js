import React from "react"

import styled from "styled-components"

import { Container, StyledButton } from "./Hello"

const Button = styled(StyledButton)`
  font-size: 1.2rem;
  margin-top: 2em;
`

function OrderOptions(props) {
  return (
    <Container display="block">
      <StyledButton style={{ fontSize: "1.8rem", minWidth: "90%" }}>
        ¿Cómo os gustaría pedir?
      </StyledButton>
      <Button variant="contained" color="primary">
        Todo junto y al final dividiremos la cuenta
      </Button>
      <Button variant="contained" color="primary">
        Cada uno pedirá lo suyo (y quizás algún plato será compartido)
      </Button>
    </Container>
  )
}

export default OrderOptions
