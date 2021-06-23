import { useState, useEffect, useRef, useContext } from "react"

import styled from "styled-components"

import { Typography, Button } from "@material-ui/core"

import TOPOLOGY from "vanta/dist/vanta.topology.min"

import ThemeContext from "../../../../ThemeContext"
import logo from "../../../../assets/logo_example.jpg"

const Container = styled.div`
  height: 100vh;
  width: 100%;
  padding-top: 50px;
  & .fadeIn {
    animation: fadeIn ease 7s;
    -webkit-animation: fadeIn ease 7s;
    -moz-animation: fadeIn ease 7s;
    -o-animation: fadeIn ease 7s;
    -ms-animation: fadeIn ease 7s;
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
const Subcontainer = styled.div`
  display: ${props => props.display ? "block" : "none"};
  & h4 {
    padding-inline: 30px;
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
  const { palette } = useContext(ThemeContext)

  const [showTitle, setShowTitle] = useState(false)
  const [showQuestion, setShowQuestion] = useState(false)
  const [vantaEffect, setVantaEffect] = useState(null)
  const vantaTopology = useRef(null)

  useEffect(() => {
    if (!vantaEffect) {
      setVantaEffect(TOPOLOGY({
        el: vantaTopology.current,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        scale: 1.00,
        scaleMobile: 1.00,
        color: palette.primary.main,
        backgroundColor: palette.dark,
      }))
    }
    return () => {
      if (vantaEffect) vantaEffect.destroy()
    }
  }, [])

  useEffect(() => {
    const titleTimer = setTimeout(() => setShowTitle(true), 2000)
    const questionTimer = setTimeout(() => setShowQuestion(true), 6000)
    return () => {
      clearTimeout(titleTimer)
      clearTimeout(questionTimer)
    }
  }, [])

  return (
    <Container ref={vantaTopology}>
      <Subcontainer className="fadeIn" display={showTitle}>
        <Typography variant="h2" align="center">
          Hola,
        </Typography>
        <Typography variant="h3" align="center">
          bienvenid@ a
        </Typography>
        <img src={logo} />
      </Subcontainer>
      <Subcontainer className="fadeIn" display={showQuestion}>
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
      </Subcontainer>
    </Container>
  )
}

export default Hello