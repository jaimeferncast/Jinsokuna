import { Component } from 'react'
import styled from 'styled-components'
import { Draggable } from 'react-beautiful-dnd'

const Container = styled.div`
  border: 1px solid lightgrey;
  border-radius: 2px;
  padding: 8px;
  margin-bottom: 8px;
  background-color: ${props => (props.isDragging ? 'lightgreen' : 'white')};
  display: flex;
  justify-content: space-between;
`

export default class Product extends Component {

  deleteProduct = () => {
    this.props.deleteProduct(this.props.product._id, this.props.product.index, this.props.product.category)
  }

  render() {
    return (
      <Draggable draggableId={this.props.product._id} index={this.props.index}>
        {(provided, snapshot) => (
          <Container
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            isDragging={snapshot.isDragging}
          >
            <p>
              {this.props.product.name}
            </p>
            <button onClick={this.deleteProduct}>
              Eliminar
            </button>
          </Container>
        )}
      </Draggable>
    )
  }
}
