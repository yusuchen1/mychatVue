import {ElMessage} from 'element-plus'

export function success(message) {
    ElMessage({
        message: message,
        type:'success',
        plain:true,
    })
}

export function warning(message) {
    ElMessage({
        message: message,
        type:'warning',
        plain:true,
    })
}

export function info(message) {
    ElMessage({
        message: message,
        type:'info',
        plain:true,
    })
}

export function error(message) {
    ElMessage({
        message: message,
        type:'error',
        plain:true,
    })
}