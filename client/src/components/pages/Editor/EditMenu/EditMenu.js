import { Component } from "react"

import styled from "styled-components"

import { Typography, Grid, Divider } from "@material-ui/core"

import ThemeContext from "../../../../ThemeContext"
import MenuForm from "./MenuForm"
import CarteEditor from "./CarteEditor/CarteEditor"
import MenuEditor from "./MenuEditor/MenuEditor"
import CustomButton from "../../../shared/CustomButton"
import Spinner from "../../../shared/Spinner"
import SnackbarAlert from "../../../shared/SnackbarAlert"

import MenuService from "../../../../service/menu.service"

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 600px;
  margin: 0 auto -80px;
`
const MenusContainer = styled(Grid)`
  background-color: ${props => props.palette.dark};
  padding: 24px 10px;
  margin-top: 30px;
  border-radius: 9px;
  @media (max-width: 500px) {
    margin: 30px -20px 0;
  }
`
const CustomHr = styled(Divider)`
  width: 78%;
  background-color: ${props => props.palette.primary.main};
  margin: 10px auto 50px;
`
const Button = styled(CustomButton)`
  height: 62px;
  width: 100%;
  min-width: 124px;
`

class EditMenu extends Component {
  static contextType = ThemeContext

  constructor() {
    super()

    this.state = {
      menus: undefined,
      selectedMenu: null,
      selectedMenuProduct: null,
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
      const menus = (await this.menuService.getMenus()).data.message
      const menuProducts = (await this.menuService.getMenuProducts()).data
      this.setState({ menus: [...menus, ...menuProducts] })
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
    this.props.isMenuSelected(true)
    menu.isMenu
      ? this.setState({ selectedMenuProduct: menu })
      : this.setState({ selectedMenu: menu })
  }

  deselectMenu = async () => {
    this.props.isMenuSelected(false)
    try {
      const menus = (await this.menuService.getMenus()).data.message
      const menuProducts = (await this.menuService.getMenuProducts()).data
      this.setState({ menus: [...menus, ...menuProducts], selectedMenu: null, selectedMenuProduct: null })
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

  addMenu = async (e, menu, isMenu) => {
    e.preventDefault()

    if (this.state.menus.some(elm => elm.name.toUpperCase() === menu.name.toUpperCase())) {
      this.setState({
        alert: {
          open: true,
          severity: "error",
          message: `${isMenu ? "El menú" : "La carta"} ${menu.name.toUpperCase()} ya existe`,
          vertical: "bottom",
        }
      })
    }
    else if (!menu.name) {
      this.setState({
        alert: {
          open: true,
          severity: "error",
          message: `Indica el nombre d${isMenu ? "el nuevo menú" : "e la nueva carta"}`,
          vertical: "bottom",
        }
      })
    }
    else {
      try {
        const newMenu = isMenu
          ? await this.menuService.addProduct({ ...menu, isMenu })
          : await this.menuService.addMenu(menu)
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

  editMenuProduct = (menu) => {
    const menus = [...this.state.menus]
    menus.splice(this.state.menus.findIndex(elm => elm._id === menu._id), 1, menu)
    this.setState({ menus, selectedMenuProduct: menu })
  }

  deleteMenuProduct = () => {
    this.menuService.deleteProduct(this.state.selectedMenuProduct._id)
      .then(() => {
        const menus = this.state.menus.filter(elm => elm._id !== this.state.selectedMenuProduct._id)
        this.setState({
          menus,
          selectedMenuProduct: null,
          alert: {
            open: true,
            severity: "success",
            message: `${this.state.selectedMenuProduct.name.toUpperCase()} ha sido eliminado de la base de datos`,
            vertical: "bottom",
          }
        })
      })
      .catch(() => this.setState({
        alert: {
          open: true,
          severity: "error",
          message: "Error de servidor",
          vertical: "bottom",
        }
      }))
  }

  render() {
    const { palette } = this.context

    return (
      <>
        {this.state.menus
          ? this.state.selectedMenu
            ? <CarteEditor
              menu={this.state.selectedMenu}
              otherMenus={this.state.menus.filter(elm => elm._id !== this.state.selectedMenu._id)}
              deselectMenu={() => this.deselectMenu()}
              editMenu={(menu) => this.editMenu(menu)}
              deleteMenu={() => this.deleteMenu()}
            />
            : this.state.selectedMenuProduct
              ? <MenuEditor
                menu={this.state.selectedMenuProduct}
                deselectMenu={() => this.deselectMenu()}
                editMenuProduct={(menu) => this.editMenuProduct(menu)}
                deleteMenuProduct={() => this.deleteMenuProduct()}
              />
              : <Container>
                <Typography variant="h6" align="center">
                  Cartas y Menús
                  </Typography>
                <Typography variant="subtitle2" align="center">
                  Seleciona una carta o menú para acceder al editor.
                  </Typography>
                <MenusContainer palette={palette}>
                  <Grid container>
                    <Grid item xs={6}>
                      <Typography variant="body1" align="center" gutterBottom>
                        Cartas
                      </Typography>
                      <CustomHr palette={palette} />
                      {this.state.menus
                        .filter(elm => !elm.isMenu)
                        .sort((a, b) => a.createdAt - b.createdAt)
                        .map(elm => {
                          return <Grid container justify="center" key={elm._id} style={{ padding: "0 15px 30px" }}>
                            <Button onClick={() => this.selectMenu(elm)} variant="contained">
                              {elm.name}
                            </Button>
                          </Grid>
                        })
                      }
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body1" align="center" gutterBottom>
                        Menús
                      </Typography>
                      <CustomHr palette={palette} />
                      {this.state.menus
                        .filter(elm => elm.isMenu)
                        .map(elm => {
                          return <Grid container justify="center" key={elm._id} style={{ padding: "0 15px 30px" }}>
                            <Button onClick={() => this.selectMenu(elm)} variant="contained">
                              {elm.name}
                            </Button>
                          </Grid>
                        })
                      }
                    </Grid>
                  </Grid>
                  <Grid container style={{ marginTop: "30px" }}>
                    <Grid item xs={6}>
                      <MenuForm
                        type="carta"
                        menus={this.state.menus}
                        addMenu={(e, menu) => this.addMenu(e, menu)}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <MenuForm
                        type="menú"
                        menus={this.state.menus}
                        addMenu={(e, menu) => this.addMenu(e, menu, true)}
                      />
                    </Grid>
                  </Grid>
                </MenusContainer>
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