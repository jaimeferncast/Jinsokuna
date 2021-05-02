import { Component } from 'react'
import { DragDropContext } from 'react-beautiful-dnd'
import Category from './Category'
import MenuService from './../../service/menu.service'

class EditableMenu extends Component {
  constructor() {
    super()

    this.state = {
      categories: undefined,
      products: undefined,
    }
    this.menuService = new MenuService()
  }

  componentDidMount = async () => {
    const categories = await this.menuService.getCategories()
    const products = await this.menuService.getProducts()
    this.setState({ categories: categories.data.message, products: products.data.message })
  }

  onDragEnd = result => {
    const { destination, source, draggableId } = result

    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) return

    if (source.droppableId === destination.droppableId) {
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
          arr[i].index = destination.index
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

    // Moving from one list to another
    // const startTaskIds = Array.from(start.taskIds);
    // startTaskIds.splice(source.index, 1);
    // const newStart = {
    //   ...start,
    //   taskIds: startTaskIds,
    // };

    // const finishTaskIds = Array.from(finish.taskIds);
    // finishTaskIds.splice(destination.index, 0, draggableId);
    // const newFinish = {
    //   ...finish,
    //   taskIds: finishTaskIds,
    // };

    // const newState = {
    //   ...this.state,
    //   columns: {
    //     ...this.state.columns,
    //     [newStart.id]: newStart,
    //     [newFinish.id]: newFinish,
    //   },
    // };
    // this.setState(newState);
  }

  render() {
    return (<>
      {this.state.categories &&
        <DragDropContext onDragEnd={this.onDragEnd}>
          {this.state.categories
            .sort((a, b) => a.index - b.index)
            .map(category => {
              const products = this.state.products.filter(elm => elm.category === category._id)
              return <Category key={category._id} category={category} products={products} />
            })}
        </DragDropContext>
      }
    </>)
  }
}

export default EditableMenu
