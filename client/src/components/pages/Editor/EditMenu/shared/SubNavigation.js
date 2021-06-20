import { useContext } from "react"

import styled from "styled-components"

import { Grid, FormControl, InputLabel, Select, MenuItem } from "@material-ui/core"

import ThemeContext from "../../../../../ThemeContext"
import CustomButton from "../../../../shared/CustomButton"

import { capitalizeTheFirstLetterOfEachWord } from "../../../../../utils"

const Container = styled(Grid)`
  height: 80px;
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 1000;
  flex-wrap: nowrap;
  background-color: ${props => props.palette.dark + 'cc'};
  @media (max-width: 1067px) {
    height: 60px;
    padding-bottom: 5px;
  }
  .select {
    min-width: 100px;
    margin: 0 10px;
    @media (max-width: 1067px) {
      display: none;
    }
    & label {
      font-family: arial;
    }
  }
  .colors {
    & .MuiInputBase-input {
      font-family: arial;
    }
  }
`
const SubButton = styled(CustomButton)`
  margin: 0 20px;
  min-width: fit-content;
  @media (max-width: 375px) {
    margin: 0 10px;
    min-width: fit-content;
  }
  @media (max-width: 332px) {
    margin: 0 5px;
    min-width: fit-content;
  }
`

function SubNavigation(props) {
  const { theme, palette, font, changePalette, changeFont } = useContext(ThemeContext)

  let paletteName
  const palettes = []
  for (const [key, value] of Object.entries(theme.palette)) {
    palettes.push(key)
    if (value === palette) paletteName = key
  }

  let fontName
  const fonts = []
  for (const [key, value] of Object.entries(theme.font)) {
    fonts.push(key)
    if (value === font) fontName = key
  }

  const handleChange = (event) => {
    event.target.name === "palette"
      ? changePalette(event.target.value)
      : changeFont(event.target.value)
  }

  return (
    <Container palette={palette} container justify="center" alignItems="center">
      <Grid item>
        <SubButton
          variant="contained"
          color="primary"
          onClick={() => props.previewMenu()}
        >vista previa de Carta</SubButton>
      </Grid>

      <FormControl variant="outlined" size="small" className="select colors">
        <InputLabel>Colores</InputLabel>
        <Select
          name="palette"
          value={paletteName}
          onChange={handleChange}
          label="Esquema de colores"
        >
          {palettes.map(elm => {
            return <MenuItem
              key={elm}
              value={elm}
              style={{ background: `linear-gradient(217deg, ${theme.palette[elm].dark}, ${theme.palette[elm].primary.main})` }}
            >
              {capitalizeTheFirstLetterOfEachWord(elm)}
            </MenuItem>
          })}
        </Select>
      </FormControl>
      <FormControl variant="outlined" size="small" className="select">
        <InputLabel>Tipografía</InputLabel>
        <Select
          name="font"
          value={fontName}
          onChange={handleChange}
          label="Tipografía"
        >
          {fonts.map(elm => {
            return <MenuItem
              key={elm}
              value={elm}
              style={{ fontFamily: theme.font[elm] }}
            >
              {capitalizeTheFirstLetterOfEachWord(elm)}
            </MenuItem>
          })}
        </Select>
      </FormControl>

      <Grid item>
        <SubButton
          variant="contained"
          color="primary"
          onClick={() => props.goBack()}
        >volver</SubButton>
      </Grid>
    </Container >
  )
}

export default SubNavigation