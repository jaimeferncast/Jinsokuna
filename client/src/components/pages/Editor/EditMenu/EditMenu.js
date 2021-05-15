import { Component, PureComponent } from "react"

import styled from "styled-components"

import { DragDropContext, Droppable } from "react-beautiful-dnd"

import { Typography } from "@material-ui/core"

import Category from "./Category"
import Product from './Product'
import ProductForm from "./ProductForm"
import CategoryForm from "./CategoryForm"
import ProductTooltip from "./ProductTooltip"
import SubNavigation from "./SubNavigation"

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
      deleteCategory,
      editCategory,
      deleteProduct,
      openProductForm,
      editProduct,
      showProductTooltip,
      hideProductTooltip,
    } = this.props
    return <Category
      category={category}
      products={products}
      index={index}
      deleteCategory={deleteCategory}
      editCategory={editCategory}
      deleteProduct={deleteProduct}
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
      archive: undefined, // category for products not on the menu
      showProductTooltip: false, // overview of the product
      tooltipKey: 1,
      tooltipProduct: undefined,
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

  deleteCategory = async (i, id) => {
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
    alert(`La categoría ${deletedCategory.data.name} ha sido eliminada de la base de datos`)

    this.setState({ categories, products })
  }

  editCategory = (category, i) => {
    const categories = [...this.state.categories]
    categories.splice(i, 1, category)
    this.setState({ categories })
  }

  addCategory = async (e, category) => {
    e.preventDefault()
    const newCategory = await this.menuService.addCategory({ name: category })
    const categories = [...this.state.categories]
    categories.push(newCategory.data)
    this.setState({ categories })
  }

  deleteProduct = async (idx, category, id) => {
    const deletedProduct = await this.menuService.deleteProduct(id)
    alert(`El producto ${deletedProduct.data.name} ha sido eliminado de la base de datos`)

    const sameCategoryProducts = [...this.state.products].filter(elm => elm.category === category)
    const otherProducts = [...this.state.products].filter(elm => elm.category !== category)

    sameCategoryProducts.forEach((elm, i, arr) => {
      if (elm.index > idx) arr[i].index--
    })
    sameCategoryProducts.splice(idx - 1, 1)

    this.setState({ products: sameCategoryProducts.concat(otherProducts) })
  }

  openProductForm = (product, category) => {
    category
      ? this.setState({ openModal: true, modalProduct: { ...product, category } })
      : this.setState({ openModal: true, modalProduct: product })
  }

  submitProductForm = async (e, product) => {
    e.preventDefault()
    const products = [...this.state.products]

    if (product._id) {
      products.splice(products.findIndex(elm => elm._id === product._id), 1, product)
      this.setState({ products }, this.closeProductForm())
    }
    else {
      const newProduct = await this.menuService.addProduct(product)
      products.push(newProduct.data)
      this.setState({ products }, this.closeProductForm())
    }
  }

  closeProductForm = () => {
    this.setState({ openModal: false, modalProduct: null })
  }

  showProductTooltip = (product) => {
    this.setState({ showProductTooltip: true, tooltipProduct: product })
  }

  hideProductTooltip = () => {
    this.setState({ showProductTooltip: false, tooltipKey: this.state.tooltipKey + 1 })
  }

  saveChanges = async () => {
    const { categories, products } = { ...this.state }
    const error = { category: null, product: null }

    await Promise
      .all(categories.map((cat) => this.menuService.updateCategory(cat._id, cat)))
      .catch((err) => error.category = err.message)

    await Promise
      .all(products.map((prod) => this.menuService.updateProduct(prod._id, prod)))
      .catch((err) => error.product = err.message)

    if (error.categry) alert(error.categry)
    else if (error.product) alert(error.product)
    else alert('Cambios guardados')
  }

  render() {
    return (
      <>
        {this.state.categories &&
          <>
            <SubNavigation saveChanges={() => this.saveChanges()} />
            <DragDropContext onDragEnd={this.onDragEnd}>
              <Droppable
                droppableId="menu"
                // direction="horizontal"
                type="category"
              >
                {provided => (
                  <Container
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
                          deleteCategory={(i, id) => this.deleteCategory(i, id)}
                          editCategory={(category, i) => this.editCategory(category, i)}
                          deleteProduct={(idx, category, id) => this.deleteProduct(idx, category, id)}
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
                              deleteProduct={(idx, category, id) => this.deleteProduct(idx, category, id)}
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
        }
        <ProductForm
          open={this.state.openModal}
          handleClose={() => this.closeProductForm()}
          submitForm={(e, product) => this.submitProductForm(e, product)}
          product={this.state.modalProduct}
          key={this.state.modalProduct?._id ? this.state.modalProduct._id : this.state.modalProduct?.category}
        />
        {this.state.showProductTooltip &&
          <ProductTooltip
            product={this.state.tooltipProduct}
            key={this.state.tooltipKey}
          />
        }
      </>
    )
  }
}

export default EditMenu
