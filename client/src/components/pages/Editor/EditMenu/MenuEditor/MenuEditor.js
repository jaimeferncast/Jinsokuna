import { Component, PureComponent } from "react"

import { DragDropContext, Droppable } from "react-beautiful-dnd"

import { Grid, TextField, Button } from "@material-ui/core"
import DeleteForeverIcon from "@material-ui/icons/DeleteForever"
import EditIcon from "@material-ui/icons/Edit"

import MenuCategory from "./MenuCategory"
import IsMenuProducts from "./IsMenuProducts"
import { Container, Title, MenuForm } from "../CarteEditor/CarteEditor"
import SubNavigation from "../shared/SubNavigation"
import SnackbarAlert from "../../../../shared/SnackbarAlert"
import ProductForm from "../shared/ProductForm"
import CategoryForm from "../shared/CategoryForm"

import MenuService from "../../../../../service/menu.service"

import { capitalizeTheFirstLetterOfEachWord } from "../../../../../utils"

class InnerList extends PureComponent {
  render() {
    const {
      category,
      index,
      showConfirmationMessage,
      editCategory,
      removeProduct,
    } = this.props

    return <MenuCategory
      category={category}
      index={index}
      showConfirmationMessage={showConfirmationMessage}
      editCategory={editCategory}
      removeProduct={removeProduct}
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
      const products = (await this.menuService.getProducts()).data.message
      const isMenuProducts = products.filter(prod => prod.isMenuProduct)
      const otherMenus = products.filter(prod => prod.isMenu && prod._id !== this.props.menu._id)
      this.setState({ otherMenus, isMenuProducts, products })
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

      if (categories.some(cat => cat.products.some(prod => prod._id === draggableId))) {
        const product = this.state.products.find(elm => elm._id === draggableId)
        const category = this.state.menu.menuContent.find(cat =>
          cat.products.some(prod => prod._id === draggableId))
        this.setState({
          alert: {
            open: true,
            severity: "error",
            message: `Ya tienes ${product.name.toUpperCase()} en ${category.categoryName.toUpperCase()}`,
            vertical: "bottom",
          }
        })
      }
      else {
        const destinationIndex = categories.findIndex(elm => elm._id === destination.droppableId)

        const product = this.state.isMenuProducts[source.index - 1]
        const destinationProducts = [...categories][destinationIndex].products
        destinationProducts.splice(destination.index - 1, 0, product)

        categories[destinationIndex].products = destinationProducts
        const menu = { ...this.state.menu, menuContent: categories }
        this.setState({ menu }, () => this.updateDB(menu._id, menu))
      }
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
    menu.menuContent[categoryIndex - 1].products.splice(productIndex - 1, 1)
    this.setState({
      alert: {
        ...this.state.alert,
        open: false,
      }
    }, () => this.updateDB(menu._id, menu))
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

  openProductForm = async (index) => {
    this.setState({ openModal: true, modalProduct: { ...this.state.isMenuProducts[index] } })
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

    // clean last price if no description or price was intorduced
    if (product.price.length > 1) {
      const lastPrice = product.price[product.price.length - 1]
      if (!lastPrice.subDescription || !lastPrice.subPrice) product.price.splice(-1, 1)
    }

    if (product._id) {
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
        const isMenuProducts = products.filter(prod => prod.isMenuProduct)
        this.setState({ products, isMenuProducts }, () => this.updateDBWithMenuProduct(product._id, product))
      }
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
        <Grid container justify="flex-start" style={{ margin: "0 auto", width: "1008px" }}>
          {this.state.showMenuInput
            ? <MenuForm autoComplete="off">
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
                  <Button variant="outlined" color="primary">guardar</Button>
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
            </MenuForm>
            : <Title variant="h5" noWrap>
              {capitalizeTheFirstLetterOfEachWord(this.state.menu.name)}
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
        <Grid container justify="flex-start" style={{ margin: "0 auto", width: "1008px", fontStyle: "italic" }}>
          {(!this.state.showMenuInput && this.state.menu.description) &&
            <Title variant="subtitle1" noWrap>
              {this.props.menu.description.slice(0, 1).toUpperCase() + this.props.menu.description.slice(1)}
            </Title>
          }
        </Grid>

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
                    return <InnerList
                      key={elm._id}
                      category={elm}
                      index={index + 1}
                      showConfirmationMessage={(category, name) => this.showConfirmationMessage(category, name)}
                      editCategory={(category) => this.editCategory(category)}
                      removeProduct={(productIndex, categoryIndex) => this.removeProduct(productIndex, categoryIndex)}
                    />
                  })}
                {provided.placeholder}
              </Container>
            )}
          </Droppable>
          <IsMenuProducts
            menuDescription={this.state.menu.description ? true : false}
            isMenuProducts={this.state.isMenuProducts}
            openProductForm={(index) => this.openProductForm(index)}
            removeFromMenus={(index) => this.removeProductFromMenus(index)}
          />
        </DragDropContext>

        <Container>
          <CategoryForm addCategory={(e, category) => this.addCategory(e, category)} />
        </Container>

        {this.state.openModal &&
          <ProductForm
            open={this.state.openModal}
            handleClose={() => this.closeProductForm()}
            submitForm={(e, product) => this.submitProductForm(e, product)}
            showAlert={(message, severity, vertical) => this.showAlert(message, severity, vertical)}
            product={this.state.modalProduct}
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

