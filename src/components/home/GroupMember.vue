<template>
    <!-- <div>
        <el-input v-model.lazy="searchUserDTO.input" style="width: 240px" :placeholder="placeholder" />
        <el-button @click="search()" :icon="Search" circle />
    </div> -->
    <div>
        <el-card style="width: 100%; height:120px;margin-top:10px" v-for="user in userList" :key="user.id" shadow="hover">
            <el-avatar class="l" :src="user.avatar" style="width: 100px;height: 100px;"/>
            <p class="l" style="font-size:30px;margin-left:40px">{{ user.nickname }}</p>
            <div>
                <el-button v-if="!user.crony" @click="$_add(user.id)" type="primary" style="width:100px;height:50px;float:right;margin-top:20px;">
                    添加
                </el-button>
                
                <el-button v-else type="success" @click="cronyChat(user.id)" style="width:100px;height:50px;float:right;margin-top:20px;">
                    聊天
                </el-button>
            </div>
            <p class="l" style="font-size:20px;margin-left:40px;width: 60%;">
                <span>账号: </span>{{ user.username }} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <span style="font-size: 15px;">签名: {{ user.signature }}</span>
            </p>
        </el-card>
    </div>
    <DefaultDialog v-if="defaultDialogIndex == 1" :isVisible="defaultDialog" title="添加好友/群聊">
        <UserInfo/>
    </DefaultDialog>
</template>
<script setup>
import { Search } from '@element-plus/icons-vue';
import { reactive,ref,computed } from 'vue';
import {searchUser} from '../../api/user.js';
import UserInfo from '@/components/UserInfo.vue';
import DefaultDialog from '@/components/common/DefaultDialog.vue';
import {useStore} from 'vuex'
import {error, success} from '../../assets/message.js'
import {JsGetOtherInfo} from '@/js/user.js'
import { joinGroup, searchGroup } from '@/api/group.js';

    const store = useStore();
    const defaultDialog = computed(() => store.state.defaultDialogVisible)
    const defaultDialogIndex = computed(() => store.state.defaultDialogIndex);

    var total = reactive(0)
    var userList = computed(() => store.state.groupMembers)
    var groupList = reactive([])
    let temp;
    function search(){
        temp = searchUserDTO.input;
        searchUser(temp, searchUserDTO.page, searchUserDTO.size).then(resp => {
            if(resp.data.code == 24200){
                // 直接修改userList的值
                userList.splice(0, userList.length, ...resp.data.data.data);
                total[0] = resp.data.data.total;
                console.log(userList);
            }else{
                error(resp.data.message);
            }
        });
    }

    function handleCurrentChange(){
        console.log(searchUserDTO.page);
        searchGroupMember(temp,searchUserDTO.page,searchUserDTO.size).then(resp => {
            // 直接修改userList的值
            userList.splice(0, userList.length, ...resp.data.data.data);
            total.value = resp.data.data.total;
        });
    }

    function $_add(uid){
        JsGetOtherInfo(uid)
        store.commit("setDefaultDialogIndex",1);
    }

    function cronyChat(uid){
        store.commit('j2CronyChat',uid);
        store.commit('reverseDefaultDrawerVisible')
    }

    function groupChat(gid){
        store.commit('j2GroupChat',gid);
        store.commit('reverseDefaultDrawerVisible')
    }

    const placeholder = ref('昵称/账号')

    function $_gAdd(gid){
        joinGroup(gid).then(resp => {
            if(resp.data.code == 24200){
                success(resp.data.message);
                store.state.leftMenuList.groups.push(resp.data.data)
            }else{
                error(resp.data.message);
            }
        })
    }

    const primaryBtText = ref('添加');
</script>

<style scoped>
.l{
    float: left;
}
</style>