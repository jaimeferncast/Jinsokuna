import { useContext } from "react"

import styled from "styled-components"

import { Draggable, Droppable } from "react-beautiful-dnd"

import { Grid, Button, Typography, Divider } from "@material-ui/core"
import DeleteForeverIcon from "@material-ui/icons/DeleteForever"
import EditIcon from "@material-ui/icons/Edit"

import ThemeContext from "../../../../../ThemeContext"
import { Tooltip } from "../CarteEditor/ProductTooltip"

import { capitalizeTheFirstLetterOfEachWord } from "../../../../../utils"

const Product = styled(Grid)`
  padding: 5px 10px 5px 20px;
  margin: -5px -20px 0;
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  justify-content: space-between;
  background-color: ${props => props.palette.dark};
`

function IsMenuProducts(props) {
  const { palette } = useContext(ThemeContext)

  return (
    <Tooltip
      menuDescription={props.menuDescription}
      palette={palette}
      padding="10px 20px"
    >
      <Typography variant="subtitle1">
        Lista de productos disponibles para menús.
      </Typography>
      <Divider style={{ margin: "10px -20px 15px -20px" }} />
      {!props.isMenuProducts
        ? <Typography variant="body1" nowrap>
          Usa los botones que hay a la derecha de los nombres de carta, categoría y producto, para
            </Typography>
        : <Droppable droppableId="isMenuProducts" type="product">
          {(provided, snapshot) => (
            <Grid
              ref={provided.innerRef}
              {...provided.droppableProps}
              isDraggingOver={snapshot.isDraggingOver}
            >
              {props.isMenuProducts.map((elm, index) =>
                <Draggable draggableId={elm._id} index={index + 1} key={index}>
                  {(provided, snapshot) => (
                    <Product
                      palette={palette}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      ref={provided.innerRef}
                      isDragging={snapshot.isDragging}
                    >
                      <Typography variant="body1" noWrap>
                        {capitalizeTheFirstLetterOfEachWord(elm.name)}
                      </Typography>
                      <div style={{ whiteSpace: 'nowrap' }}>
                        <Button
                          style={{ minWidth: '0', padding: '5px 12px 5px 0' }}
                          onClick={() => props.openProductForm(index)}
                          endIcon={<EditIcon />}
                        />
                        <Button
                          style={{ minWidth: '0', padding: '5px 12px 5px 0' }}
                          onClick={() => props.removeFromMenus(index)}
                          color="primary"
                          endIcon={<DeleteForeverIcon />}
                        ></Button>
                      </div>
                    </Product>
                  )}
                </Draggable>
              )}
              {provided.placeholder}
            </Grid>
          )}
        </Droppable>
      }
    </Tooltip>
  )
}

export default IsMenuProducts