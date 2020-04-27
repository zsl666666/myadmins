import {request} from "./index"
import axios from 'axios'

export function getProductsdata(){
    return request({
        url: '/list',
        method: 'get',
    })
}

export function getIddata(id){
    return request({
        url:`/list/${id}`,
        method: 'get'
    })
}

export function deleteIddata(id){
    return axios.delete(`http://localhost:3000/list/${id}`)
}

export function getVisitorData(){
    return request({
        url: '/devs',
        method: 'get',
    })
}

export function deleteContack(id){
    return axios.delete(`http://localhost:3000/devs/${id}`)
}