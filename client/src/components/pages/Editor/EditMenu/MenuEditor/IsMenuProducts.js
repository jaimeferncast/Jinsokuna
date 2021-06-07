import { useContext } from "react"

import styled from "styled-components"

import { Draggable, Droppable } from "react-beautiful-dnd"

import { Grid, Button, Typography, Divider } from "@material-ui/core"
import DeleteForeverIcon from "@material-ui/icons/DeleteForever"
import EditIcon from "@material-ui/icons/Edit"

import ThemeContext from "../../../../../ThemeContext"

import { capitalizeTheFirstLetterOfEachWord } from "../../../../../utils"

const ProductList = styled.div`
  border: 1px solid ${props => props.palette.primary.main};
  border-radius: 5px;
  background-color: ${props => props.palette.dark};
  height: fit-content;
  overflow-y: scroll;
  width: 450px;
  margin-top: 35px;
  padding: 10px 20px;
  @media (max-width: 1067px) {
    position: fixed;
    width: 95%;
    max-height: 85vh;
  }
`
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
    <ProductList palette={palette}>
      <Typography variant="subtitle1">
        Lista de productos disponibles para menús.
      </Typography>
      <Divider style={{ margin: "10px -20px 15px -20px" }} />
      {!props.isMenuProducts?.length || !props.isMenuProducts
        ? <Typography variant="body2">
          Agrega productos a esta lista desde alguna de las cartas, entrando en edición de producto y seleccionando la opción "DISPONIBLE EN MENÚS".
            </Typography>
        : <Droppable droppableId="isMenuProducts" type="product">
          {(provided) => (
            <Grid
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {props.isMenuProducts.map((elm, index) =>
                <Draggable draggableId={elm._id} index={index + 1} key={index}>
                  {(provided) => (
                    <Product
                      palette={palette}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      ref={provided.innerRef}
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
    </ProductList>
  )
}

export default IsMenuProducts