import { Component } from "react"

import styled from "styled-components"

import { Draggable } from "react-beautiful-dnd"

import { Typography, Button } from "@material-ui/core"
import DeleteIcon from "@material-ui/icons/Delete"

const Container = styled.div`
  border: 1px solid lightgrey;
  border-radius: 2px;
  padding: 8px;
  margin-bottom: 8px;
  background-color: ${props => (props.isDragging ? 'lightgreen' : 'white')};
  display: flex;
  justify-content: space-between;
  align-items: center;
`

class Product extends Component {

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
            <Typography variant="body1">
              {this.props.product.name}
            </Typography>
            <Button
              style={{ fontWeight: '400' }}
              onClick={this.deleteProduct}
              size="small"
              color="secondary"
              startIcon={<DeleteIcon />}
            >
              quitar
            </Button>
          </Container>
        )}
      </Draggable>
    )
  }
}

export default Product
