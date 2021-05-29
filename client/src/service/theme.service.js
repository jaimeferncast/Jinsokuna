import axios from 'axios'

class ThemeService {

    constructor() {
        this.api = axios.create({
            baseURL: process.env.REACT_APP_API_URL + "/themes/",
            withCredentials: true
        })
    }
    getPalettes = () => this.api.get('palettes/')
    updatePalette = (name) => this.api.put(`palettes/${name}`)
    getFonts = () => this.api.get('fonts/')
    updateFont = (name) => this.api.put(`fonts/${name}`)
}

export default ThemeService
