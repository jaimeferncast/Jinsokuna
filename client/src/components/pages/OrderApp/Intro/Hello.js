import { useState, useEffect } from "react"
import { Link, withRouter } from "react-router-dom"

import styled from "styled-components"

import { Typography, Button } from "@material-ui/core"

// import logo from "../../../../assets/logo_example.jpg"

export const Container = styled.div`
  display: ${props => props.display};
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
  & a {
    text-decoration: none;
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
export const StyledButton = styled(Button)`
  display: block;
  margin: 0 auto;
  max-width: 230px;
  text-transform: none;
`

function Hello(props) {
  const [showTitle, setShowTitle] = useState(false)
  const [showQuestion, setShowQuestion] = useState(false)

  useEffect(() => {
    const titleTimer = setTimeout(() => setShowTitle(true), 2000)
    const questionTimer = setTimeout(() => setShowQuestion(true), 4000)
    return () => {
      clearTimeout(titleTimer)
      clearTimeout(questionTimer)
    }
  }, [])

  return (
    <>
      <Container display={showTitle ? "block" : "none"}>
        <Typography variant="h2" align="center">
          Hola,
        </Typography>
        <Typography variant="h3" align="center" gutterBottom>
          bienvenid@ a
        </Typography>
        <Typography variant="h1" align="center">
          LUIS II
        </Typography>
        {/* <img src={logo} /> */}
      </Container>
      <Container display={showQuestion ? "block" : "none"}>
        <Typography variant="h4" align="center" style={{ margin: "15px 0 40px" }}>
          ¿Te gustaría pedir con tu móvil?
        </Typography>
        <StyledButton
          variant="contained"
          color="primary"
          style={{ fontSize: "2rem", padding: "10px 45px" }}
          onClick={props.order}
        >
          ¡Sí!
        </StyledButton>
        <Link to="/carta">
          <StyledButton style={{ fontSize: "1.2rem", margin: "30px auto 30px" }}>
            No, quiero ver la carta y pedir al camarero.
          </StyledButton>
        </Link>
      </Container>
    </>
  )
}

export default withRouter(Hello)
