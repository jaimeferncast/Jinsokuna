import { Component, PureComponent } from "react"

import styled from "styled-components"

import { DragDropContext, Droppable } from "react-beautiful-dnd"

import { Grid, TextField, Button } from "@material-ui/core"
import DeleteForeverIcon from "@material-ui/icons/DeleteForever"
import EditIcon from "@material-ui/icons/Edit"

import MenuCategory from "./MenuCategory"
import IsMenuProducts from "./IsMenuProducts"
import { Container, Title, MenuForm, MenuTitleContainer, MenuFormFieldContainer } from "../CarteEditor/CarteEditor"
import SubNavigation from "../shared/SubNavigation"
import SnackbarAlert from "../../../../shared/SnackbarAlert"
import ProductForm from "../shared/ProductForm"
import CategoryForm from "../shared/CategoryForm"

import MenuService from "../../../../../service/menu.service"

import { capitalizeTheFirstLetterOfEachWord, filterIsMenuProductInMenu } from "../../../../../utils"

const DroppableContainer = styled(Grid)`
  @media (max-width: 1067px) {
    width: -webkit-fill-available;
  }
`

class InnerList extends PureComponent {
  render() {
    const {
      category,
      index,
      showConfirmationMessage,
      editCategory,
      removeProduct,
      openProductForm,
      addMenuProduct,
    } = this.props

    return <MenuCategory
      category={category}
      index={index}
      showConfirmationMessage={showConfirmationMessage}
      editCategory={editCategory}
      removeProduct={removeProduct}
      openProductForm={openProductForm}
      addMenuProduct={addMenuProduct}
    />
  }
}

class MenuEditor extends Component {

