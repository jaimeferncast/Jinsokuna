import { Component } from "react"

import styled from "styled-components"

import { Draggable } from "react-beautiful-dnd"

import { Typography, Button } from "@material-ui/core"
import DeleteForeverIcon from "@material-ui/icons/DeleteForever"
import EditIcon from "@material-ui/icons/Edit"

const Container = styled.div`
  border: 1px solid lightgrey;
  border-radius: 5px;
  padding: 5px 10px;
  margin-bottom: 8px;
  background-color: ${props => (props.isDragging ? 'lightgreen' : 'white')};
  display: flex;
  justify-content: space-between;
  align-items: center;
`

class Product extends Component {

  showProductInfo = (product) => {
    this.props.showProductTooltip(product)
  }

  hideProductInfo = () => {
    this.props.hideProductTooltip()
  }

  deleteProduct = () => {
    this.props.showConfirmationMessage(this.props.product.index, this.props.product._id, this.props.product.category)
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
            onMouseEnter={() => this.showProductInfo(this.props.product)}
            onMouseLeave={() => this.hideProductInfo()}
          >
            <Typography variant="body1" noWrap>
              {this.props.product.name.slice(0, 1).toUpperCase() + this.props.product.name.slice(1)}
            </Typography>
            <div style={{ whiteSpace: 'nowrap' }}>
              <Button
                style={{ minWidth: '0', padding: '5px 12px 5px 0' }}
                onClick={() => this.props.openProductForm(this.props.product)}
                color="primary"
                endIcon={<EditIcon />}
              />
              <Button
                style={{ minWidth: '0', padding: '5px 12px 5px 0' }}
                onClick={this.deleteProduct}
                color="secondary"
                endIcon={<DeleteForeverIcon />}
              ></Button>
            </div>
          </Container>
        )}
      </Draggable>
    )
  }
}

export default Product
