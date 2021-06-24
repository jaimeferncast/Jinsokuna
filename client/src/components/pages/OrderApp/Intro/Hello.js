import { useState, useEffect } from "react"

import styled from "styled-components"

import { Typography, Button } from "@material-ui/core"

import logo from "../../../../assets/logo_example.jpg"

const Container = styled.div`
  display: ${props => props.display ? "block" : "none"};
  animation: fadeIn ease 7s;
  -webkit-animation: fadeIn ease 7s;
  -moz-animation: fadeIn ease 7s;
  -o-animation: fadeIn ease 7s;
  -ms-animation: fadeIn ease 7s;
  & h4 {
    padding-inline: 30px;
  }
  & img {
    width: 100%;
    margin-block: 25px;
  }
  @keyframes fadeIn {
    0% {
      opacity:0;
    }
    100% {
      opacity:1;
    }
  }
  @-moz-keyframes fadeIn {
    0% {
      opacity:0;
    }
    100% {
      opacity:1;
    }
  }
  @-webkit-keyframes fadeIn {
    0% {
      opacity:0;
    }
    100% {
      opacity:1;
    }
  }
  @-o-keyframes fadeIn {
    0% {
      opacity:0;
    }
    100% {
      opacity:1;
    }
  }
  @-ms-keyframes fadeIn {
    0% {
      opacity:0;
    }
    100% {
      opacity:1;
    }
  }
`
const StyledButton = styled(Button)`
  display: block;
  margin: 60px auto;
  max-width: 150px;
  text-transform: none;
  transform: ${props => `scale(${props.scale})`};
`

function Hello(props) {
  const [showTitle, setShowTitle] = useState(false)
  const [showQuestion, setShowQuestion] = useState(false)

  useEffect(() => {
    const titleTimer = setTimeout(() => setShowTitle(true), 2000)
    const questionTimer = setTimeout(() => setShowQuestion(true), 6000)
    return () => {
      clearTimeout(titleTimer)
      clearTimeout(questionTimer)
    }
  }, [])

  return (
    <>
      <Container display={showTitle}>
        <Typography variant="h2" align="center">
          Hola,
        </Typography>
        <Typography variant="h3" align="center" gutterBottom>
          bienvenid@ a
        </Typography>
        <Typography variant="h1" align="center" gutterBottom>
          PAI PÁI
        </Typography>
        {/* <img src={logo} /> */}
      </Container>
      <Container display={showQuestion}>
        <Typography variant="h4" align="center">
          ¿Te gustaría pedir con tu móvil?
        </Typography>
        <StyledButton
          variant="contained"
          color="primary"
          scale={2}
        >
          ¡Sí!
        </StyledButton>
        <StyledButton scale={1.4}>
          No, quiero ver la carta y pedir al camarero.
        </StyledButton>
      </Container>
    </>
  )
}

export default Hello