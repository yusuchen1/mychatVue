import store from '@/store'
import { reactive } from 'vue'
import { success,error } from '@/assets/message'
import {cronyAdd,agreeCrony,getUserMessage,updataCronyInfo} from '@/api/crony.js'

export function JsCronyAdd(){
    const otherInfo = store.state.otherInfo
    const data = reactive({
        cronyAskId:otherInfo.id,
        cronyGroupId:otherInfo.cronyGroupId,
        description:otherInfo.description
    })
    console.log(data)
    cronyAdd(data).then(resp => {
        if(resp.data.code == 24200){
            success(resp.data.message)
            store.commit("reverseDefaultDialogVisible");
        }else{
            error(resp.data.message);
        }
    })
  }

  export function JSAgreeCrony(cronyAskId){
    const otherInfo = store.state.otherInfo
    const data = reactive({
        cronyAskId:cronyAskId,
        cronyGroupId:otherInfo.cronyGroupId,
        description:otherInfo.description
    })
    agreeCrony(data).then(resp => {
        if(resp.data.code == 24200){
            let cronyGroups = store.state.leftMenuList.cronyGroups;
            let cg = resp.data.data;
            cronyGroups.forEach(cronyGroup => {
                if(cronyGroup.groupName == cg.groupName){
                    cronyGroup.cronys.push(cg.cronys[0]);
                }
            })
            console.log(store.state.leftMenuList.cronyGroups);
            success(resp.data.message)
            store.commit("reverseDefaultDialogVisible");
            store.commit("removeUserMessageByAskid",cronyAskId)
        }else{
            error(resp.data.message)
        }
    })
  }

  export function JsGetUserMessage(){
    getUserMessage().then((resp) => {
        if(resp.data.code == 24200){
            store.commit('setUserMessage',resp.data.data);
        }else{
            error(resp.data.message)
        }
    })
}

export function JsUpdataCronyInfo(){
    const otherInfo = store.state.otherInfo;
    console.log(otherInfo.value);
    const data = reactive({
        cronyId:otherInfo.id,
        description:otherInfo.description,
        cronyGroupId:otherInfo.cronyGroupId
    })
    updataCronyInfo(data).then((resp) => {
        if(resp.data.code == 24200){
            success(resp.data.message);
            let cronyGroupName = '';
            // 获取到好友组名
            otherInfo.cronyGroupVOS.forEach((item) => {
                if(item.cronyGroupId == otherInfo.cronyGroupId){
                    cronyGroupName = item.crongGroupName;
                }
            })
            const info = reactive({
                cronyId:otherInfo.id,
                description:otherInfo.description,
                cronyGroupName
            })
            store.commit("updateCronyInfo",info)
        }else{
            error(resp.data.message);
        }
    })
}