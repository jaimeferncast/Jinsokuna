import { Component } from "react"

import styled from "styled-components"

import { Droppable, Draggable } from "react-beautiful-dnd"

import { Typography, Button, Grid, TextField, Divider } from "@material-ui/core"
import DeleteForeverIcon from "@material-ui/icons/DeleteForever"
import EditIcon from "@material-ui/icons/Edit"
import AddBoxIcon from "@material-ui/icons/AddBox"

import ThemeContext from "../../../../../ThemeContext"
import Product from "./Product"
import CustomButton from "../../../../shared/CustomButton"

import { capitalizeTheFirstLetterOfEachWord } from "../../../../../utils"

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
  padding: 12px 12px 0 10px;
  &.cat-description {
    font-style: italic;
    padding-top: 0;
  }
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

  constructor() {
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
    if (e.target.name !== "name" && e.target.name !== "description") this.inputSubmit()
  }

  handleInputChange = (e) => {
    const { value, name } = e.target
    this.setState({ category: { ...this.state.category, [name]: value } })
  }

  inputSubmit = () => {
    window.removeEventListener('mousedown', this.handleClick)
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
                ? <form onSubmit={this.inputSubmit} style={{ width: '99%' }} autoComplete="off">
                  <Grid container justify="space-between" alignItems="flex-end">
                    <Grid item>
                      <TitleInput
                        palette={palette}
                        name="name"
                        size="small"
                        label="Categoría"
                        type="text"
                        autoFocus
                        value={this.state.category.name}
                        onChange={this.handleInputChange}
                      />
                    </Grid>
                    <Grid item>
                      <Button
                        type="submit"
                        variant="outlined"
                        color="primary"
                        onClick={this.inputSubmit}
                      >guardar</Button>
                    </Grid>
                  </Grid>
                  <TitleInput
                    style={{ width: '97%', marginBottom: '15px' }}
                    palette={palette}
                    name="description"
                    size="small"
                    label="Descripción"
                    type="text"
                    value={this.state.category.description}
                    onChange={this.handleInputChange}
                  />
                </form>
                : <Title palette={palette} variant="h5" noWrap>
                  {capitalizeTheFirstLetterOfEachWord(this.props.category.name)}
                </Title>
              }
              <Grid item>
                {!this.state.showCategoryInput &&
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
                }
              </Grid>
            </TitleGrid>
            {(this.props.category.description && !this.state.showCategoryInput) &&
              <Title palette={palette} variant="subtitle1" noWrap className="cat-description">
                {this.props.category.description.slice(0, 1).toUpperCase() + this.props.category.description.slice(1)}
              </Title>
            }
            <Divider style={{ margin: '12px -10px 0', zIndex: '999' }} />
            <Droppable droppableId={this.props.category._id} type="product">
              {(provided, snapshot) => (
                <ProductList
                  palette={palette}
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  isDraggingOver={snapshot.isDraggingOver}
                >
                  {this.props.products
                    .sort((a, b) => {
                      return a.categories.find(cat => cat.id === this.props.category._id).index
                        - b.categories.find(cat => cat.id === this.props.category._id).index
                    })
                    .map(product => (
                      <Product
                        key={product._id}
                        category={this.props.category._id}
                        product={product}
                        index={product.categories.find(cat => cat.id === this.props.category._id).index}
                        showConfirmationMessage={this.props.showConfirmationMessage}
                        openProductForm={this.props.openProductForm}
                        showProductTooltip={this.props.showProductTooltip}
                        hideProductTooltip={this.props.hideProductTooltip}
                      />
                    ))}
                  {!this.props.products.some(prod => {
                    return prod.categories.some(cat => {
                      return cat.id === this.props.category._id
                    })
                  })
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
              >
                agregar producto
              </CustomButton>
            </AddButtonContainer>
          </CategoryContainer>
        )}
      </Draggable>
    )
  }
}

export default Category
