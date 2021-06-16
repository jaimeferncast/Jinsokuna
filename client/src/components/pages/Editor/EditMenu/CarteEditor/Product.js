import { Component } from "react"

import styled from "styled-components"

import { Draggable } from "react-beautiful-dnd"

import { Typography, Button } from "@material-ui/core"
import DeleteForeverIcon from "@material-ui/icons/DeleteForever"
import EditIcon from "@material-ui/icons/Edit"

import ThemeContext from "../../../../../ThemeContext"

import { capitalizeTheFirstLetterOfEachWord } from "../../../../../utils"

export const Container = styled.div`
  padding: 5px 10px 5px 20px;
  margin: 0 0 5px;
  transform: ${props => (props.isDragging ? "rotate(2deg)" : "none")};
  background-color: ${props => (props.isDragging ? props.palette.primary.main : props.palette.dark)};
  display: flex;
  justify-content: space-between;
  align-items: center;
  & .MuiButton-label {
    font-size: 0.75rem;
    line-height: normal;
  }
`

class Product extends Component {
  static contextType = ThemeContext

  showProductInfo = (product) => {
    this.props.showProductTooltip(product)
  }

  hideProductInfo = () => {
    this.props.hideProductTooltip()
  }

  deleteProduct = () => {
    this.props.showConfirmationMessage(this.props.index, this.props.product._id, this.props.category)
  }

  render() {
    const { palette } = this.context

    return (
      <Draggable draggableId={this.props.product._id} index={this.props.index}>
        {(provided, snapshot) => (
          <Container
            palette={palette}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            isDragging={snapshot.isDragging}
            onMouseEnter={() => this.showProductInfo(this.props.product)}
            onMouseLeave={() => this.hideProductInfo()}
          >
            <Typography variant="h6" noWrap>
              {capitalizeTheFirstLetterOfEachWord(this.props.product.name)}
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
                color="primary"
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
