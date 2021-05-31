import { Component } from "react"

import { Button, TextField, Typography } from "@material-ui/core"

import styled from "styled-components"

import ThemeContext from "../../../ThemeContext"
import { Main } from "../Editor/EditorIndex"

import AuthService from "../../../service/auth.service"

const Container = styled.div`
  margin-top: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Form = styled.form`
  padding: 15px;
  border: 1px solid lightgrey;
  background-color: white;
  border-radius: 2px;
  width: 90%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  & .input {
    margin-bottom: 20px;
  }
  & Button {
    margin-top: 20px;
    background-color: lightgrey;
  }
`

const Title = styled(Typography)`
  padding: 8px;
  margin-bottom: 10px
`

class Login extends Component {

  constructor() {
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
    return (
      <Container>
        <Form onSubmit={this.handleSubmit}>
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
          <Button type="submit">Entrar</Button>
        </Form>
      </Container>
    )
  }
}

export default Login
