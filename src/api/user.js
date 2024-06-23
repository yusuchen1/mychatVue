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

export function searchUser(key,page,size){
    return request({
        url:"/user/searchUser",
        method:'GET',
        params:{
            key,
            page,
            size
        }
    })
}

export function getOtherInfo(uid){
    return request({
        url:"/user/getOtherInfo",
        method:'GET',
        params:{uid}
    })
}

export function getAvatar(){
    return request({
        url:'/user/getAvatar',
        method:'GET',
    })
}

export function getUserInfo(){
    return request({
        url:'/user/getUserInfo',
        method:'GET',
    })
}

export function updateUserInfo(data){
    return request({
        url:'/user/updateUserInfo',
        method:'PUT',
        data
    })
}

export function updatePassword(data){
    return request({
        url:'/user/updatePassword',
        method:'PUT',
        data:{
            oldPassword:data.oldPassword,
            newPassword:data.newPassword
        }
    })
}