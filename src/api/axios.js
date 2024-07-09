import axios from 'axios'
import router from '../router'
import {error, success} from '../assets/message.js'
import { ElMessage } from 'element-plus'

const request = axios.create({
    baseURL:'/api/',
    timeout:5000,
})

request.interceptors.request.use(
    config => {
        const jwt = sessionStorage.getItem('jwt')
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
    },
    error => {
        // 错误响应的处理
        if (error.response && error.response.status === 401) {
            ElMessage({
                message: "请登录后重试",
                type:'error',
                plain:true,
            })
            // 用户未登录或登录过期
            router.push('/login');
        }
        return Promise.reject(error);
    }
)

export default request;