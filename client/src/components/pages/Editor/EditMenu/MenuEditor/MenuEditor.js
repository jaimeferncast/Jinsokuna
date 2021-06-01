import { Component, PureComponent } from "react"

import styled from "styled-components"

import { DragDropContext, Droppable } from "react-beautiful-dnd"

import { Typography, Grid, TextField, Button, Divider } from "@material-ui/core"
import DeleteForeverIcon from "@material-ui/icons/DeleteForever"
import EditIcon from "@material-ui/icons/Edit"

import ThemeContext from "../../../../../ThemeContext"
import MenuCategory from "./MenuCategory"
import { Container, Title } from "../CarteEditor/CarteEditor"
import { Tooltip } from "../CarteEditor/ProductTooltip"
import SubNavigation from "../shared/SubNavigation"
import Spinner from "../../../../shared/Spinner"
import SnackbarAlert from "../../../../shared/SnackbarAlert"
import ProductForm from "../shared/ProductForm"
import CategoryForm from "../shared/CategoryForm"

import MenuService from "../../../../../service/menu.service"

import { capitalizeTheFirstLetterOfEachWord, findCategoryIndex, saveChanges } from "../../../../../utils"

class InnerList extends PureComponent {
  render() {
    const {
      category,
      index,
      products,
      showConfirmationMessage,
      editCategory,
    } = this.props

    return <MenuCategory
      category={category}
      index={index}
      products={products}
      showConfirmationMessage={showConfirmationMessage}
      editCategory={editCategory}
    />
  }
}

class MenuEditor extends Component {
  static contextType = ThemeContext

