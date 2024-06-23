<template>
    <div class="chatBlock" ref="chatContainer">
        <div style="overflow:auto" v-for="chat in chats">
            <el-avatar class="l" v-if="!chat.me" style="margin-top:5px;margin-left:5px;" :src="chat.avatar" @click="chatAvaClick(chat.sendUid)"></el-avatar>
            <el-avatar class="r" v-else style="margin-top:5px;margin-left:5px;" :src="chat.avatar"></el-avatar>
            <span class="l" v-if="!chat.me" style="font-size: small;position: relative;left:10px;width: 95%;">{{chat.nickname}}</span>
            <span class="r" v-else style="font-size: small;position: relative;right:20px">{{chat.nickname}}</span>
            <div class="chat-bubble sender l" v-if="!chat.me" style="margin-right: 20px;position: relative;left:0px;top:-10px">
                <div class="bubble-arrow" />
                <p>{{chat.content}}</p>
            </div>
            <div class="chat-bubble me r" v-else style="margin-left: 20px;position: relative;right:-30px;top:10px">
                <div class="bubble-arrow" />
                <p>{{chat.content}}</p>
            </div>
        </div>
        <div>
        </div>
    </div>
    <div class="inputBlock">
        <div class="textBlock">
            <el-input
                v-model="mess.content"
                style="width: 100%;height: 100%"
                type="textarea"
                :rows="6"
                clearable
            />
        </div>
        <div class="operateBlock">
            <div style="float:right;margin-top: 20px;margin-right: 20px;">
                <el-button>关闭</el-button>
                <el-button @click="sendMess()" type="primary">发送</el-button>
            </div>
        </div>
    </div>

    <DefaultDialog v-if="defaultDialogIndex == 2" :isVisible="isVisible">
        <UserInfo />
    </DefaultDialog>
</template>
<script setup>
import {ref,reactive,computed,watch,nextTick} from 'vue';
import {sendMessage} from '../../api/chat.js'
import {useStore} from 'vuex'
import {success,error} from '../../assets/message.js'
import { JsGetOtherInfo } from '@/js/user.js';
import UserInfo from '../UserInfo.vue';
import DefaultDialog from '../common/DefaultDialog.vue';
import { JsUpdataCronyInfo } from '@/js/crony.js';

    const store = useStore();
    const mess = reactive({
        receiveUid:computed(() => store.state.rid),
        groupId:computed(() => store.state.gid),
        content:''
    })

    function sendMess(){
        if(mess.receiveUid == '' && mess.groupId == ''){
            error("请选择你要发送的对象")
            return;
        }
        sendMessage(mess).then(resp => {
            if(resp.data.code == 24200){
                success(resp.data.message)
                mess.content = '';
            }else{
                error(resp.data.message)
            }
        })
    }

    const nowChatId = computed(() => store.state.nowChatId)
    const chats = computed(() => store.getters['getChats'])
    const chatContainer = ref(null);
    var oldScrollTop;
    watch(chats,(newValue,oldValue) => {
        const nowScrollTop = chatContainer.value.scrollTop;
        console.log("o:"+oldScrollTop)
        console.log("n:"+nowScrollTop)

        nextTick(() => {
            if((chatContainer.value && (oldScrollTop - nowScrollTop < 500)) || oldScrollTop == null){
                const newScrollHeight = chatContainer.value.scrollHeight;
                chatContainer.value.scrollTop = newScrollHeight;
                oldScrollTop = chatContainer.value.scrollTop;
            }
        })
    })

    const isVisible = computed(() => store.state.defaultDialogVisible)
    const defaultDialogIndex = computed(() => store.state.defaultDialogIndex)
    function chatAvaClick(uid){
        store.commit('setDefaultDialogIndex',2);
        JsGetOtherInfo(uid);
    }
</script>
<style scoped>
.chatBlock {
    width: 100%;
    height: 70%;
    background-color: azure;
    overflow: auto;
}
.inputBlock {
    width: 100%;
    height: 30%;
    background-color: aquamarine
}
.textBlock {
    width:100%;
    height: 70%;
    background-color:white;
    position: relative;
    top:5px;
}
.operateBlock {
    width: 100%;
    height: 30%;
}

.l{
    float:left;
}

.r{
    float:right;
}

/* 聊天气泡的基本样式 */
.chat-bubble {
  max-width: 60%;
  padding: 10px;
  border-radius: 10px;
  margin: 10px;
  position: relative;
}

/* 发送者气泡样式 */
.sender {
  background-color: #5dd5f9;
}

/* 接收者气泡样式 */
.me {
  background-color: #77ea65;
}

/* 气泡箭头样式 */
.bubble-arrow {
  content: '';
  position: absolute;
  width: 0;
  height: 0;
  /* border: 10px solid transparent; */
  border-top: 8px solid transparent;
  border-bottom: 12px solid transparent;
}

/* 发送者气泡箭头 */
.sender .bubble-arrow {
  border-left: 15px solid transparent;
  border-right: 15px solid #5dd5f9;
  /* border-bottom-color: #ebebeb; */
  left: -25px;
  top: 5px;
}

/* 接收者气泡箭头 */
.me .bubble-arrow {
    border-left: 15px solid #77ea65;
    border-right: 15px solid transparent;
  /* border-bottom-color: #c0def6; */
  right: -25px;
  top: 5px;
}

</style>