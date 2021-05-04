import { Component } from 'react'

import styled from 'styled-components'

import { Droppable, Draggable } from 'react-beautiful-dnd'

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
const Title = styled.h3`
  padding: 8px;
`
const ProductList = styled.div`
  padding: 8px;
  transition: background-color 0.2s ease;
  background-color: ${props =>
    props.isDraggingOver ? 'lightgrey' : 'inherit'};
  flex-grow: 1;
  min-height: 100px;
`

export default class Category extends Component {
  render() {
    return (
      <Draggable draggableId={this.props.category._id} index={this.props.index}>
        {provided => (
          <Container {...provided.draggableProps} ref={provided.innerRef}>
            <Title {...provided.dragHandleProps}>
              {this.props.category.name}
            </Title>
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
                      <Product key={product._id} product={product} index={product.index} />
                    ))}
                  {provided.placeholder}
                </ProductList>
              )}
            </Droppable>
          </Container>
        )}
      </Draggable>
    )
  }
}
