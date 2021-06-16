import { Component } from "react"

import { Draggable } from "react-beautiful-dnd"

import { Typography, Button } from "@material-ui/core"
import DeleteForeverIcon from "@material-ui/icons/DeleteForever"
import EditIcon from "@material-ui/icons/Edit"

import ThemeContext from "../../../../../ThemeContext"
import { Container } from "../CarteEditor/Product"

import { capitalizeTheFirstLetterOfEachWord } from "../../../../../utils"

class MenuProduct extends Component {
  static contextType = ThemeContext

  deleteProduct = () => {
    this.props.removeProduct(this.props.index, this.props.categoryIndex)
  }

  render() {
    const { palette } = this.context

    return (
      <Draggable draggableId={this.props.product.name} index={this.props.index}>
        {(provided, snapshot) => (
          <Container
            palette={palette}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            isDragging={snapshot.isDragging}
          >
            <Typography variant="h6" noWrap>
              {capitalizeTheFirstLetterOfEachWord(this.props.product.name)}
            </Typography>
            <div style={{ whiteSpace: 'nowrap' }}>
              <Button
                style={{ minWidth: '0', padding: '5px 12px 5px 12px', fontFamily: 'arial' }}
                onClick={this.deleteProduct}
                color="primary"
                endIcon={<DeleteForeverIcon />}
              >quitar</Button>
              <Button
                style={{ minWidth: '0', padding: '5px 12px 5px 0', fontFamily: 'arial' }}
                onClick={() => this.props.openProductForm(this.props.product._id)}
                color="primary"
                endIcon={<EditIcon />}
              />
            </div>
          </Container>
        )}
      </Draggable>
    )
  }
}

export default MenuProduct
