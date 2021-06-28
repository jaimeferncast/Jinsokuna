import { useState, useEffect, useRef, useContext } from "react"

import styled from "styled-components"

import ThemeContext from "../../../../ThemeContext"
import Hello from "./Hello"

import TOPOLOGY from "vanta/dist/vanta.topology.min"

const Container = styled.div`
  min-height: 100vh;
  padding-top: 40px;
`

function Intro(props) {
  const { palette } = useContext(ThemeContext)

  const [showOrderOptions, setShowOrderOptions] = useState(false)
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
  }, [vantaEffect, palette])

  return (
    <Container ref={vantaTopology}>
      <Hello order={props.order} />
    </Container>
  )
}

export default Intro
