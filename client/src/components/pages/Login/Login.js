import { Component } from "react"

import styled from 'styled-components'

import AuthService from "../../../service/auth.service"

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Form = styled.form`
  margin: 8px;
  border: 1px solid lightgrey;
  background-color: white;
  border-radius: 2px;
  width: 90%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
`

const Title = styled.h3`
  padding: 8px;
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
          <Title align="center">
            Log In
            </Title>
          <input
            id="username"
            label="Nombre de usuario"
            type="text"
            name="username"
            value={this.state.username}
            onChange={this.handleInputChange}
          />
          <input
            id="password"
            label="Contraseña"
            type="password"
            name="password"
            value={this.state.password}
            onChange={this.handleInputChange}
          />
          <button
            type="submit"
          >
            Entrar
            </button>
        </Form>
      </Container>
    )
  }
}

export default Login
