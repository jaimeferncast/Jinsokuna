import { Component } from "react"

import styled from "styled-components"

import { Typography, Grid, Divider } from "@material-ui/core"

import ThemeContext from "../../../../ThemeContext"
import MenuForm from "./MenuForm"
import CarteEditor from "./CarteEditor/CarteEditor"
import CustomButton from "../../../shared/CustomButton"
import Spinner from "../../../shared/Spinner"
import SnackbarAlert from "../../../shared/SnackbarAlert"
import MenuService from "../../../../service/menu.service"

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 800px;
  margin: 100px auto 0;
`
const CustomHr = styled(Divider)`
  width: 78%;
  background-color: ${props => props.palette.primary.main};
  margin: 10px 0 20px;
`

class EditMenu extends Component {
  static contextType = ThemeContext

  constructor() {
    super()

    this.state = {
      menus: undefined,
      selectedMenu: null,
      alert: {
        open: false,
        message: "",
        severity: undefined,
        vertical: "bottom",
      },
    }
    this.menuService = new MenuService()
  }

  componentDidMount = async () => {
    try {
      const menus = await this.menuService.getMenus()
      this.setState({ menus: menus.data.message, })
    }
    catch (error) {
      this.setState({
        alert: {
          open: true,
          severity: "error",
          message: "Error de servidor",
          vertical: "bottom",
        }
      })
    }
  }

  closeAlert = (message, severity) => {
    this.setState({
      alert: {
        ...this.state.alert,
        open: false,
        message,
        severity,
      }
    })
  }

  selectMenu = (menu) => {
    this.setState({ selectedMenu: menu })
  }

  deselectMenu = () => {
    this.setState({ selectedMenu: null })
  }

  addMenu = async (e, menu) => {
    e.preventDefault()

    if (this.state.menus.some(elm => elm.name.toUpperCase() === menu.name.toUpperCase())) {
      this.setState({
        alert: {
          open: true,
          severity: "error",
          message: `La carta ${menu.name.toUpperCase()} ya existe`,
          vertical: "bottom",
        }
      })
    }
    else if (!menu.name) {
      this.setState({
        alert: {
          open: true,
          severity: "error",
          message: "Indica el nombre de la nueva carta",
          vertical: "bottom",
        }
      })
    }
    else {
      try {
        const newMenu = await this.menuService.addMenu(menu)
        const menus = [...this.state.menus, newMenu.data]
        this.setState({ menus })
      }
      catch (error) {
        this.setState({
          alert: {
            open: true,
            severity: "error",
            message: "Error de servidor",
            vertical: "bottom",
          }
        })
      }
    }
  }

  editMenu = async (menu) => {
    try {
      const updatedMenu = await this.menuService.updateMenu(menu._id, menu)
      const menus = [...this.state.menus].filter(elm => elm._id !== menu._id).concat(updatedMenu.data)
      this.setState({ menus, selectedMenu: updatedMenu.data })
    }
    catch (error) {
      this.setState({
        alert: {
          open: true,
          severity: "error",
          message: "Error de servidor",
          vertical: "bottom",
        }
      })
    }
  }

  deleteMenu = async () => {
    try {
      const categories = (await this.menuService.getCategories()).data.message
      const categoriesInDeletedMenu = categories.filter(cat => cat.inMenu === this.state.selectedMenu._id)
      Promise.all(categoriesInDeletedMenu.map(cat => this.menuService.deleteCategory(cat._id)))

      const deletedMenu = await this.menuService.deleteMenu(this.state.selectedMenu._id, this.state.selectedMenu)
      const menus = [...this.state.menus].filter(elm => elm._id !== this.state.selectedMenu._id)
      this.setState({
        menus,
        selectedMenu: null,
        alert: {
          open: true,
          severity: "success",
          message: `La carta ${deletedMenu.data.name.toUpperCase()} ha sido eliminado de la base de datos`,
          vertical: "bottom",
        }
      })
    }
    catch (error) {
      this.setState({
        alert: {
          open: true,
          severity: "error",
          message: "Error de servidor",
          vertical: "bottom",
        }
      })
    }
  }

  render() {
    const { palette } = this.context

    return (
      <>
        {this.state.menus
          ? this.state.selectedMenu
            ? <CarteEditor
              menu={this.state.selectedMenu}
              deselectMenu={() => this.deselectMenu()}
              editMenu={(menu) => this.editMenu(menu)}
              deleteMenu={() => this.deleteMenu()}
            />
            : <Container>
              <Typography variant="h6">
                Selecciona la carta que quieras editar:
            </Typography>
              <CustomHr palette={palette} />
              <Grid container>
                <Grid item xs={6}>
                  {this.state.menus.map(elm => {
                    return <Grid container justify="center" key={elm._id}>
                      <CustomButton onClick={() => this.selectMenu(elm)}>
                        {elm.name}
                      </CustomButton>
                    </Grid>
                  })
                  }
                  <MenuForm
                    addMenu={(e, menu) => this.addMenu(e, menu)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Grid container justify="center">
                    <CustomButton>
                      menú de día
                </CustomButton>
                  </Grid>
                </Grid>
              </Grid>
            </Container>
          : <Spinner />
        }
        <SnackbarAlert
          anchorOrigin={{ vertical: this.state.alert.vertical, horizontal: 'center' }}
          open={this.state.alert.open}
          message={this.state.alert.message}
          severity={this.state.alert.severity}
          closeAlert={(message, severity) => this.closeAlert(message, severity)}
        />
      </>
    )
  }
}

export default EditMenu