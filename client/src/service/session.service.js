import axios from 'axios'

class SessionService {

    constructor() {
        this.api = axios.create({
            baseURL: process.env.REACT_APP_API_URL + "/sessions/",
            withCredentials: true
        })
    }
    getSession = () => this.api.get('')
}

export default SessionService
