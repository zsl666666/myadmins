import axios from 'axios'

export function request(config){
    const instance = axios.create({
        baseURL: "http://localhost:3000",
        timeout:10000
    })

    instance.interceptors.request.use(config =>{
        return config;
    },err =>{
        console(err);
    })

    instance.interceptors.response.use(res =>{
        return res;
    },err =>{
        console.log(err)
    })

    return instance(config)
}