<template>
    <div class = "hbox">
        <div class="leftMenu">
            <LeftMenu />
        </div>
        <div class="topMenu">
            <TopMenu />
        </div>
        <div class="iconMenu">
            <IconMenu />
        </div>
        <div class="context">
            <Context />
        </div>
    </div>
</template>

<script setup>
import Context from './home/Context.vue';
import LeftMenu from './home/LeftMenu.vue';
import TopMenu from './home/TopMenu.vue';
import IconMenu from './home/IconMenu.vue';
import {useStore} from 'vuex'
import { ref,reactive,computed,onMounted } from 'vue'
import {error,success} from '../assets/message.js';
import { JsGetLeftMenu } from '@/js/common';
import { JsGetAvatar } from '@/js/user';

    const store = useStore();

    onMounted(() => {
        JsGetLeftMenu();

        JsGetAvatar();

        // 检查WebSocket实例是否存在
        const ws = store.state.ws
    if (ws) {
        // 设置消息监听器
        ws.onmessage = (e) => {
            console.log("接收到数据：", e.data);
            const data = JSON.parse(e.data);
            if(data.message == '聊天消息'){
                store.commit('setChats',data.data)
            }
        };

        // 设置连接关闭监听器
        ws.onclose = (e) => {
            console.log("连接已关闭：", e);
        };

        // 设置错误监听器
        ws.onerror = (e) => {
            console.error("发生错误：", e);
        };
        } else {
            console.error("WebSocket实例不存在");
        }
    })
</script>
<style scoped>
.hbox {
    height: 100vh;
    width: 100%;
    background-color: beige;
}
.leftMenu {
    float: left;
    height: 100vh;
    width: 30vh;
}
.topMenu {
    float: left;
    width: 69%;
    height: 10%;
}
.context {
    float: left;
    width:85%;
    height: 90%;
    background-color: aqua;
}
.iconMenu {
    float: left;
    width: 16%;
    height: 10%;
    background-color: greenyellow;
}
</style>