import { Component } from "react"

import styled from "styled-components"

import { Droppable, Draggable } from "react-beautiful-dnd"

import { Typography, Button, Grid, TextField, Divider } from "@material-ui/core"
import DeleteForeverIcon from "@material-ui/icons/DeleteForever"
import EditIcon from "@material-ui/icons/Edit"
import AddBoxIcon from "@material-ui/icons/AddBox"

import ThemeContext from "../../../../ThemeContext"
import Product from "./Product"
import CustomButton from "../../../shared/CustomButton"

const CategoryContainer = styled.div`
  margin: 5px 0;
  padding: 5px 10px;
  background-color: ${props => props.palette.dark};
  border-radius: 5px;
  width: 100%;
  max-width: 600px;
  display: flex;
  flex-direction: column;
`
const TitleGrid = styled(Grid)`
  padding: 0 10px 0 0;
`
const Title = styled(Typography)`
  padding: 12px 12px 12px 10px;
`
const TitleInput = styled(TextField)`
  color: red;
  margin: 9px 0 1px 10px;
  width: 100%;
`
const ProductList = styled.div`
  padding: 5px 0 0;
  transition: background-color 0.2s ease;
  background-color: ${props => props.isDraggingOver ? props.palette.light : 'inherit'};
  flex-grow: 1;
`
const AddButtonContainer = styled(Grid)`
  padding: 10px 0 5px;
`

class Category extends Component {
  static contextType = ThemeContext

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
    const { palette } = this.context

    return (
      <Draggable draggableId={this.props.category._id} index={this.props.index}>
        {provided => (
          <CategoryContainer palette={palette} {...provided.draggableProps} ref={provided.innerRef}>
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
                    palette={palette}
                    name={this.state.category.name}
                    size="small"
                    label="Categoría"
                    type="text"
                    autoFocus
                    value={this.state.category.name}
                    onChange={this.handleInputChange}
                  />
                </form>
                : <Title palette={palette} variant="h5" noWrap>
                  {this.props.category.name.slice(0, 1).toUpperCase() + this.props.category.name.slice(1)}
                </Title>
              }
              <Grid item>
                <Grid container wrap="nowrap">
                  <Button
                    style={{ minWidth: '0', padding: '5px 12px 5px 0' }}
                    onClick={() => this.toggleInput()}
                    endIcon={<EditIcon />}
                  ></Button>
                  <Button
                    style={{ minWidth: '0', padding: '5px 12px 5px 0' }}
                    onClick={() => this.props.showConfirmationMessage(this.props.index, this.props.category._id)}
                    color="primary"
                    endIcon={<DeleteForeverIcon />}
                  ></Button>
                </Grid>
              </Grid>
            </TitleGrid>

            <Divider
              style={this.state.showCategoryInput
                ? { backgroundColor: '#ffffff00' }
                : { margin: '0 -10px', zIndex: '999' }}
            />

            <Droppable droppableId={this.props.category._id} type="product">
              {(provided, snapshot) => (
                <ProductList
                  palette={palette}
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
                  {!this.props.products.some(elm => elm.category === this.props.category._id)
                    && <Title variant="subtitle2" margin="normal" color="primary">
                      Aún no has añadido productos a esta categoría.
                          </Title>
                  }
                  {provided.placeholder}
                </ProductList>
              )}
            </Droppable>

            <Divider style={{ margin: '0 -10px' }} />

            <AddButtonContainer container justify="flex-end">
              <CustomButton
                color="primary"
                onClick={() => this.props.openProductForm(null, this.props.category._id)}
                size="small"
                startIcon={<AddBoxIcon />}
              >agregar producto {/* en {this.props.category.name} */}
              </CustomButton>
            </AddButtonContainer>
          </CategoryContainer>
        )}
      </Draggable>
    )
  }
}

export default Category
