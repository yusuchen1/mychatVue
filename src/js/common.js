import store from '@/store'
import {getLeftMenu} from '../api/home.js';
import {success,error} from '@/assets/message.js'


export function JsGetLeftMenu(){
    getLeftMenu().then((resp) => {
        if(resp.data.code == 24200){
            console.log("dayin")
            console.log(resp.data.data);
            store.commit('setLeftMenuList', resp.data.data)
        }else{
            error(resp.data.message)
        }
    })
}