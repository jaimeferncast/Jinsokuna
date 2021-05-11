import { Component } from 'react'

import styled from 'styled-components'

import { Droppable, Draggable } from 'react-beautiful-dnd'

import { Typography, Button, Grid } from "@material-ui/core"
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
  padding: 12px;
`
const ProductList = styled.div`
  padding: 0 8px;
  transition: background-color 0.2s ease;
  background-color: ${props =>
    props.isDraggingOver ? 'lightgrey' : 'inherit'};
  flex-grow: 1;
`

const AddButton = styled(Button)`
  margin: 0 auto 10px;
`

class Category extends Component {
  render() {
    return (
      <Draggable draggableId={this.props.category._id} index={this.props.index}>
        {provided => (
          <Container {...provided.draggableProps} ref={provided.innerRef}>
            <TitleGrid container justify="space-between" alignItems="center">
              <Title variant="h5" {...provided.dragHandleProps}>
                {this.props.category.name}
              </Title>
              <div>
                <Button
                  style={{ minWidth: '0', padding: '5px 12px 5px 0' }}
                  onClick={() => this.props.openProductForm(this.props.product)}
                  color="primary"
                  endIcon={<EditIcon />}
                ></Button>
                <Button
                  style={{ minWidth: '0', padding: '5px 12px 5px 0' }}
                  onClick={this.deleteProduct}
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
              onClick={() => this.props.openProductForm(null)}
              size="small"
              variant="outlined"
              color="primary"
            >agregar producto
                    </AddButton>
          </Container>
        )}
      </Draggable>
    )
  }
}

export default Category
