import { Component, PureComponent } from "react"

import styled from "styled-components"

import { DragDropContext, Droppable } from "react-beautiful-dnd"

import Category from "./Category"
import NewProductForm from "./NewProductForm"

import MenuService from "../../../../service/menu.service"

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

class InnerList extends PureComponent {
  render() {
    const { category, products, index, deleteProduct, openNewProductForm } = this.props
    return <Category
      category={category}
      products={products}
      index={index}
      deleteProduct={deleteProduct}
      openNewProductForm={openNewProductForm}
    />
  }
}

class EditMenu extends Component {
  constructor() {
    super()

    this.state = {
      categories: undefined,
      products: undefined,
      openModal: false,
    }
    this.menuService = new MenuService()
  }

  componentDidMount = async () => {
    const categories = await this.menuService.getCategories()
    const products = await this.menuService.getProducts()
    this.setState({ categories: categories.data.message, products: products.data.message })
  }

  onDragEnd = (result) => {
    console.log(result)
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

  deleteProduct = (id, idx, category) => {
    const products = [...this.state.products]
    products.forEach((elm, i, arr) => {
      if (elm.index > idx && elm.category === category) arr[i].index--
      if (elm._id === id) arr[i].index = undefined
    })
    this.setState({ products })
  }

  openNewProductForm = () => {
    this.setState({ openModal: true })
  }

  closeNewProductForm = () => {
    this.setState({ openModal: false })
  }

  addProduct = (product) => {
    const products = [...this.state.products]
    products.push(product)
    this.setState({ products })
  }

  render() {
    return (
      <>
        {this.state.categories &&
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
                        deleteProduct={(id, idx, category) => this.deleteProduct(id, idx, category)}
                        openNewProductForm={() => this.openNewProductForm()}
                      />
                    })}
                  {provided.placeholder}
                </Container>
              )}
            </Droppable>
          </DragDropContext>
        }
        <NewProductForm
          open={this.state.openModal}
          handleClose={() => this.closeNewProductForm()}
          addProduct={(product) => this.addProduct(product)}
        />
      </>
    )
  }
}

export default EditMenu
