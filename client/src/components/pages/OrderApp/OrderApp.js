import { Component } from "react"

import Intro from "./Intro"
import OrderableMenu from "./OrderableMenu"

import OrderService from "../../../service/order.service"

class OrderApp extends Component {
  constructor() {
    super()

    this.state = {
      order: null,
      alert: {
        open: false,
        message: "",
        severity: undefined,
        vertical: "bottom",
      },
    }
    this.orderService = new OrderService()
  }

  componentDidMount = async () => {
    console.log(document.cookie)
    try {
      const order = (await this.orderService.getOrder(this.props.location.search.slice(-3))).data
      this.setState({ order })
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
    const { order } = this.state

    return (
      <>
        {order
          ? <OrderableMenu />
          : <Intro />
        }
      </>
    )
  }
}

export default OrderApp