  constructor(props) {
    super()

    this.state = {
      menu: props.menu,
      showMenuInput: false,
      otherMenus: undefined,
      isMenuProducts: undefined,
      products: undefined,
      openModal: false,
      modalProduct: null,
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
      const categories = (await this.menuService.getCategories()).data.message
      const products = (await this.menuService.getProducts()).data.message
      const isMenuProducts = filterIsMenuProductInMenu(products.filter(prod => prod.isMenuProduct), this.props.menu)
      const otherMenus = products.filter(prod => prod.isMenu && prod._id !== this.props.menu._id)
      this.setState({ otherMenus, isMenuProducts, products, categories })
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

  onDragEnd = (result) => {
    const { destination, source, draggableId, type } = result

    // 1 - if dropped outside the droppable elements
    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) return

    // 2 - if dragging a category
    if (type === 'category') {
      const categories = [...this.state.menu.menuContent]
      const [category] = categories.splice(source.index - 1, 1)
      categories.splice(destination.index - 1, 0, category)
      const menu = { ...this.state.menu, menuContent: categories }
      this.setState({ menu }, () => this.updateDB(menu._id, menu))
    }

    // 3 - if dragging a product inside the same category
    else if (source.droppableId === destination.droppableId
      && destination.droppableId !== "isMenuProducts") {
      const categories = [...this.state.menu.menuContent]
      const categoryIndex = categories.findIndex(elm => elm._id === source.droppableId)
      const products = [...categories][categoryIndex].products

      const [product] = products.splice(source.index - 1, 1)
      products.splice(destination.index - 1, 0, product)
      categories[categoryIndex].products = products
      const menu = { ...this.state.menu, menuContent: categories }
      this.setState({ menu }, () => this.updateDB(menu._id, menu))
    }

    // 4 - if dragging a product from isMenuProducts
    else if (source.droppableId === "isMenuProducts" && destination.droppableId !== "isMenuProducts") {
      const categories = [...this.state.menu.menuContent]
      let isMenuProducts = [...this.state.isMenuProducts]

      const destinationIndex = categories.findIndex(elm => elm._id === destination.droppableId)

      const product = this.state.isMenuProducts[source.index - 1]
      const destinationProducts = [...categories][destinationIndex].products
      destinationProducts.splice(destination.index - 1, 0, product)

      isMenuProducts.splice(isMenuProducts.findIndex(elm => elm._id === draggableId), 1)

      categories[destinationIndex].products = destinationProducts
      const menu = { ...this.state.menu, menuContent: categories }
      this.setState({ menu, isMenuProducts }, () => this.updateDB(menu._id, menu))
    }

    // 5 - if dragging a product to a different category
    else if (destination.droppableId !== "isMenuProducts") {
      const categories = [...this.state.menu.menuContent]
      const sourceIndex = categories.findIndex(elm => elm._id === source.droppableId)
      const destinationIndex = categories.findIndex(elm => elm._id === destination.droppableId)

      const sourceProducts = [...categories][sourceIndex].products
      const [product] = sourceProducts.splice(source.index - 1, 1)
      const destinationProducts = [...categories][destinationIndex].products
      destinationProducts.splice(destination.index - 1, 0, product)

      categories[sourceIndex].products = sourceProducts
      categories[destinationIndex].products = destinationProducts
      const menu = { ...this.state.menu, menuContent: categories }
      this.setState({ menu }, () => this.updateDB(menu._id, menu))
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

  showConfirmationMessage = (index, name) => {
    index
      ? this.setState({
        alert: {
          open: true,
          message: "¿Seguro que quieres borrar la categoría?",
          severity: "warning",
          vertical: "top",
          i: index,
          id: name,
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
      window.addEventListener('mousedown', this.handleClick)
      window.addEventListener('keypress', this.handleEnter)
      this.setState({ showMenuInput: true })
    }
  }

  handleClick = (e) => {
    if (e.target.name !== "name" && e.target.name !== "description") this.MenuInputSubmit(e)
  }

  handleEnter = (e) => {
    e.key === "Enter" && this.MenuInputSubmit()
  }

  handleMenuInputChange = (e) => {
    const { value, name } = e.target
    this.setState({ menu: { ...this.state.menu, [name]: value } })
  }

  MenuInputSubmit = (e) => {
    if (this.state.otherMenus.some(elm => elm.name.toUpperCase() === this.state.menu.name.toUpperCase())) {
      window.removeEventListener('mousedown', this.handleClick)
      window.removeEventListener('keypress', this.handleEnter)
      this.setState({
        menu: {
          ...this.state.menu,
          name: this.props.menu.name
        },
        showMenuInput: false,
        alert: {
          open: true,
          severity: "error",
          message: `Ya existe un menú con el nombre ${this.state.menu.name.toUpperCase()}`,
          vertical: "bottom",
        }
      })
    }
    else if (this.state.menu.name === "") {
      window.removeEventListener('mousedown', this.handleClick)
      window.removeEventListener('keypress', this.handleEnter)
      this.setState({
        menu: {
          ...this.state.menu,
          name: this.props.menu.name
        },
        showMenuInput: false,
        alert: {
          open: true,
          severity: "error",
          message: "No puedes dejar el nombre del menú en blanco",
          vertical: "bottom",
        }
      })
    }
    else {
      window.removeEventListener('mousedown', this.handleClick)
      window.removeEventListener('keypress', this.handleEnter)
      this.props.editMenuProduct(this.state.menu)
      this.setState({
        showMenuInput: false,
        alert: {
          ...this.state.alert,
          open: false,
        }
      }, () => this.updateDB(this.state.menu._id, this.state.menu))
    }
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
      this.setState({
        alert: {
          ...this.state.alert,
          open: false,
        }
      }, () => this.updateDB(menu._id, menu))
    }
  }

  editCategory = (category) => {
    if (this.state.menu.menuContent.filter(elm => elm._id !== category._id).some(cat =>
      cat.categoryName.toUpperCase() === category.categoryName.toUpperCase()
    )) this.setState({
      alert: {
        open: true,
        severity: "error",
        message: `La categoría ${category.categoryName.toUpperCase()} ya existe`,
        vertical: "bottom",
      }
    })
    else if (category.categoryName === "") {
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
      this.setState({
        alert: {
          ...this.state.alert,
          open: false,
        }
      }, () => this.updateDB(menu._id, menu))
    }
  }

  deleteCategory = (id, index) => {
    const menu = { ...this.state.menu }
    menu.menuContent.splice(index - 1, 1)
    this.setState({
      alert: {
        ...this.state.alert,
        open: false,
      }
    }, () => this.updateDB(menu._id, menu))
  }

  removeProduct = (productIndex, categoryIndex) => {
    const menu = { ...this.state.menu }
    let isMenuProducts = [...this.state.isMenuProducts]
    const product = menu.menuContent[categoryIndex - 1].products[productIndex - 1]

    isMenuProducts.push(product)
    menu.menuContent[categoryIndex - 1].products.splice(productIndex - 1, 1)
    this.setState({ isMenuProducts }, () => this.updateDB(menu._id, menu))
  }

  addMenuProduct = (e, name, categoryIndex) => {
    e.preventDefault()
    const menu = { ...this.state.menu }
    let products = [...this.state.products]
    const product = { name, isMenuProduct: true }

    if (products.some(prod => prod.name.toUpperCase() === product.name.toUpperCase())) {
      this.setState({
        alert: {
          open: true,
          severity: "error",
          message: `El producto ${product.name.toUpperCase()} ya existe`,
          vertical: "bottom",
        }
      })
    }
    else {
      this.menuService.addProduct(product)
        .then(res => {
          menu.menuContent[categoryIndex].products.push(res.data)
          products.push(res.data)
          this.setState({ menu, products })
        })
        .catch(err => this.setState({
          alert: {
            open: true,
            severity: "error",
            message: "Error de servidor",
            vertical: "bottom",
          }
        }))
    }
  }

  updateDB = (id, data) => {
    this.menuService.updateProduct(id, data)
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

  openProductForm = (id) => {
    const [modalProduct] = this.state.products.filter(elm => elm._id === id)
    this.setState({ openModal: true, modalProduct })
  }

  closeProductForm = () => {
    this.setState({ openModal: false, modalProduct: null })
  }

  removeProductFromMenus = (index) => {
    const updatedProduct = { ...this.state.isMenuProducts[index] }
    const isMenuProducts = [...this.state.isMenuProducts]
    updatedProduct.isMenuProduct = false
    isMenuProducts.splice(index, 1)
    this.setState({ isMenuProducts }, () => this.updateDBWithMenuProduct(updatedProduct._id, updatedProduct))
  }

  submitProductForm = async (e, product) => {
    e.preventDefault()
    let products = [...this.state.products]
    let isMenuProducts = [...this.state.isMenuProducts]

    // clean last price if no description or price was intorduced
    if (product.price.length > 1) {
      const lastPrice = product.price[product.price.length - 1]
      if (!lastPrice.subDescription || !lastPrice.subPrice) product.price.splice(-1, 1)
    }

    const otherProducts = products.filter(prod => prod._id !== product._id)
    if (otherProducts.some(prod => prod.name.toUpperCase() === product.name.toUpperCase())) {
      this.setState({
        alert: {
          open: true,
          severity: "error",
          message: `El producto ${product.name.toUpperCase()} ya existe`,
          vertical: "bottom",
        }
      })
    }
    else {
      products.splice(products.findIndex(elm => elm._id === product._id), 1, product)
      isMenuProducts.splice(isMenuProducts.findIndex(elm => elm._id === product._id), 1, product)
      this.setState({ products, isMenuProducts }, () => this.updateDBWithMenuProduct(product._id, product))
    }
  }

  updateDBWithMenuProduct = (id, data) => {
    this.menuService.updateProduct(id, data)
      .then(() => this.closeProductForm())
      .catch(() => this.setState({
        alert: {
          open: true,
          severity: "error",
          message: "Error de servidor",
          vertical: "bottom",
        }
      }))
  }

  goBack = () => {
    this.props.deselectMenu()
  }

  render() {

    return (
      <>
        <MenuTitleContainer container justify="flex-start">
          {this.state.showMenuInput
            ? <MenuForm autoComplete="off">
              <MenuFormFieldContainer container justify="space-between" alignItems="flex-end" wrap="nowrap">
                <Grid item xs={7} style={{ marginRight: "24px" }}>
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
                  <Button variant="outlined" color="primary">guardar</Button>
                </Grid>
              </MenuFormFieldContainer>
              <MenuFormFieldContainer container justify="space-between" alignItems="flex-end">
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
              </MenuFormFieldContainer>
            </MenuForm>
            : <Grid item>
              <Title variant="h5">
                {capitalizeTheFirstLetterOfEachWord(this.state.menu.name)}
              </Title>
            </Grid>
          }
          {!this.state.showMenuInput &&
            <Grid item style={{ paddingRight: '22px' }}>
              <Grid container wrap="nowrap">
                <Button
                  style={{ minWidth: '0', padding: '5px 12px 5px 0' }}
                  onClick={() => this.toggleMenuInput()}
                  endIcon={<EditIcon />}
                ></Button>
                <Button
                  style={{ minWidth: '0', padding: '5px 0 5px 0' }}
                  onClick={() => this.showConfirmationMessage()}
                  endIcon={<DeleteForeverIcon />}
                ></Button>
              </Grid>
            </Grid>
          }
        </MenuTitleContainer>
        <MenuTitleContainer container justify="flex-start" fontStyle="italic">
          {(!this.state.showMenuInput && this.state.menu.description) &&
            <Title variant="subtitle1">
              {this.props.menu.description.slice(0, 1).toUpperCase() + this.props.menu.description.slice(1)}
            </Title>
          }
        </MenuTitleContainer>

        <SubNavigation goBack={() => this.goBack()} />

        <DragDropContext onDragEnd={this.onDragEnd}>
          <Grid container justify="center">
            <DroppableContainer item>
              <Droppable droppableId="menu" type="category">
                {provided => (
                  <Container width="548px" margin="30px 0 0"
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {this.state.menu.menuContent
                      .map((elm, index) => {
                        return <InnerList
                          key={elm._id}
                          category={elm}
                          index={index + 1}
                          showConfirmationMessage={(category, name) => this.showConfirmationMessage(category, name)}
                          editCategory={(category) => this.editCategory(category)}
                          removeProduct={(productIndex, categoryIndex) => this.removeProduct(productIndex, categoryIndex)}
                          openProductForm={(id) => this.openProductForm(id)}
                          addMenuProduct={(e, name) => this.addMenuProduct(e, name, index)}
                        />
                      })}
                    {provided.placeholder}
                  </Container>
                )}
              </Droppable>

              <Container width="548px" margin="0 auto">
                <CategoryForm addCategory={(e, category) => this.addCategory(e, category)} />
              </Container>
            </DroppableContainer>
            <IsMenuProducts
              menuDescription={this.state.menu.description ? true : false}
              isMenuProducts={this.state.isMenuProducts}
              openProductForm={(id) => this.openProductForm(id)}
              removeFromMenus={(index) => this.removeProductFromMenus(index)}
            />
          </Grid>
        </DragDropContext>


        {this.state.openModal &&
          <ProductForm
            open={this.state.openModal}
            handleClose={() => this.closeProductForm()}
            submitForm={(e, product) => this.submitProductForm(e, product)}
            showAlert={(message, severity, vertical) => this.showAlert(message, severity, vertical)}
            product={this.state.modalProduct}
            otherCategories={this.state.categories}
            otherMenus={this.props.otherMenus}
            key={this.state.modalProduct._id}
          />
        }
        <SnackbarAlert
          anchorOrigin={{ vertical: this.state.alert.vertical, horizontal: 'center' }}
          open={this.state.alert.open}
          message={this.state.alert.message}
          severity={this.state.alert.severity}
          i={this.state.alert.i}
          id={this.state.alert.id}
          closeAlert={(message, severity) => this.closeAlert(message, severity)}
          deleteMenu={this.props.deleteMenuProduct}
          deleteCategory={(i, id) => this.deleteCategory(id, i)}
        />
      </>
    )
  }
}

export default MenuEditor

