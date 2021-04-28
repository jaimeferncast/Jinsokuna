import axios from 'axios'

class MenuService {

    constructor() {
        this.api = axios.create({
            baseURL: process.env.REACT_APP_API_URL,
            withCredentials: true
        })
    }
    getCategories = () => this.api.get('categories/')
    addCategory = (categoryData) => this.api.post('categories/new', categoryData)
    deleteCategory = (id) => this.api.delete(`categories/${id}`)
    updateCategory = (id, categoryData) => this.api.put(`categories/${id}`, categoryData)
    getProducts = () => this.api.get('products/')
    addProduct = (productData) => this.api.post('products/new', productData)
    deleteProduct = (id) => this.api.delete(`products/${id}`)
    updateProduct = (id, productData) => this.api.put(`products/${id}`, productData)
}

export default MenuService
