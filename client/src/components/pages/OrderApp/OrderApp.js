import { Component } from "react"

import Intro from "./Intro"
import ThemeContext from "../../../ThemeContext"
import Spinner from "../../shared/Spinner"

import SessionService from "../../../service/session.service"

import { isMobileDevice } from "../../../utils"

class OrderApp extends Component {
  static contextType = ThemeContext

  constructor(props) {
    super()

    this.state = {
      headers: undefined,
      alert: {
        open: false,
        message: "",
        severity: undefined,
        vertical: "bottom",
      },
    }
    this.sessionService = new SessionService()
  }

  componentDidMount = async () => {
    try {
      const headers = (await this.sessionService.getSession()).data
      this.setState({ headers, isMobileDevice: isMobileDevice(navigator.userAgent) })
    }
    catch (error) {
      this.setState({
        alert: {
          open: true,
          severity: "error",
          message: "Error de servidor",
          vertical: "bottom",
        }
      })
    }
  }

  render() {
    const { headers } = this.state
    const { palette, font } = this.context

    return (
      <>
        {headers
          ? <Intro>

          </Intro>
          : <Spinner />
        }
      </>
    )
  }
}

export default OrderApp