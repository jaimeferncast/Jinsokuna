import { useState, useContext } from "react"

import styled from "styled-components"

import { makeStyles } from "@material-ui/core/styles"
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
    background-color: ${props => props.palette.dark};
  }
`
const CustomForm = styled.form`
  display: flex;
  flex-wrap: wrap;
`
const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 420,
  },
}))

export default function DialogSelect(props) {
  const { palette } = useContext(ThemeContext)
  const classes = useStyles()
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
    setOpen(false)
  }

  const handleSave = () => {
    props.addCategory(category)
    setOpen(false)
  }

  return (
    <div>
      <Button onClick={handleClickOpen}>incluir en otras cartas</Button>
      {props.product.name &&
        <CustomDialog palette={palette} disableBackdropClick open={open} onClose={handleClose}>
          <DialogTitle>
            Selecciona Carta y Categoría donde quieras incluir
            {capitalizeTheFirstLetterOfEachWord(props.product.name)}
          </DialogTitle>
          <DialogContent>
            <CustomForm>
              <FormControl className={classes.formControl}>
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
              </FormControl>
              <FormControl className={classes.formControl} disabled={menu ? false : true}>
                <InputLabel id="category">Categoría</InputLabel>
                <Select
                  name="category"
                  value={category}
                  onChange={handleChange}
                  input={<Input id="category" />}
                >
                  {props.otherCategories.filter(elm => {
                    return elm.inMenu === menu
                  })
                    .map(elm => {
                      return <MenuItem
                        key={elm._id}
                        value={elm._id}
                      >
                        {capitalizeTheFirstLetterOfEachWord(elm.name)}
                      </MenuItem>
                    })}
                </Select>
                <FormHelperText>Selecciona una carta antes de asignar categoría</FormHelperText>
              </FormControl>
            </CustomForm>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              cancelar
          </Button>
            <Button onClick={handleSave} color="primary">
              guardar
          </Button>
          </DialogActions>
        </CustomDialog>
      }
    </div>
  )
}
