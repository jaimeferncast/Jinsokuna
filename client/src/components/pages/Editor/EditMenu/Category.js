import { Component } from "react"

import styled from "styled-components"

import { Droppable, Draggable } from "react-beautiful-dnd"

import { Typography, Button, Grid, TextField } from "@material-ui/core"
import DeleteForeverIcon from "@material-ui/icons/DeleteForever"
import EditIcon from "@material-ui/icons/Edit"
import AddBoxIcon from "@material-ui/icons/AddBox"

import Product from "./Product"

const CategoryContainer = styled.div`
  margin: 4px 0;
  border: 1px solid lightgrey;
  background-color: white;
  border-radius: 2px;
  width: 100%;
  max-width: 600px;
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
const AddButtonContainer = styled(Grid)`
  padding: 2px 8px 10px;
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
          <CategoryContainer {...provided.draggableProps} ref={provided.innerRef}>
            <TitleGrid
              {...provided.dragHandleProps}
              container
              justify="space-between"
              alignItems="center"
              wrap="nowrap"
            >
              {this.state.showCategoryInput
                ? <form onSubmit={this.inputSubmit} style={{ width: '70%' }}>
                  <TitleInput
                    name={this.state.category.name}
                    size="small"
                    label="Categoría"
                    type="text"
                    autoFocus
                    value={this.state.category.name}
                    onChange={this.handleInputChange}
                  />
                </form>
                : <Title variant="h5" noWrap>
                  {this.props.category.name}
                </Title>
              }
              <Grid item>
                <Grid container wrap="nowrap">
                  <Button
                    style={{ minWidth: '0', padding: '5px 12px 5px 0' }}
                    onClick={() => this.toggleInput()}
                    color="primary"
                    endIcon={<EditIcon />}
                  ></Button>
                  <Button
                    style={{ minWidth: '0', padding: '5px 12px 5px 0' }}
                    onClick={() => this.props.showConfirmationMessage(this.props.index, this.props.category._id)}
                    color="secondary"
                    endIcon={<DeleteForeverIcon />}
                  ></Button>
                </Grid>
              </Grid>
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
                        showConfirmationMessage={this.props.showConfirmationMessage}
                        openProductForm={this.props.openProductForm}
                        showProductTooltip={this.props.showProductTooltip}
                        hideProductTooltip={this.props.hideProductTooltip}
                      />
                    ))}
                  {provided.placeholder}
                </ProductList>
              )}
            </Droppable>
            <AddButtonContainer container justify="flex-end">
              <Button
                onClick={() => this.props.openProductForm(null, this.props.category._id)}
                size="small"
                variant="outlined"
                color="primary"
                startIcon={<AddBoxIcon />}
              >agregar producto {/* en {this.props.category.name} */}
              </Button>
            </AddButtonContainer>
          </CategoryContainer>
        )}
      </Draggable>
    )
  }
}

export default Category
