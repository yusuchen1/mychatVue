<template>
    <div>
        <el-input v-model.lazy="searchUserDTO.input" style="width: 240px" :placeholder="placeholder" />
        <el-button @click="search()" :icon="Search" circle />
        <el-button style="float: right;" type="primary" @click="$_switch()" circle>切换</el-button>
    </div>
    <div>
        <el-card v-if="pageSelector == 0" style="width: 100%; height:120px;margin-top:10px" v-for="user in userList" :key="user.id" shadow="hover">
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
        <el-card v-if="pageSelector == 1" style="width: 100%; height:120px;margin-top:10px" v-for="group in groupList" :key="group.id" shadow="hover">
            <el-avatar class="l" :src="group.avatar" style="width: 100px;height: 100px;"/>
            <p class="l" style="font-size:30px;margin-left:40px">{{ group.name }}</p>
            <div>
                <el-button v-if="!group.include" @click="$_gAdd(group.id)" type="primary" style="width:100px;height:50px;float:right;margin-top:20px;">
                    添加
                </el-button>
                
                <el-button v-else type="success" @click="groupChat(group.id)" style="width:100px;height:50px;float:right;margin-top:20px;">
                    聊天
                </el-button>
            </div>
            <p class="l" style="font-size:20px;margin-left:40px;width: 60%;">
                <span>群号: </span>{{ group.number }} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </p>
        </el-card>
        <p style="margin-left:260px;margin-top:20px" v-if="userList.length != 0">
            <el-pagination
              small
              background
              layout="prev, pager, next"
              v-model:page-size="searchUserDTO.size"
              v-model:current-page="searchUserDTO.page"
              @current-change="handleCurrentChange"
              :total="total[pageSelector]"
              class="mt-4"
            />
        </p>
    </div>
    <DefaultDialog v-if="defaultDialogIndex == 1" :isVisible="defaultDialog" title="添加好友/群聊">
        <UserInfo/>
    </DefaultDialog>
</template>
<script setup>
import { Search } from '@element-plus/icons-vue';
import { reactive,ref,computed } from 'vue';
import {searchUser} from '../../../api/user.js';
import UserInfo from '@/components/UserInfo.vue';
import DefaultDialog from '../../common/DefaultDialog.vue';
import {useStore} from 'vuex'
import {error, success} from '../../../assets/message.js'
import {JsGetOtherInfo} from '@/js/user.js'
import { joinGroup, searchGroup } from '@/api/group.js';

    const store = useStore();
    const defaultDialog = computed(() => store.state.defaultDialogVisible)
    const defaultDialogIndex = computed(() => store.state.defaultDialogIndex);
    const searchUserDTO = reactive({
        input:'',
        page:1,
        size:5
    })
    var total = reactive([0,0])
    var userList = reactive([])
    var groupList = reactive([])
    let temp;
    function search(){
        temp = searchUserDTO.input;
        if(pageSelector.value == 0){
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
        }else{
            // 查询群聊
            searchGroup(temp, searchUserDTO.page, searchUserDTO.size).then(resp => {
                if(resp.data.code == 24200){
                    groupList.splice(0, groupList.length, ...resp.data.data.data);
                    total[1] = resp.data.data.total;
                    console.log(groupList);
                }else{
                    error(resp.data.message);
                }
            })
        }
    }

    function handleCurrentChange(){
        console.log(searchUserDTO.page);
        searchUser(temp,searchUserDTO.page,searchUserDTO.size).then(resp => {
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

    const pageSelector = ref(0)
    const placeholder = ref('昵称/账号')

    function $_switch() {
        pageSelector.value = (pageSelector.value + 1) %2
        if(pageSelector.value == 0){
            placeholder.value = '昵称/账号';
        }else{
            placeholder.value = '群昵称/群号';
        }
    }

    function $_gAdd(gid){
        joinGroup(gid).then(resp => {
            if(resp.data.code == 24200){
                success(resp.data.message);
                store.state.leftMenuList.groups.push(resp.data.data)
                groupList = groupList.filter(group => {
                    if(group.id == gid){
                        group.include = true;
                    }
                })
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