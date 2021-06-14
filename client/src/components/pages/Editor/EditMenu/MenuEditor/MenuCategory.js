import { Component } from "react"

import { Droppable, Draggable } from "react-beautiful-dnd"

import { Button, Grid, Divider } from "@material-ui/core"
import DeleteForeverIcon from "@material-ui/icons/DeleteForever"
import EditIcon from "@material-ui/icons/Edit"

import ThemeContext from "../../../../../ThemeContext"
import MenuProduct from "./MenuProduct"
import MenuProductForm from "./MenuProductForm"
import { CategoryContainer, TitleGrid, Title, TitleInput, ProductList, MenuForm } from "../CarteEditor/Category"

import { capitalizeTheFirstLetterOfEachWord } from "../../../../../utils"

class MenuCategory extends Component {
  static contextType = ThemeContext

  constructor(props) {
    super()

    this.state = {
      category: props.category,
      showCategoryInput: false,
      mobile: window.screen.width > 1067 ? false : true,
    }
  }

  toggleInput = () => {
    if (!this.state.showCategoryInput) {
      window.addEventListener('mousedown', this.handleClick)
      window.addEventListener('keypress', this.handleEnter)
      this.setState({ showCategoryInput: true })
    }
  }

  handleClick = (e) => {
    if (e.target.name !== "categoryName" && e.target.name !== "categoryDescription") this.inputSubmit()
  }

  handleEnter = (e) => {
    e.key === "Enter" && this.inputSubmit()
  }

  handleInputChange = (e) => {
    const { value, name } = e.target
    this.setState({ category: { ...this.state.category, [name]: value } })
  }

  inputSubmit = () => {
    window.removeEventListener('mousedown', this.handleClick)
    window.removeEventListener('keypress', this.handleEnter)
    this.props.editCategory(this.state.category)
    this.setState({ showCategoryInput: false })
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (this.state.showCategoryInput !== prevState.showCategoryInput) {
      this.props.category.categoryName === prevProps.category.categoryName
        && this.setState({ category: { ...this.state.category, categoryName: this.props.category.categoryName } })
    }
  }

  render() {
    const { palette } = this.context

    return (
      <>
        {this.props.category.products &&
          <Draggable draggableId={this.props.category._id} index={this.props.index}>
            {provided => (
              <CategoryContainer palette={palette} {...provided.draggableProps} ref={provided.innerRef}>
                <TitleGrid
                  {...provided.dragHandleProps}
                  container
                  justify="space-between"
                  alignItems="flex-end"
                  wrap="nowrap"
                >
                  {this.state.showCategoryInput
                    ? <MenuForm autoComplete="off">
                      <Grid container justify="space-between" alignItems="flex-end" wrap="nowrap">
                        <Grid item xs={7} style={{ marginRight: "24px" }}>
                          <TitleInput
                            style={{ width: '100%' }}
                            palette={palette}
                            name="categoryName"
                            size="small"
                            label="Categoría"
                            type="text"
                            autoFocus
                            value={this.state.category.categoryName}
                            onChange={this.handleInputChange}
                          />
                        </Grid>
                        <Grid item>
                          <Button variant="outlined" color="primary">guardar</Button>
                        </Grid>
                      </Grid>
                      <TitleInput
                        style={{ width: '97%', marginBottom: '15px' }}
                        palette={palette}
                        name="categoryDescription"
                        size="small"
                        label="Descripción"
                        type="text"
                        value={this.state.category.categoryDescription}
                        onChange={this.handleInputChange}
                      />
                    </MenuForm>
                    : <Title palette={palette} variant="h5">
                      {capitalizeTheFirstLetterOfEachWord(this.props.category.categoryName)}
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
                          style={{ minWidth: '0', padding: '5px 0 5px 0' }}
                          onClick={() => this.props.showConfirmationMessage(this.props.index, this.props.category.categoryName)}
                          endIcon={<DeleteForeverIcon />}
                        ></Button>
                      </Grid>
                    }
                  </Grid>
                </TitleGrid>
                {(this.state.category.categoryDescription && !this.state.showCategoryInput) &&
                  <Title palette={palette} variant="subtitle1" noWrap className="cat-description">
                    {this.state.category.categoryDescription.slice(0, 1).toUpperCase() + this.state.category.categoryDescription.slice(1)}
                  </Title>
                }
                <Divider style={{ margin: '12px -10px 10px', zIndex: '999' }} />
                <Droppable droppableId={this.props.category._id} type="product">
                  {(provided, snapshot) => (
                    <ProductList
                      palette={palette}
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      isDraggingOver={snapshot.isDraggingOver}
                    >
                      {this.props.category.products
                        .map((elm, index) => (
                          <MenuProduct
                            key={elm.name}
                            product={elm}
                            index={index + 1}
                            categoryIndex={this.props.index}
                            removeProduct={this.props.removeProduct}
                          />
                        ))}
                      {!this.props.category.products.length && !snapshot.isDraggingOver
                        && <Title variant="subtitle2" margin="normal" color="primary" className="product-placeholder">
                          Aún no has añadido productos a esta categoría.
                          </Title>
                      }
                      {provided.placeholder}
                    </ProductList>
                  )}
                </Droppable>

                <MenuProductForm addMenuProduct={this.props.addMenuProduct} index={this.props.index} />

              </CategoryContainer>
            )}
          </Draggable>
        }
      </>
    )
  }
}

export default MenuCategory
