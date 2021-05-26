import { Component, createContext } from "react"

import theme from "./components/theme"

const ThemeContext = createContext()

class CustomThemeProvider extends Component {

  state = {
    palette: "sophisticated",
    font: "verdana",
  }

  changePalette = (palette) => {
    this.setState({ palette })
  }

  changeFont = (font) => {
    this.setState({ font })
  }

  render() {
    const { children } = this.props
    const { palette, font } = this.state
    const { changePalette, changeFont } = this

    return (
      <ThemeContext.Provider value={{
        palette: theme.palette[palette],
        font: theme.font[font],
        changePalette,
        changeFont,
      }}>
        {children}
      </ThemeContext.Provider>
    )
  }
}

export default ThemeContext

export { CustomThemeProvider }
