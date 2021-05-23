import React from "react"
import ReactDOM from "react-dom"
import { BrowserRouter as Router } from "react-router-dom"

import { CustomThemeProvider } from "./ThemeContext"
import App from "./components/App"

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <CustomThemeProvider>
        <App />
      </CustomThemeProvider >
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
)
