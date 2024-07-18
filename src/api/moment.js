import request from './axios.js'

export function addOrEditMoment(data) {
    return request({
        url:'/moment/addOrEditMoment',
        method: 'POST',
        data
    })
}


export function deleteMoment(id) {
    return request({
        url:'/moment/deleteMoment',
        method: 'DELETE',
        params: {
            id
        }
    })
}

export function getMoments(){
    return request({
        url:'/moment',
        method: 'GET'
    })
}

export function likeMoments(momentId){
    return request({
        url:'/moment/like',
        method: 'POST',
        params: {
            momentId
        }
    })
}


export function addComment(data){
    return request({
        url:'/moment/addComment',
        method: 'POST',
        params: {
            replay:data.replay,
            content: data.content,
            momentsId: data.momentsId
        }
    })
}


export function deleteComment(momentsDetailsId){
    return request({
        url:'/moment/deleteComment',
        method: 'DELETE',
        params: {
            momentsDetailsId
        }
    })
}