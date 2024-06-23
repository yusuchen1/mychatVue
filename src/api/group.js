import request from './axios.js';

export function makeGroup(data){
    return request({
        url:'/group/makeGroup',
        method: 'POST',
        data: {
            avatar:data.avatar,
            number:data.number,
            name:data.name
        }
    })
}

export function searchGroup(key,page,size){
    return request({
        url:'/group/searchGroup',
        method: 'GET',
        params: {
            key,
            page,
            size
        }
    })
}

export function joinGroup(gid){
    return request({
        url:'/group/joinGroup',
        method:'POST',
        params: {
            gid:gid
        }
    })
}

export function getGroupInfo(gid){
    return request({
        url:'/group/groupInfo',
        method:'GET',
        params: {
            gid
        }
    })
}

export function getGroupsM(){
    return request({
        url:'/group/groupsM',
        method:'GET'
    })
}

export function exitGroup(gid){
    return request({
        url:'/group/exitGroup',
        method:'DELETE',
        params:{
            gid
        }
    })
}