import { Component, PureComponent } from "react"

import styled from "styled-components"

import { DragDropContext, Droppable } from "react-beautiful-dnd"

import { Typography, Snackbar, Button } from "@material-ui/core"
import Alert from "@material-ui/lab/Alert"

import Category from "./Category"
import Product from './Product'
import ProductForm from "./ProductForm"
import CategoryForm from "./CategoryForm"
import ProductTooltip from "./ProductTooltip"
import SubNavigation from "./SubNavigation"
import Spinner from "../../../shared/Spinner"

import MenuService from "../../../../service/menu.service"

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
const ProductList = styled.div`
  padding: 8px 8px 0;
  transition: background-color 0.2s ease;
  background-color: ${props =>
    props.isDraggingOver ? 'lightgrey' : 'inherit'};
  flex-grow: 1;
`
const ArchiveContainer = styled.div`
  margin: 8px 0;
  border: 1px solid red;
  background-color: white;
  border-radius: 2px;
  width: 100%;
  max-width: 600px;
  display: flex;
  flex-direction: column;
`
const Title = styled(Typography)`
  padding: 12px 12px 12px 15px;
  font-weight: 400;
`

class InnerList extends PureComponent {
  render() {
    const { category,
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

class EditMenu extends Component {
  constructor() {
    super()

    this.state = {
      categories: undefined,
      products: undefined,
      openModal: false, // edit product form
      modalProduct: null,
      productFormKey: 0, // key for the ProductForm component when it's a new product and does not have _id yet
      archive: undefined, // category for products not on the menu
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
    const categories = (await this.menuService.getCategories()).data.message
    const products = await this.menuService.getProducts()
    this.setState({
      archive: categories[categories.length - 1],
      categories: categories.slice(0, -1),
      products: products.data.message,
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

    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) return

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
    else if (source.droppableId === destination.droppableId) {
      const newProducts = this.state.products.filter(prod => prod.category === source.droppableId)

      newProducts.forEach((prod, i, arr) => {
        (destination.index > source.index)
          ? (destination.index >= prod.index && prod.index > source.index) && arr[i].index--
          : (destination.index <= prod.index && prod.index < source.index) && arr[i].index++

        if (prod._id === draggableId) { arr[i].index = destination.index }
      })

      const products = [
        ...this.state.products.filter(prod => prod.category !== source.droppableId),
        ...newProducts
      ]
      this.setState({ products })
    }
    else {
      const newSourceProducts = this.state.products.filter(prod => prod.category === source.droppableId)
      const newDestinationProducts = this.state.products.filter(prod => prod.category === destination.droppableId)

      newSourceProducts.forEach((prod, i, arr) => {
        (prod.index > source.index) && arr[i].index--
        if (prod._id === draggableId) {
          destination.index
            ? arr[i].index = destination.index
            : arr[i].index = 1
          arr[i].category = destination.droppableId
        }
      })

      newDestinationProducts.forEach((prod, i, arr) => {
        (destination.index <= prod.index) && arr[i].index++
      })

      const products = [
        ...this.state.products.filter(prod => {
          return prod.category !== source.droppableId && prod.category !== destination.droppableId
        }),
        ...newSourceProducts, ...newDestinationProducts
      ]
      this.setState({ products })
    }
  }

  showConfirmationMessage = (i, id, category) => {
    this.setState({
      alert: {
        open: true,
        message: `¿Seguro que quieres borrar ${category ? "el producto" : "la categoría"}?`,
        severity: "warning",
        vertical: "top",
        i,
        id,
        category,
      }
    })
  }

  deleteCategory = async (i, id) => {
    try {
      const categories = [...this.state.categories]
      const productsInDeletedCategory = [...this.state.products].filter(elm => elm.category === categories[i]._id)
      const otherProducts = [...this.state.products].filter(elm => elm.category !== categories[i]._id)

      categories.forEach((elm, idx, arr) => {
        if (elm.index > i) arr[idx].index--
      })
      categories.splice(i, 1)

      const products = otherProducts.concat(
        productsInDeletedCategory.map((prod) => { return { ...prod, category: this.state.archive._id } })
      )

      const deletedCategory = await this.menuService.deleteCategory(id).catch((error) => alert(error))

      this.setState({
        categories,
        products,
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
    const categories = [...this.state.categories]
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
      categories.splice(i, 1, category)
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
        const newCategory = await this.menuService.addCategory({ name: category })
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
      const sameCategoryProducts = [...this.state.products].filter(elm => elm.category === category && elm._id !== id)
      const otherProducts = [...this.state.products].filter(elm => elm.category !== category)

      sameCategoryProducts.forEach((elm, i, arr) => {
        if (elm.index > idx) arr[i].index--
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
          category,
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
    const products = [...this.state.products]

    if (product.price.length > 1) {
      const lastPrice = product.price[product.price.length - 1]
      if (!lastPrice.subDescription || !lastPrice.subPrice) product.price.splice(-1, 1)
    }

    if (product._id) {
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
        products.splice(products.findIndex(elm => elm._id === product._id), 1, product)
        this.setState({ products }, this.closeProductForm())
      }
    }
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
    this.setState({ showProductTooltip: true, tooltipProduct: product, tooltipKey: this.state.tooltipKey + 1 })
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
    else this.setState({
      alert: {
        open: true,
        severity: "success",
        message: "Cambios guardados correctamente",
        vertical: "bottom",
      }
    })
  }

  render() {
    return (
      <>
        {this.state.categories
          ? <>
            <SubNavigation saveChanges={() => this.saveChanges()} />
            <DragDropContext onDragEnd={this.onDragEnd}>
              <Droppable
                droppableId="menu"
                // direction="horizontal"
                type="category"
              >
                {provided => (
                  <Container
                    style={{ marginTop: '58px' }}
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {this.state.categories
                      .sort((a, b) => a.index - b.index)
                      .map((category, index) => {
                        const products = this.state.products.filter(elm => elm.category === category._id && elm.index)
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

              <Container>
                <CategoryForm addCategory={(e, category) => this.addCategory(e, category)} />
              </Container>

              <Container>
                <ArchiveContainer>
                  <Title variant="h6" margin="normal">
                    Archivo de productos<br />
                    <small>Los productos de esta lista no aparecerán en la carta</small>
                  </Title>
                  <Droppable droppableId={this.state.archive._id} type="product">
                    {(provided, snapshot) => (
                      <ProductList
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        isDraggingOver={snapshot.isDraggingOver}
                      >
                        {this.state.products
                          .filter(elm => elm.category === this.state.archive._id)
                          .sort((a, b) => a.index - b.index)
                          .map(product => (
                            <Product
                              key={product._id}
                              product={product}
                              index={product.index}
                              showConfirmationMessage={(i, id, category) => this.showConfirmationMessage(i, id, category)}
                              openProductForm={(product, category) => this.openProductForm(product, category)}
                              showProductTooltip={(product) => this.showProductTooltip(product)}
                              hideProductTooltip={() => this.hideProductTooltip()}
                            />
                          ))}
                        {provided.placeholder}
                      </ProductList>
                    )}
                  </Droppable>
                </ArchiveContainer>
              </Container>

            </DragDropContext>
          </>
          : <Spinner />
        }
        {this.state.openModal &&
          <ProductForm
            open={this.state.openModal}
            handleClose={() => this.closeProductForm()}
            submitForm={(e, product) => this.submitProductForm(e, product)}
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
        <Snackbar
          anchorOrigin={{ vertical: this.state.alert.vertical, horizontal: 'center' }}
          open={this.state.alert.open}
          onClose={() => this.closeAlert(this.state.alert.message, this.state.alert.severity)}
        >
          <Alert
            severity={this.state.alert.severity}
            variant="filled"
            action={this.state.alert.severity === "warning"
              && <Button
                color="inherit"
                size="small"
                onClick={() => {
                  this.state.alert.category
                    ? this.deleteProduct(this.state.alert.i, this.state.alert.category, this.state.alert.id)
                    : this.deleteCategory(this.state.alert.i, this.state.alert.id)
                }}
              >
                aceptar
              </Button>}
          >
            {this.state.alert.message}
          </Alert>
        </Snackbar>
      </>
    )
  }
}

export default EditMenu
