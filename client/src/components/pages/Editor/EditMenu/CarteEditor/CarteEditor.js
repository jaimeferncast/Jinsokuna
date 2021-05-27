import { Component, PureComponent } from "react"

import styled from "styled-components"

import { DragDropContext, Droppable } from "react-beautiful-dnd"

import { Typography, Grid, TextField, Button } from "@material-ui/core"
import DeleteForeverIcon from "@material-ui/icons/DeleteForever"
import EditIcon from "@material-ui/icons/Edit"

import ThemeContext from "../../../../../ThemeContext"
import Category from "./Category"
import ProductForm from "./ProductForm"
import CategoryForm from "./CategoryForm"
import ProductTooltip from "./ProductTooltip"
import SubNavigation from "./SubNavigation"
import Spinner from "../../../../shared/Spinner"
import SnackbarAlert from "../../../../shared/SnackbarAlert"

import MenuService from "../../../../../service/menu.service"

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 1008px;
  margin: 0 auto;
  @media (max-width: 1067px) {
    width: auto;
    align-items: center;
  }
`
const Title = styled(Typography)`
  padding: 0 65px;
  font-weight: 400;
`

class InnerList extends PureComponent {
  render() {
    const {
      category,
      products,
      index,
      showConfirmationMessage,
      editCategory,
      openProductForm,
      editProduct,
      showProductTooltip,
      hideProductTooltip,
    } = this.props

    return <Category
      category={category}
      products={products}
      index={index}
      showConfirmationMessage={showConfirmationMessage}
      editCategory={editCategory}
      openProductForm={openProductForm}
      editProduct={editProduct}
      showProductTooltip={showProductTooltip}
      hideProductTooltip={hideProductTooltip}
    />
  }
}

class CarteEditor extends Component {
  static contextType = ThemeContext

  constructor(props) {
    super()

    this.state = {
      menu: props.menu,
      showMenuInput: false,
      categories: undefined,
      products: undefined,
      openModal: false, // edit product form
      modalProduct: null,
      productFormKey: 0, // key for the ProductForm component when it's a new product and does not have _id yet
      showProductTooltip: false, // overview of the product
      tooltipProduct: undefined,
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
      const menuCategories = categories.filter(cat => cat.inMenu === this.props.menu._id)

      this.setState({ categories: menuCategories, products, })
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

  onDragEnd = (result) => {
    const { destination, source, draggableId, type } = result
    const index = (elm, category) => elm.categories.find(cat => cat.id === category).index

    // 1 - if dropped outside the droppable elements
    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) return

    // 2 - if dragging a category
    if (type === 'category') {
      const newCategories = [...this.state.categories],
        src = source.index + 1, dest = destination.index + 1

      newCategories.forEach((cat, i, arr) => {
        (dest > src)
          ? (dest >= cat.index && cat.index > src) && arr[i].index--
          : (dest <= cat.index && cat.index < src) && arr[i].index++

        if (cat._id === draggableId) { arr[i].index = dest }
      })
      this.setState({ categories: newCategories })
    }

    // 3 - if dragging a product inside the same category
    else if (source.droppableId === destination.droppableId) {
      const category = source.droppableId

      // filter products in category
      const newProducts = this.state.products.filter(prod => {
        return prod.categories.some(cat => {
          return cat.id === category
        })
      })

      // change index of category in each product
      newProducts.forEach((prod, i, arr) => {
        (destination.index > source.index)
          ? (destination.index >= index(prod, category) && index(prod, category) > source.index)
          && arr[i].categories.find(cat => cat.id === category).index--
          : (destination.index <= index(prod, category) && index(prod, category) < source.index)
          && arr[i].categories.find(cat => cat.id === category).index++

        if (prod._id === draggableId) { // dragged product
          arr[i].categories.find(cat => cat.id === category).index = destination.index
        }
      })

      const products = [
        ...this.state.products.filter(prod => {
          return prod.categories.every(cat => {
            return cat.id !== category
          })
        }),
        ...newProducts
      ]
      this.setState({ products })
    }

    // 4 - if dragging a product to a different category
    else {
      // filter source category products
      const newSourceProducts = this.state.products.filter(prod => {
        return prod.categories.some(cat => {
          return cat.id === source.droppableId
        })
      })
      // filter destination category products
      const newDestinationProducts = this.state.products.filter(prod => {
        return prod.categories.some(cat => {
          return cat.id === destination.droppableId
        })
      })

      // change index of category in each source product
      newSourceProducts.forEach((prod, i, arr) => {
        (prod.index > source.index) && arr[i].categories.find(cat => cat.id === source.droppableId).index--
        if (prod._id === draggableId) {
          arr[i].categories.find(cat => cat.id === source.droppableId).id = destination.droppableId
          destination.index
            ? arr[i].categories.find(cat => cat.id === destination.droppableId).index = destination.index
            : arr[i].categories.find(cat => cat.id === destination.droppableId).index = 1
        }
      })

      // change index of category in each destination product
      newDestinationProducts.forEach((prod, i, arr) => {
        (destination.index <= index(prod, destination.droppableId))
          && arr[i].categories.find(cat => cat.id === destination.droppableId).index++
      })

      const products = [
        ...this.state.products.filter(prod => {
          return prod.categories.every(cat => {
            return cat.id !== source.droppableId && cat.id !== destination.droppableId
          })
        }),
        ...newSourceProducts,
        ...newDestinationProducts,
      ]
      this.setState({ products })
    }
  }

  showConfirmationMessage = (i, id, category) => {
    id // id passed => category or product
      ? this.setState({
        alert: {
          open: true,
          message: `¿Seguro que quieres borrar ${category // category passed => product
            ? "el producto?" // no category passed => category
            : "la categoría? También se borrarán los productos que contenga, si es que los hay."}`,
          severity: "warning",
          vertical: "top",
          i,
          id,
          category,
        }
      }) // no id passed => menu
      : this.setState({
        alert: {
          open: true,
          message: "¿Seguro que quieres borrar la carta? También se borrará todo su contenido.",
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
    if (e.target.name !== this.state.menu.name) this.MenuInputSubmit()
  }

  handleMenuInputChange = (e) => {
    const { value } = e.target
    this.setState({ menu: { ...this.state.menu, name: value } })
  }

  MenuInputSubmit = (e) => {
    e ? e.preventDefault() : window.removeEventListener('mousedown', this.handleClick)
    this.props.editMenu(this.state.menu)
    this.setState({ showMenuInput: false })
  }

  deleteCategory = async (i, id) => {
    try {
      const categories = [...this.state.categories]
      const productsInDeletedCategory = [...this.state.products].filter(prod => {
        return prod.categories.some(cat => {
          return cat.id === categories[i]._id
        })
      })
      const otherProducts = [...this.state.products].filter(elm => elm.category !== categories[i]._id)

      categories.forEach((elm, idx, arr) => {
        if (elm.index > i) arr[idx].index--
      })
      categories.splice(i, 1)

      Promise.all(productsInDeletedCategory.map(prod => this.menuService.deleteProduct(prod._id)))
      const deletedCategory = await this.menuService.deleteCategory(id)

      this.setState({
        categories,
        products: otherProducts,
        alert: {
          open: true,
          severity: "success",
          message: `La categoría ${deletedCategory.data.name.toUpperCase()} ha sido eliminado de la base de datos`,
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

  editCategory = (category, i) => {
    const categories = [...this.state.categories].filter(cat => cat._id !== category._id)
    if (categories.some(cat => cat.name.toUpperCase() === category.name.toUpperCase())) {
      this.setState({
        alert: {
          open: true,
          severity: "error",
          message: `La categoría ${category.name.toUpperCase()} ya existe`,
          vertical: "bottom",
        }
      })
    }
    else {
      categories.push(category)
      this.setState({ categories })
    }
  }

  addCategory = async (e, category) => {
    e.preventDefault()

    if (this.state.categories.some(cat => cat.name.toUpperCase() === category.toUpperCase())) {
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
      try {
        const newCategory = await this.menuService.addCategory({ name: category, inMenu: this.props.menu._id })
        const categories = [...this.state.categories]
        categories.push(newCategory?.data)
        this.setState({ categories })
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

  deleteProduct = async (idx, category, id) => {
    try {
      const deletedProduct = await this.menuService.deleteProduct(id)
      const sameCategoryProducts = [...this.state.products].filter(prod => {
        return prod.categories.some(cat => {
          return cat.id === category
        }) && prod._id !== id
      })
      const otherProducts = [...this.state.products].filter(prod => {
        return prod.categories.every(cat => {
          return cat.id !== category
        })
      })

      sameCategoryProducts.forEach((elm, i, arr) => {
        if (elm.categories.find(cat => cat.id === category).index > idx) {
          arr[i].categories.find(cat => cat.id === category).index--
        }
      })

      this.setState({
        products: sameCategoryProducts.concat(otherProducts),
        alert: {
          open: true,
          severity: "success",
          message: `El producto ${deletedProduct.data.name.toUpperCase()} ha sido eliminado de la base de datos`,
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

  openProductForm = (product, category) => {
    category // if yes it's a new product, if not it's an existing product
      ? this.setState({
        openModal: true,
        modalProduct: {
          categories: [{ id: category }],
          allergies: [],
          price: [{
            subDescription: "",
            subPrice: 0
          }]
        },
        productFormKey: this.state.productFormKey + 1
      })
      : this.setState({ openModal: true, modalProduct: product })
  }

  submitProductForm = async (e, product) => {
    e.preventDefault()
    let products = [...this.state.products]

    // clean last price if no description or price was intorduced
    if (product.price.length > 1) {
      const lastPrice = product.price[product.price.length - 1]
      if (!lastPrice.subDescription || !lastPrice.subPrice) product.price.splice(-1, 1)
    }

    // if it's an existing product
    if (product._id) {
      products = products.filter(prod => prod._id !== product._id)
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
        products.push(product)
        this.setState({ products }, this.closeProductForm())
      }
    }
    //if it's a new product
    else {
      if (this.state.products.some(prod => prod.name.toUpperCase() === product.name.toUpperCase())) {
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
        try {
          const newProduct = await this.menuService.addProduct(product)
          products.push(newProduct.data)
          this.setState({ products }, this.closeProductForm())
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
  }

  closeProductForm = () => {
    this.setState({ openModal: false, modalProduct: null })
  }

  showProductTooltip = (product) => {
    this.setState({ showProductTooltip: true, tooltipProduct: product })
  }

  hideProductTooltip = () => {
    this.setState({ showProductTooltip: false })
  }

  saveChanges = async () => {
    const { categories, products } = { ...this.state }
    const error = { category: null, product: null }

    await Promise
      .all(categories.map((cat) => this.menuService.updateCategory(cat._id, cat)))
      .catch((err) => error.category = err)

    await Promise
      .all(products.map((prod) => this.menuService.updateProduct(prod._id, prod)))
      .catch((err) => error.product = err)

    if (error.categry || error.product) this.setState({
      alert: {
        open: true,
        severity: "error",
        message: "Error de servidor",
        vertical: "bottom",
      }
    })
    else this.props.deselectMenu()
  }

  render() {
    /* const { palette } = this.context */

    return (
      <>
        {this.state.categories
          ? <>
            <Grid container justify="center">
              {this.state.showMenuInput
                ? <form onSubmit={this.MenuInputSubmit} style={{ width: '70%' }}>
                  <TextField
                    name={this.state.menu.name}
                    size="small"
                    label="Nombre de la Carta"
                    type="text"
                    autoFocus
                    value={this.state.menu.name}
                    onChange={this.handleMenuInputChange}
                  />
                </form>
                : <Title variant="h5" noWrap>
                  {this.props.menu.name?.slice(0, 1).toUpperCase() + this.props.menu.name?.slice(1)}
                </Title>
              }
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
            </Grid>

            <SubNavigation saveChanges={() => this.saveChanges()} />
            <DragDropContext onDragEnd={this.onDragEnd}>
              <Droppable droppableId="menu" type="category">
                {provided => (
                  <Container style={{ marginTop: "30px" }}
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {this.state.categories
                      .sort((a, b) => a.index - b.index)
                      .map((category, index) => {
                        const products = this.state.products.filter(prod => {
                          return prod.categories.some(cat => {
                            return cat.id === category._id
                          })
                        })
                        return <InnerList
                          key={category._id}
                          category={category}
                          products={products}
                          index={index}
                          showConfirmationMessage={(i, id, category) => this.showConfirmationMessage(i, id, category)}
                          editCategory={(category, i) => this.editCategory(category, i)}
                          openProductForm={(product, category) => this.openProductForm(product, category)}
                          editProduct={(product) => this.editProduct(product)}
                          showProductTooltip={(product) => this.showProductTooltip(product)}
                          hideProductTooltip={() => this.hideProductTooltip()}
                        />
                      })}
                    {provided.placeholder}
                  </Container>
                )}
              </Droppable>
            </DragDropContext>

            <Container>
              <CategoryForm addCategory={(e, category) => this.addCategory(e, category)} />
            </Container>

          </>
          : <Spinner />
        }
        {this.state.openModal &&
          <ProductForm
            open={this.state.openModal}
            handleClose={() => this.closeProductForm()}
            submitForm={(e, product) => this.submitProductForm(e, product)}
            showAlert={(message, severity, vertical) => this.showAlert(message, severity, vertical)}
            product={this.state.modalProduct}
            key={this.state.modalProduct?._id ? "edit" + this.state.modalProduct._id : this.state.productFormKey}
          />
        }
        {this.state.showProductTooltip &&
          <ProductTooltip
            product={this.state.tooltipProduct}
            key={this.state.tooltipProduct._id}
          />
        }
        <SnackbarAlert
          anchorOrigin={{ vertical: this.state.alert.vertical, horizontal: 'center' }}
          open={this.state.alert.open}
          message={this.state.alert.message}
          severity={this.state.alert.severity}
          i={this.state.alert.i}
          id={this.state.alert.id}
          category={this.state.alert.category}
          closeAlert={(message, severity) => this.closeAlert(message, severity)}
          deleteProduct={(i, category, id) => this.deleteProduct(i, category, id)}
          deleteCategory={(i, id) => this.deleteCategory(i, id)}
          deleteMenu={this.props.deleteMenu}
        />
      </>
    )
  }
}

export default CarteEditor
