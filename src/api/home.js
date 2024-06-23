import request from './axios.js'

export function getLeftMenu(){
    return request({
        url:'/common/leftMenu',
        method:'GET',
    })
}