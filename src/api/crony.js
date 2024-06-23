import request from './axios.js';
export function cronyAdd(data){
    return request({
        url:'/crony/cronyAdd',
        method: 'POST',
        data
    })
}

export function getCronyGroup(){
    return request({
        url:'/crony/getAllCronyGroup',
        method: 'GET',
    })
}

export function addCronyGroup(groupName){
    return request({
        url:'/crony/addCronyGroup',
        method: 'POST',
        params:{groupName}
    })
}

// 获取用户消息
export function getUserMessage(){
    return request({
        url:'/crony/getUserMessage',
        method: 'GET',
    })
}

export function agreeCrony(data){
    return request({
        url:'/crony/agreeCrony',
        method: 'POST',
        data:{
            cronyAskId:data.cronyAskId,
            cronyGroupId:data.cronyGroupId,
            description:data.description
        }
    })
}

export function updataCronyInfo(data){
    return request({
        url:'/crony/updataCronyInfo',
        method:'PUT',
        data:{
            cronyId:data.cronyId,
            cronyGroupId:data.cronyGroupId,
            description:data.description
        }
    })
}

export function getAllCronyGroup(){
    return request({
        url:'/crony/getCronyGroup',
        method:'GET',
    })
}

export function deleteCronyGroup(groupId){
    return request({
        url:'/crony/deleteCronyGroup',
        method:'DELETE',
        params:{groupId:groupId}
    })
}

export function dropCrony(cronyId){
    return request({
        url:'/crony/dropCrony',
        method:'DELETE',
        params:{
            cronyId
        }
    })
}

export function getGroupMember(gid){
    return request({
        url:'/crony/groupMember',
        method:'GET',
        params:{
            gid
        }
    })
}

export function refuseCrony(askId){
    return request({
        url:'/crony/refuseCrony/'+askId,
        method:'DELETE',
    })
}