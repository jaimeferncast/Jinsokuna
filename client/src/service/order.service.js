import axios from 'axios'

class OrderService {

    constructor() {
        this.api = axios.create({
            baseURL: process.env.REACT_APP_API_URL + "/orders/",
            withCredentials: true
        })
    }
    getOrder = (table) => this.api.get(`${table}`)
}

export default OrderService
