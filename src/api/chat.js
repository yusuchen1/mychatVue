import request from './axios.js'

export function selectChat(rid){
    return request({
        url:'/chat/'+rid,
        method: 'GET',
    })
}

export function selectGroupChat(gid){
    return request({
        url:'/chat/g/'+gid,
        method: 'GET',
    })
}

export function sendMessage(mess){
    return request({
        url:'/chat/save',
        method: 'POST',
        data: {
            receiveUid:mess.receiveUid,
            groupId:mess.groupId,
            content:mess.content
        }
    })
}