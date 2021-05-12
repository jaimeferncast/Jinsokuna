import { Component } from 'react'

import styled from 'styled-components'

import { Droppable, Draggable } from 'react-beautiful-dnd'

import { Typography, Button, Grid, TextField } from "@material-ui/core"
import DeleteForeverIcon from "@material-ui/icons/DeleteForever"
import EditIcon from "@material-ui/icons/Edit"

import Product from './Product'

const Container = styled.div`
  margin: 8px;
  border: 1px solid lightgrey;
  background-color: white;
  border-radius: 2px;
  width: 90%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
`
const TitleGrid = styled(Grid)`
  padding: 0 19px 0 0;
`
const Title = styled(Typography)`
  padding: 12px 12px 12px 15px;
`
const TitleInput = styled(TextField)`
  margin: 9px 0 1px 15px;
  width: 100%;
`
const ProductList = styled.div`
  padding: 8px 8px 0;
  transition: background-color 0.2s ease;
  background-color: ${props =>
    props.isDraggingOver ? 'lightgrey' : 'inherit'};
  flex-grow: 1;
`
const AddButton = styled(Button)`
  margin: 8px auto 10px;
`

class Category extends Component {
  constructor(props) {
    super()

    this.state = {
      showCategoryInput: false,
    }
  }

  componentDidMount = () => {
    this.setState({ category: this.props.category })
  }

  toggleInput = () => {
    if (!this.state.showCategoryInput) {
      window.addEventListener('mousedown', (e) => this.handleClick(e))
      this.setState({ showCategoryInput: true })
    }
  }

  handleClick = (e) => {
    if (e.target.name !== this.state.category.name) this.inputSubmit()
  }

  handleInputChange = (e) => {
    const { value } = e.target
    this.setState({ category: { ...this.state.category, name: value } })
  }

  inputSubmit = (e) => {
    e ? e.preventDefault() : window.removeEventListener('mousedown', this.handleClick)
    this.props.editCategory(this.state.category, this.props.index)
    this.setState({ showCategoryInput: false })
  }

  render() {
    return (
      <Draggable draggableId={this.props.category._id} index={this.props.index}>
        {provided => (
          <Container {...provided.draggableProps} ref={provided.innerRef}>
            <TitleGrid {...provided.dragHandleProps} container justify="space-between" alignItems="center">
              {this.state.showCategoryInput
                ? <form onSubmit={this.inputSubmit} style={{ width: '70%' }}>
                  <TitleInput
                    name={this.state.category.name}
                    size="small"
                    label="Categoría"
                    type="text"
                    value={this.state.category.name}
                    onChange={this.handleInputChange}
                  />
                </form>
                : <Title variant="h5">
                  {this.props.category.name}
                </Title>
              }
              <div>
                <Button
                  style={{ minWidth: '0', padding: '5px 12px 5px 0' }}
                  onClick={() => this.toggleInput()}
                  color="primary"
                  endIcon={<EditIcon />}
                ></Button>
                <Button
                  style={{ minWidth: '0', padding: '5px 12px 5px 0' }}
                  onClick={() => this.props.deleteCategory(this.props.index)}
                  color="secondary"
                  endIcon={<DeleteForeverIcon />}
                ></Button>
              </div>
            </TitleGrid>
            <Droppable droppableId={this.props.category._id} type="product">
              {(provided, snapshot) => (
                <ProductList
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  isDraggingOver={snapshot.isDraggingOver}
                >
                  {this.props.products
                    .sort((a, b) => a.index - b.index)
                    .map(product => (
                      <Product
                        key={product._id}
                        product={product}
                        index={product.index}
                        deleteProduct={this.props.deleteProduct}
                        openProductForm={this.props.openProductForm}
                      />
                    ))}
                  {provided.placeholder}
                </ProductList>
              )}
            </Droppable>
            <AddButton
              onClick={() => this.props.openProductForm(null, this.props.category._id)}
              size="small"
              variant="outlined"
              color="primary"
            >agregar en {this.props.category.name}
            </AddButton>
          </Container>
        )}
      </Draggable>
    )
  }
}

export default Category