  constructor(props) {
    super()

    this.state = {
      menu: props.menu,
      showMenuInput: false,
      isMenuProducts: undefined,
      openModal: false,
      modalProduct: null,
      productFormKey: 0,
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
      const products = (await this.menuService.getProducts()).data.message
      const isMenuProducts = products.filter(prod => prod.isMenuProduct)
      this.setState({ isMenuProducts })
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

  showAlert = (message, severity, vertical) => {
    this.setState({
      alert: {
        open: true,
        message,
        severity,
        vertical,
      }
    })
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

  showConfirmationMessage = (category) => {
    category
      ? this.setState({
        alert: {
          open: true,
          message: "¿Seguro que quieres borrar la categoría?",
          severity: "warning",
          vertical: "top",
          category,
        }
      })
      : this.setState({
        alert: {
          open: true,
          message: "¿Seguro que quieres borrar el menú?",
          severity: "warning",
          vertical: "top",
        }
      })
  }

  toggleMenuInput = () => {
    if (!this.state.showMenuInput) {
      window.addEventListener('mousedown', (e) => this.handleClick(e))
      this.setState({ showMenuInput: true })
    }
  }

  handleClick = (e) => {
    if (e.target.name !== "name" && e.target.name !== "description") this.MenuInputSubmit()
  }

  handleMenuInputChange = (e) => {
    const { value, name } = e.target
    this.setState({ menu: { ...this.state.menu, [name]: value } })
  }

  MenuInputSubmit = (e) => {
    e ? e.preventDefault() : window.removeEventListener('mousedown', this.handleClick)
    this.setState({ showMenuInput: false })
  }

  addCategory = (e, category) => {
    e.preventDefault()

    if (this.state.menu.menuContent.some(cat => cat.categoryName.toUpperCase() === category.toUpperCase())) {
      this.setState({
        alert: {
          open: true,
          severity: "error",
          message: `La categoría ${category.toUpperCase()} ya existe`,
          vertical: "bottom",
        }
      })
    }
    else if (!category) {
      this.setState({
        alert: {
          open: true,
          severity: "error",
          message: "Indica el nombre de la nueva categoría",
          vertical: "bottom",
        }
      })
    }
    else {
      const menu = { ...this.state.menu }
      menu.menuContent.push({ categoryName: category })
      this.menuService.updateProduct(menu._id, menu)
        .then(res => this.setState({ menu: res.data }))
        .catch(() => this.setState({
          alert: {
            open: true,
            severity: "error",
            message: "Error de servidor",
            vertical: "bottom",
          }
        }))
    }
  }

  editCategory = (category) => {
    if (this.state.menu.menuContent.some(cat =>
      cat.categoryName.toUpperCase() === category.categoryName.toUpperCase()
    )) this.setState({
      alert: {
        open: true,
        severity: "error",
        message: `La categoría ${category.categoryName.toUpperCase()} ya existe`,
        vertical: "bottom",
      }
    })
    else if (!category.categoryName) {
      this.setState({
        alert: {
          open: true,
          severity: "error",
          message: "No puedes dejar el nombre de la categoría en blanco",
          vertical: "bottom",
        }
      })
    }
    else {
      const menu = { ...this.state.menu }
      const categoryIndex = menu.menuContent.findIndex(elm => elm._id === category._id)
      menu.menuContent.splice(categoryIndex, 1, category)
      this.menuService.updateProduct(menu._id, menu)
        .then(res => this.setState({ menu: res.data }))
        .catch(() => this.setState({
          alert: {
            open: true,
            severity: "error",
            message: "Error de servidor",
            vertical: "bottom",
          }
        }))
    }
  }

  deleteCategory = (id) => {
    const menu = { ...this.state.menu }
    const categoryIndex = menu.menuContent.findIndex(elm => elm._id === id)
    menu.menuContent.splice(categoryIndex, 1)
    this.menuService.updateProduct(menu._id, menu)
      .then(res => this.setState({ menu: res.data }))
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
        <> {/* title fragment */}
          <Grid container justify="flex-start" style={{ margin: "0 auto", width: "1008px" }}>
            {this.state.showMenuInput
              ? <form onSubmit={this.MenuInputSubmit} style={{ width: "500px", margin: "-17px 80px 0 0" }}>
                <Grid container justify="space-between" alignItems="flex-end" style={{ paddingLeft: "50px" }}>
                  <Grid item xs={7}>
                    <TextField
                      fullWidth
                      name="name"
                      label="Nombre de la Carta"
                      type="text"
                      autoFocus
                      value={this.state.menu.name}
                      onChange={this.handleMenuInputChange}
                    />
                  </Grid>
                  <Grid item>
                    <Button
                      type="submit"
                      variant="outlined"
                      color="primary"
                    >guardar</Button>
                  </Grid>
                </Grid>
                <Grid container justify="space-between" alignItems="flex-end" style={{ paddingLeft: "50px" }}>
                  <Grid item xs={12}>
                    <TextField
                      style={{ width: '99%', marginTop: '10px' }}
                      name="description"
                      label="Descripción"
                      type="text"
                      value={this.state.menu.description}
                      onChange={this.handleMenuInputChange}
                    />
                  </Grid>
                </Grid>
              </form>
              : <Title variant="h5" noWrap>
                {capitalizeTheFirstLetterOfEachWord(this.props.menu.name)}
              </Title>
            }
            {!this.state.showMenuInput &&
              <Grid item>
                <Grid container wrap="nowrap">
                  <Button
                    style={{ minWidth: '0', padding: '5px 12px 5px 0' }}
                    onClick={() => this.toggleMenuInput()}
                    endIcon={<EditIcon />}
                  ></Button>
                  <Button
                    style={{ minWidth: '0', padding: '5px 12px 5px 0' }}
                    onClick={() => this.showConfirmationMessage()}
                    color="primary"
                    endIcon={<DeleteForeverIcon />}
                  ></Button>
                </Grid>
              </Grid>
            }
          </Grid>
          <>
            {(!this.state.showMenuInput && this.state.menu.description) &&
              <Grid container justify="flex-start" style={{ margin: "0 auto", width: "1008px", fontStyle: "italic" }}>
                <Title variant="subtitle1" noWrap>
                  {capitalizeTheFirstLetterOfEachWord(this.state.menu.description)}
                </Title>
              </Grid>
            }
          </>
        </>

        <SubNavigation goBack={() => this.goBack()} />

        <DragDropContext onDragEnd={this.onDragEnd}>
          <Droppable droppableId="menu" type="category">
            {provided => (
              <Container style={{ marginTop: "30px" }}
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {this.state.menu.menuContent
                  .map((elm, index) => {
                    return <p>{elm.categoryName}</p>
                    // <InnerList
                    //   key={elm._id}
                    //   category={elm.categoryName}
                    //   index={index}
                    //   products={elm.products}
                    //   showConfirmationMessage={(category) => this.showConfirmationMessage(category)}
                    //   editCategory={(category) => this.editCategory(category)}
                    // />
                  })}
                {provided.placeholder}
              </Container>
            )}
          </Droppable>
        </DragDropContext>

        <Container>
          <CategoryForm addCategory={(e, category) => this.addCategory(e, category)} />
        </Container>

        <SnackbarAlert
          anchorOrigin={{ vertical: this.state.alert.vertical, horizontal: 'center' }}
          open={this.state.alert.open}
          message={this.state.alert.message}
          severity={this.state.alert.severity}
          id={this.state.alert.category?._id}
          category={this.state.alert.category}
          closeAlert={(message, severity) => this.closeAlert(message, severity)}
          deleteMenu={this.props.deleteMenuProduct}
          deleteCategory={(i, id) => this.deleteCategory(id, i)}
        />
      </>
    )
  }
}

export default MenuEditor

