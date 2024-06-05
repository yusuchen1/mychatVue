import request from './axios.js'

export function login(loginUser){
    console.log(loginUser)
    return request({
        url:'/user/login',
        method: 'GET',
        params:{
            username:loginUser.username,
            password:loginUser.password
        }
    })
}

export function register(registerUser){
    return request({
        url:'/user/register',
        method: 'POST',
        data:{
            nickname:registerUser.nickname,
            username:registerUser.username,
            password:registerUser.password,
            sex:registerUser.sex,
            phone:registerUser.phone
        }
    })
}