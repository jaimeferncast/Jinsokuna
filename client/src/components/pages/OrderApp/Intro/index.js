import { useState, useEffect, useRef, useContext } from "react"

import styled from "styled-components"

import ThemeContext from "../../../../ThemeContext"
import Hello from "./Hello"

import TOPOLOGY from "vanta/dist/vanta.topology.min"

const Container = styled.div`
  height: 100vh;
  width: 100%;
  padding-top: 50px;
`

function Intro(props) {
  const { palette } = useContext(ThemeContext)

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

  return (
    <Container ref={vantaTopology}>
      <Hello />
    </Container>
  )
}

export default Intro