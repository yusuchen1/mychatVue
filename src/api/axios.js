import axios from 'axios'
import store from '../store'
import router from '../router'
import {error} from '../assets/message.js'

const request = axios.create({
    baseURL:'/api/',
    timeout:5000,
})

request.interceptors.request.use(
    config => {
        const jwt = store.state.jwt
        if(jwt != ''){
            config.headers.token = jwt;
        }
        return config;
    },
    error => {
        // 响应错误的处理
        return Promise.reject(error);
    }
)

request.interceptors.response.use(
    // 成功响应的处理
    response => {
        // 用户未登录
        if(response.data.code == 24403){
            error(response.data.message)
            router.push('/login');
        }
        return response;
    }
)

export default request;