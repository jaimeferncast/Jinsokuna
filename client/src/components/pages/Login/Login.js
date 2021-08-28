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

        <div style={{ maxWidth: "500px", margin: "-60px auto -40px" }}>
          <Typography align="center">
            Esta app es parte de un proyecto actualmente en construcción. Una vez accedas podrás crear, editar y eliminar tanto menús y cartas como sus correspondientes categorías y productos. Te invito a que explores todas las funcionalidades y crees tus platos favoritos (se quedarán guardados en la base de datos).  Puedes escribir <a href="mailto:jaimeferncast@gmail.com" target="_blank">aquí</a> lo que te parece.
            <br />
            <i>Please feel free to use the app and explore its functionalities to add, edit, delete any of the menus/products/categories. Any feedback sent <a href="mailto:jaimeferncast@gmail.com" target="_blank">here</a> would be much appreciated.</i>
            <br />
            <br />
            Accede a la app con las siguientes credenciales:
            <br />
            <i>Access the app with the following credentials:</i>
            <br />
            <strong>nombre de usuario "editor" contraseña "123"</strong>
            <br />
          </Typography>
        </div>

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
