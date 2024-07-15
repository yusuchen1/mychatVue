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
                <p>
                    <el-popover
                        placement="top-start"
                      >
                        <template #reference>
                          <!-- <el-button class="m-2">Hover to activate</el-button> -->
                            {{chat.content}}
                        </template>
                        <span style="font-size:12px">
                            不超过2分钟的消息可被撤回。
                            <el-button type="" @click="$_delChat(chat.id)" > 撤回</el-button>
                        </span>
                      </el-popover>
                </p>
            </div>
        </div>
        <div>
        </div>
    </div>
    <div class="inputBlock">
        <div class="textBlock">
            <textarea v-model="mess.content" class="chat-input" placeholder="输入消息..." @keydown="handleKeydown"></textarea>
        </div>
        <div class="operateBlock">
            <div style="float:right;margin-top: 20px;margin-right: 20px;">
                <el-button @click="resetMess()">清空</el-button>
                <el-button @click="sendMess()" type="primary">发送</el-button>
                <el-button @click="openEmojiDialog">😊</el-button>
            </div>
        </div>
    </div>

    <el-dialog title="选择表情" v-model="emojiDialogVisible">
        <Emoji :mess="mess" @update-mess="updateMessContent" />
        <span slot="footer" class="dialog-footer">
            <el-button @click="emojiDialogVisible = false">关闭</el-button>
        </span>
    </el-dialog>

    <DefaultDialog v-if="defaultDialogIndex == 2" :isVisible="isVisible">
        <UserInfo />
    </DefaultDialog>
</template>

<script setup>
import { ref, reactive, computed, watch, nextTick } from 'vue';
import { delChat, sendMessage } from '../../api/chat.js';
import { useStore } from 'vuex';
import { success, error } from '../../assets/message.js';
import { JsGetOtherInfo } from '@/js/user.js';
import UserInfo from '../UserInfo.vue';
import DefaultDialog from '../common/DefaultDialog.vue';
import Emoji from './emoji.vue'

const store = useStore();
const mess = reactive({
    receiveUid: computed(() => store.state.rid),
    groupId: computed(() => store.state.gid),
    content: ''
});

const updateMessContent = (newContent) => {
  mess.content = newContent;
  emojiDialogVisible.value = false;
};

function sendMess() {
    if (mess.receiveUid == '' && mess.groupId == '') {
        error("请选择你要发送的对象");
        return;
    }
    if(mess.content == '') {
        error('请不要发送空数据');
        return;
    }
    sendMessage(mess).then(resp => {
        if (resp.data.code == 24200) {
            success(resp.data.message);
            mess.content = '';
        } else {
            error(resp.data.message);
        }
    });
}

function resetMess() {
    mess.content = '';
}

function handleKeydown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault(); // 阻止默认的回车行为
        sendMess();
    }
}

const nowChatId = computed(() => store.state.nowChatId);
const chats = computed(() => store.getters['getChats']);
const chatContainer = ref(null);
var oldScrollTop;
watch(chats, (newValue, oldValue) => {
    const nowScrollTop = chatContainer.value.scrollTop;
    console.log("o:" + oldScrollTop);
    console.log("n:" + nowScrollTop);

    nextTick(() => {
        if ((chatContainer.value && (oldScrollTop - nowScrollTop < 500)) || oldScrollTop == null) {
            const newScrollHeight = chatContainer.value.scrollHeight;
            chatContainer.value.scrollTop = newScrollHeight;
            oldScrollTop = chatContainer.value.scrollTop;
        }
    });
});

const isVisible = computed(() => store.state.defaultDialogVisible);
const defaultDialogIndex = computed(() => store.state.defaultDialogIndex);
function chatAvaClick(uid) {
    store.commit('setDefaultDialogIndex', 2);
    JsGetOtherInfo(uid);
}

const emojiDialogVisible = ref(false);

const openEmojiDialog = () => {
    emojiDialogVisible.value = true;
};

function $_delChat(id){
    delChat(id).then(resp => {
        if(resp.data.code == 24200){
            success(resp.data.message);
            store.commit('updateLeftMenuDelChat',id);
        }else{
            error(resp.data.message);
        }
    })
}
</script>

<style scoped>
.chatBlock {
    width: 100%;
    height: 70%;
    overflow: auto;
}
.inputBlock {
    width: 100%;
    height: 30%;
}
.textBlock {
    width: 100%;
    height: 70%;
    background-color: rgba(255, 255, 255, 0.205);
    position: relative;
    top: 5px;
}
.operateBlock {
    width: 100%;
    height: 30%;
}
.l {
    float: left;
}
.r {
    float: right;
}
.chat-input {
    width: 100%;
    height: 100%;
    resize: none;
    background-color: rgba(255, 255, 255, 0.5);
    border: 1px solid #ccc;
    border-radius: 10px;
    padding: 10px;
    font-size: 16px;
    outline: none;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.chat-bubble {
    max-width: 60%;
    padding: 10px;
    border-radius: 10px;
    margin: 10px;
    position: relative;
}
.sender {
    background-color: #5dd5f9;
}
.me {
    background-color: #77ea65;
}
.bubble-arrow {
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    border-top: 8px solid transparent;
    border-bottom: 12px solid transparent;
}
.sender .bubble-arrow {
    border-left: 15px solid transparent;
    border-right: 15px solid #5dd5f9;
    left: -25px;
    top: 5px;
}
.me .bubble-arrow {
    border-left: 15px solid #77ea65;
    border-right: 15px solid transparent;
    right: -25px;
    top: 5px;
}
.emoji-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}
.emoji-grid span {
    cursor: pointer;
    font-size: 24px;
}
</style>
