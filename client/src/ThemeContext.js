import { Component, createContext } from "react"

import theme from "./components/theme"

import ThemeService from "./service/theme.service"

const ThemeContext = createContext()

class CustomThemeProvider extends Component {

  state = {
    palette: "",
    font: "",
  }

  themeService = new ThemeService()

  componentDidMount = async () => {
    const [palette] = (await this.themeService.getPalettes()).data.message
    const [font] = (await this.themeService.getFonts()).data.message
    this.setState({ palette: palette.name, font: font.name })
  }

  changePalette = (palette) => {
    this.themeService.updatePalette(palette)
      .then(() => this.setState({ palette }))
      .catch((err) => alert(err))
  }

  changeFont = (font) => {
    this.themeService.updateFont(font)
      .then(() => this.setState({ font }))
      .catch((err) => alert(err))
  }

  render() {
    const { children } = this.props
    const { palette, font } = this.state
    const { changePalette, changeFont } = this

    return (
      (this.state.palette && this.state.font) &&
      <ThemeContext.Provider value={{
        theme: theme,
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
