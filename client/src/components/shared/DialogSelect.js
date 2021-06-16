import { useState, useContext } from "react"

import styled from "styled-components"

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputLabel,
  Input,
  MenuItem,
  FormControl,
  Select,
  FormHelperText,
} from "@material-ui/core"

import ThemeContext from "../../ThemeContext"

import { capitalizeTheFirstLetterOfEachWord } from "../../utils"

const CustomDialog = styled(Dialog)`
  & .MuiPaper-root {
    background-color: ${props => props.palette.secondary.main};
    width: 450px;
    margin: 0;
    @media (max-width: 649px) {
      width: 100%;
    }
  & h2 {
    font-size: 1rem;
  }
}
`
const CustomForm = styled.form`
  display: flex;
  flex-wrap: wrap;
`
const CustomFormControl = styled(FormControl)`
  width: 100%;
  margin: 0;
  @media (max-width: 649px) {
    width: 100%;
  }
`

export default function DialogSelect(props) {
  const { palette } = useContext(ThemeContext)
  const [open, setOpen] = useState(false)
  const [menu, setMenu] = useState("")
  const [category, setCategory] = useState("")

  const handleChange = (event) => {
    event.target.name === "menu"
      ? setMenu(event.target.value || "")
      : setCategory(event.target.value || "")
  }

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setMenu("")
    setCategory("")
    setOpen(false)
  }

  const handleSave = () => {
    props.addCategory(category)
    setMenu("")
    setCategory("")
    setOpen(false)
  }

  return (
    <div>
      <Button disabled={props.disabled} onClick={handleClickOpen}>incluir en otras cartas</Button>
      {props.product.name &&
        <CustomDialog palette={palette} disableBackdropClick open={open} onClose={handleClose}>
          <DialogTitle>
            Selecciona Carta y Categoría donde quieras incluir
            <b> {capitalizeTheFirstLetterOfEachWord(props.product.name)}</b>
          </DialogTitle>
          <DialogContent>
            <CustomForm>
              <CustomFormControl>
                <InputLabel htmlFor="menu">Carta</InputLabel>
                <Select
                  name="menu"
                  value={menu}
                  onChange={handleChange}
                  input={<Input id="menu" />}
                >
                  {props.otherMenus.map(elm => {
                    return <MenuItem
                      key={elm._id}
                      value={elm._id}
                    >
                      {capitalizeTheFirstLetterOfEachWord(elm.name)}
                    </MenuItem>
                  })}
                </Select>
              </CustomFormControl>
              <CustomFormControl disabled={menu ? false : true}>
                <InputLabel id="category">Categoría</InputLabel>
                <Select
                  name="category"
                  value={category}
                  onChange={handleChange}
                  input={<Input id="category" />}
                >
                  {props.otherCategories.filter(elm => {
                    return elm.inMenu === menu
                  }).map(elm => {
                    return <MenuItem
                      key={elm._id}
                      value={elm._id}
                    >
                      {capitalizeTheFirstLetterOfEachWord(elm.name)}
                    </MenuItem>
                  })
                  }
                </Select>
                <FormHelperText>Selecciona una carta antes de asignar categoría</FormHelperText>
              </CustomFormControl>
            </CustomForm>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleSave} color="primary">
              aceptar
            </Button>
            <Button onClick={handleClose} color="primary">
              cancelar
            </Button>
          </DialogActions>
        </CustomDialog>
      }
    </div>
  )
}
