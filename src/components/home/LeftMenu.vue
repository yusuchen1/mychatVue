<template>
      <el-menu
        active-text-color="#ffd04b"
        background-color="#545c64"
        class="el-menu-vertical-demo"
        :default-active="computed(() => store.state.nowChatId)"
        text-color="#fff"
        @open="handleOpen"
        @close="handleClose"
        @select="handleSelection"
      >
        <el-sub-menu index="1">
          <template #title>
            <el-icon><chatRound /></el-icon>
            <span>群聊</span>
          </template>
          <el-menu-item v-for="group in leftMenuList.groups" :index="group.id" style="height: 100px">
            <div>
                <el-avatar class="l" @click.stop="openGroupInfo(group.id)" style="width: 50px; height: 50px" :src="group.avatar" fit="cover"/>
                <p class="l" style="font-size: 14px;margin-left:3px;position: relative;top:-10px;left:5px">
                    {{ group.name }}
                </p>
                <p class="l" style="font-size: 10px;width:100%">
                    {{ group.chats == null ?'':group.chats.length == 0?'':group.chats[group.chats.length-1].content }}
                </p>
            </div>
          </el-menu-item>
        </el-sub-menu>
        <el-sub-menu v-for="(conryGroup,index) in leftMenuList.cronyGroups" :index="getIndex(index)">
          <template #title>
            <el-icon><avatar /></el-icon>
            <span>{{conryGroup.groupName}}</span>
          </template>
          <el-menu-item v-for="crony in conryGroup.cronys" :index="getCronyIndex(index,crony)" style="height: 100px">
            <div style="height: 100px">
                <!-- <el-image class="l" style="width: 50px; height: 50%" :src="crony.avatar" /> -->
                <el-avatar @click.stop='openUserInfo(crony.id)' class="l" style="width: 50px; height: 50px" :src="crony.avatar" fit="cover"/>
                <p class="l" style="font-size: 14px;margin-left:3px;position: relative;top:-10px;left:5px">
                    {{ crony.name }}
                </p>
                <p class="l" style="font-size: 10px;width:100%">
                    {{ crony.chats == null ?'':crony.chats[crony.chats.length-1] == null ? '':crony.chats[crony.chats.length-1].content}}
                </p>
            </div>
          </el-menu-item>
        </el-sub-menu>

      </el-menu>

    <DefaultDialog v-if="defaultDialogIndex == 2" :isVisible="isVisible">
        <UserInfo primaryBtText="保存" :primaryBtClick="$_save" />
    </DefaultDialog>

    <SmallDialog v-if="smallDialogIndex == 5" :isVisible="smallDialog">
        <GroupInfo :edit="false" primaryBtText="确定" :primaryBtClick="primaryBtClick"/>
    </SmallDialog>
</template>

<script setup>
import {useStore} from 'vuex';
import {computed,reactive,onMounted} from 'vue'
import { JsGetOtherInfo } from '@/js/user';
import { getGroupInfo } from '@/api/group';
import { error } from '@/assets/message';
import SmallDialog from '../common/SmallDialog.vue';
import GroupInfo from '../groupInfo.vue';


    const isVisible = computed(() => store.state.defaultDialogVisible)
    const smallDialog = computed(() => store.state.smallDialogVisible)
    const defaultDialogIndex = computed(() => store.state.defaultDialogIndex)
    const smallDialogIndex = computed(() => store.state.smallDialogIndex)

    const store = useStore();
    
    let leftMenuList = computed(() => store.state.leftMenuList);
    onMounted(() => {
        console.log("列表:"+leftMenuList)
    })
// 创建好友组id，格式为 'g-好友组在数组中的下标'
    function getIndex(index) {
        return "g-" + index;
    }
// 创建好友id，格式为'g-好友组在数组中的下标-好友的用户id'
    function getCronyIndex(index,crony){
        return "g-" + index + '-' + crony.id;
    }

    function handleOpen(key,keyPath){
        console.log(key,keyPath);
    }
    
    function handleClose(key,keyPath){
        console.log(key,keyPath);
    }

    function handleSelection(key,keyPath){
        store.commit('setRid','')
        store.commit('setGid','')

        console.log(key,keyPath);
        let keys = (key+"").split('-');
        // 如果是人
        if(keys[0] === 'g'){
            let uid = keys[keys.length - 1];
            store.commit('setRid',uid)
        }
        // 群
        else{
            store.commit('setGid',keys[0])
        }
        store.commit('setNowChatId',key)
    }
    function openUserInfo(uid){
        store.commit('setDefaultDialogIndex',2)
        JsGetOtherInfo(uid);
    }

    function openGroupInfo(gid){
        store.commit('setSmallDialogIndex',5)
        console.log(smallDialogIndex)
        getGroupInfo(gid).then(resp => {
            if(resp.data.code == 24200){
                store.commit('setGroupInfo',resp.data.data);
                store.commit('reverseSmallDialogVisible');
            }else{
                error(resp.data.message);
            }
        })
    }

    const primaryBtClick = function(){
        store.commit('reverseSmallDialogVisible');
    }
</script>

<style scoped>
.el-menu{
    height: 100vh;
}
.l{
    float: left;
}
</style>