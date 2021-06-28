import { Component } from "react"

import Intro from "./Intro"
import OrderableMenu from "./OrderableMenu"
import Spinner from "../../shared/Spinner"

import OrderService from "../../../service/order.service"

class OrderApp extends Component {
  constructor() {
    super()

    this.state = {
      order: null,
      wantsToOrder: false,
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

  orderWithMobile = () => {
    this.setState({ wantsToOrder: true })
  }

  render() {
    const { order, wantsToOrder } = this.state
    const { orderWithMobile } = this

    return (
      <>
        {order
          ? order.products.length || wantsToOrder
            ? <OrderableMenu />
            : <Intro order={orderWithMobile} />
          : <Spinner />
        }
      </>
    )
  }
}

export default OrderApp