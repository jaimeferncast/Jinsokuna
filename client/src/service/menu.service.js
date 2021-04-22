import axios from 'axios'

class MenuService {

    constructor() {
        this.api = axios.create({
            baseURL: process.env.REACT_APP_API_URL,
            withCredentials: true
        })
    }
    getCategories = () => this.api.get('category/')
    addCategory = (categoryData) => this.api.post('category/new', categoryData)
    deleteCategory = (id) => this.api.delete(`category/${id}`)
    updateCategory = (id, categoryData) => this.api.put(`category/${id}`, categoryData)
    getProducts = () => this.api.get('product/')
    addProduct = (productData) => this.api.post('product/new', productData)
    deleteProduct = (id) => this.api.delete(`product/${id}`)
    updateProduct = (id, productData) => this.api.put(`product/${id}`, productData)
}

export default MenuService
