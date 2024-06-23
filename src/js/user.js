import {getAvatar, getOtherInfo,getUserInfo,updateUserInfo,updatePassword} from '@/api/user.js'
import {success,error} from '@/assets/message.js'
import store from '@/store'


export function JsGetOtherInfo(uid){
    getOtherInfo(uid).then(resp => {
        if(resp.data.code == 24200){
            store.commit("setOtherInfo",resp.data.data);
            store.commit("reverseDefaultDialogVisible")
        }else{
            error(resp.data.message);
        }
    })
}

export function JsGetAvatar(){
    getAvatar().then(resp => {
        if(resp.data.code == 24200){
            if(resp.data.data != null && resp.data.data != ''){
                store.state.avatar = resp.data.data;
            }
        }else{
            error(resp.data.message);
        }
    })
}

// isopen:是否打开默认dialog
export function JsGetUserInfo(isopen){
    getUserInfo().then(resp => {
        if(resp.data.code == 24200){
            store.commit("setUserInfo",resp.data.data);
            if(isopen){
                store.commit('reverseDefaultDialogVisible');
            }
        }else{
            error(resp.data.message);
        }
    })
}

export function JsUpdateUserInfo(){
    updateUserInfo(store.state.userInfo).then(resp => {
        if(resp.data.code == 24200){
            success(resp.data.message);
            // 更新头像
            store.state.avatar = store.state.userInfo.avatar;
        }else{
            error(resp.data.message);
        }
    })
}

export function JsUserUpdatePassword(data){
    updatePassword(data).then(resp => {
        if(resp.data.code == 24200){
            success(resp.data.message);
        }else{
            error(resp.data.message);
        }
    })
}