import { Component } from "react"

import { Button, TextField, Typography } from "@material-ui/core"

import styled from "styled-components"

import ThemeContext from "../../../ThemeContext"
import { Main } from "../Editor/EditorIndex"

import AuthService from "../../../service/auth.service"

const Container = styled.div`
  margin-top: 10vh;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Form = styled.form`
  padding: 15px;
  border: 1px solid ${props => props.palette.light};
  background-color: ${props => props.palette.dark};
  border-radius: 5px;
  width: 90%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  & .input {
    margin-bottom: 20px;
  }
  & Button {
    margin-top: 20px;
  }
  & h3, input, label, button {
    font-family: arial;
  }
`

const Title = styled(Typography)`
  padding: 8px;
  margin-bottom: 10px
`

class Login extends Component {
  static contextType = ThemeContext

  constructor(props) {
    super()

    this.state = {
      username: '',
      password: ''
    }
    this.authService = new AuthService()
  }

  handleInputChange = (e) => {
    const { name, value } = e.target
    this.setState({ [name]: value })
  }

  handleSubmit = (e) => {
    e.preventDefault()

    this.authService
      .login(this.state)
      .then((response) => {
        this.props.storeUser(response.data)
        this.props.history.push("/")
      })
      .catch((err) => console.error(err))
  }

  render() {
    const { palette } = this.context

    return (
      <Main palette={palette}>
        <Container>
          <Form onSubmit={this.handleSubmit} palette={palette}>
            <Title align="center" component="h3" variant="h4" >
              Log In
            </Title>
            <TextField
              className="input"
              id="username"
              label="Nombre de usuario"
              type="text"
              name="username"
              value={this.state.username}
              onChange={this.handleInputChange}
            />
            <TextField
              className="input"
              id="password"
              label="Contraseña"
              type="password"
              name="password"
              value={this.state.password}
              onChange={this.handleInputChange}
            />
            <Button variant="contained" type="submit" color="primary">Entrar</Button>
          </Form>
        </Container>
      </Main>
    )
  }
}

export default Login
