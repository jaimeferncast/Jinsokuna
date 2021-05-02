import { Component } from 'react'
import styled from 'styled-components'
import { Draggable } from 'react-beautiful-dnd'

const Container = styled.div`
  border: 1px solid lightgrey;
  border-radius: 2px;
  padding: 8px;
  margin-bottom: 8px;
`

export default class Product extends Component {
  render() {
    return (
      <Draggable draggableId={this.props.product._id} index={this.props.index}>
        {provided => (
          <Container
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            {this.props.product.name} - {this.props.product.index}
          </Container>
        )}
      </Draggable>
    )
  }
}
