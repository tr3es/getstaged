import axios from 'axios';
class ServiceAxios {
    constructor() {
        console.log("Le ServiceAxios est construit");
    }
    getRestClient() {
        if (!this.serviceInstance) {
            this.serviceInstance = axios.create({
                baseURL: 'http://localhost:5000/',
                timeout: 10000,
                headers: {
                    'Accept' : 'application/json',
                    'Content-Type': 'application/json'
                },
            });
        }
        return this.serviceInstance;
    }
}
export default (new ServiceAxios());