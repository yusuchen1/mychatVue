<template>
    <div>
        <el-card v-for="user in userMessage" style="width: 100%; height:120px;margin-top:10px" shadow="hover">
            <el-image class="l" style="width: 80px; height: 50%" :src="user.avatar" />
            <p class="l" style="font-size:18px;margin-left:15px">{{ user.nickname }}</p>
            <p class="l" style="font-size: 15px;position: absolute;right:30px;">请求添加你为好友</p>
            <p class="l" style="font-size:15px;margin-left:15px;margin-top: 10px;width: 70%;">
                <span style="font-size: 15px;position: relative;top:20px;">签名: {{ user.signature }}</span>
            </p>
            <div class='r' style="position: relative;bottom:10px;right:-15px">
                <el-button type="primary" @click="$_agree(user.id,user.askId)">同意</el-button>
                <el-button type="error" @click="$_refuse(user.askId)">拒绝</el-button>
            </div>
        </el-card>
    </div>

    <DefaultDialog v-if="defaultDialogIndex == 4" :isVisible="defaultDialog">
        <UserInfo :primary-bt-text="primaryBtText" :primary-bt-click="primaryBtClick" :custom="true"/>
    </DefaultDialog>
</template>

<script setup>
import {reactive,computed,ref} from 'vue'
import {useStore} from 'vuex'
import UserInfo from '@/components/UserInfo.vue';
import DefaultDialog from '../../common/DefaultDialog.vue';
import { JsGetOtherInfo } from '@/js/user';
import { JSAgreeCrony, JsGetUserMessage } from '@/js/crony';
import { JsGetLeftMenu } from '@/js/common';
import { refuseCrony } from '@/api/crony';
import { error, success } from '@/assets/message';

    const store = useStore();
    const defaultDialogIndex = computed(() => store.state.defaultDialogIndex);
    const defaultDialog = computed(() => store.state.defaultDialogVisible)
    const userMessage = computed(() => store.state.userMessage)
    const primaryBtText = ref('确定');
    var cronyAskId;
    const primaryBtClick = function(){
        JSAgreeCrony(cronyAskId);
        // JsGetLeftMenu();
        console.log(userMessage);
    }

    function $_agree(uid,askId){
        cronyAskId = askId;
        store.commit('setDefaultDialogIndex',4);
        JsGetOtherInfo(uid);
    }
// reactive({
//     id:'0',
//     avatar:"https://sc-canqiong.oss-cn-hangzhou.aliyuncs.com/dingzheng.png",
//     nickname:"丁真珍珠",
//     signature:"妈妈生的",
// })

function $_refuse(askId){
    refuseCrony(askId).then(resp => {
        if(resp.data.code == 24200){
            success(resp.data.message);
            updateUserMessage(askId);
        }else{
            error(resp.data.message);
        }
    })
}

function updateUserMessage(askId){
    console.log(askId);
    store.state.userMessage = store.state.userMessage.filter(user => user.askId != askId);
    console.log(store.state.userMessage)
}
</script>

<style scoped>
.l{
    float:left;
}
.r{
    float:right;
}
</style>