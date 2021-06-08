import { useContext } from "react"

import styled from "styled-components"

import { Grid, FormControl, InputLabel, Select, MenuItem } from "@material-ui/core"

import ThemeContext from "../../ThemeContext"

import { capitalizeTheFirstLetterOfEachWord } from "../../utils"

const Container = styled(Grid)`
  display: none;
  @media (max-width: 1067px) {
    display: ${props => props.noDisplay ? "none" : "inline-flex"};
  }
  .select {
    margin: 0 0 -5px 15px;
  }
`

function ThemeSelection(props) {
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
    <Container container justify="center" wrap="nowrap" noDisplay={props.noDisplay}>
      <FormControl variant="outlined" size="small" className="select">
        <InputLabel>Colores</InputLabel>
        <Select
          name="palette"
          value={paletteName}
          onChange={handleChange}
          label="Colores"
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
              style={{ fontFamily: elm }}
            >
              {capitalizeTheFirstLetterOfEachWord(elm)}
            </MenuItem>
          })}
        </Select>
      </FormControl>
    </Container>
  )
}

export default ThemeSelection
