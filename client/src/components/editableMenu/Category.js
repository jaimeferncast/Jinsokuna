import { Component } from 'react'
import styled from 'styled-components'
import { Droppable } from 'react-beautiful-dnd'
import Product from './Product'

const Container = styled.div`
  margin: 8px;
  border: 1px solid lightgrey;
  border-radius: 2px;
`
const Title = styled.h3`
  padding: 8px;
`
const ProductList = styled.div`
  padding: 8px;
`

export default class Category extends Component {
  render() {
    return (
      <Container>
        <Title>{this.props.category.name}</Title>
        <Droppable droppableId={this.props.category._id}>
          {provided => (
            <ProductList ref={provided.innerRef} {...provided.droppableProps}>
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
    )
  }
}
