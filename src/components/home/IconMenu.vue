<template>
    <el-image
        class="l"
      style="width: auto; height: 100%"
      src="https://sc-mychat.oss-cn-hangzhou.aliyuncs.com/preview.gif"
      fit="fill"
      />
      <!-- src="/images/preview.gif" -->


    <div class="container" style="margin-top:10px;margin-left: 10px;">
        <el-dropdown class="r" style="width: 50px;margin-left:20px">
        <el-avatar class="r" @click="t2()" style="width: 100px; height: 50px" :src="avatar" fit="cover"/>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="t2()">个人中心</el-dropdown-item>
              <el-dropdown-item @click="j2moments()">朋友圈</el-dropdown-item>
              <el-dropdown-item @click="logOut()">退出登录</el-dropdown-item>
            </el-dropdown-menu> 
          </template>
        </el-dropdown>
        <el-button class="r t" @click="openAdd()" type="primary" size="large" circle >添加</el-button>
        <el-button style="margin-right:10px;" class="r t" @click="$_makeGroup()" type="primary" size="large" circle >建群</el-button>
        <el-button class="r t" @click="openMessage()" type="primary" size="large" circle >消息</el-button>
    </div>


    <!-- <DefaultDialog :isVisable="defaultDialog">
        <AddFrom />
    </DefaultDialog> -->
    
    <DefaultDrawer v-if="defaultDrawerIndex == 3" :darwer="defaultDrawer" direction="rtl" :title="title" :size="size">
        <AddFrom/>
    </DefaultDrawer>
    
    <DefaultDrawer v-if="defaultDrawerIndex == 1" :darwer="defaultDrawer" direction="rtl" :title="title" :size="size">
        <MessageFrom />
    </DefaultDrawer>

    <DefaultDialog v-if="defaultDialogIndex == 3" :isVisible="defaultDialog" title="个人中心">
        <Personal />
    </DefaultDialog>

    <SmallDialog v-if="smallDialogIndex == 4" :isVisible="smallDialog">
        <GroupInfo :edit="true" primaryBtText="确定" :primaryBtClick="primaryBtClick"/>
    </SmallDialog>
</template>

<script setup>
import { ref,computed } from 'vue';
import {useStore} from 'vuex';
import {useRouter} from 'vue-router';
import DefaultDrawer from '../common/DefaultDrawer.vue'
import DefaultDialog from '../common/DefaultDialog.vue'
import SmallDialog from '../common/SmallDialog.vue';
import AddFrom from './Icon/AddFrom.vue'
import MessageFrom from './Icon/MessageFrom.vue'
import { JsGetUserMessage } from '@/js/crony.js';
import Personal from './Icon/Personal.vue'
import { JsGetUserInfo } from '@/js/user';
import GroupInfo from '@/components/groupInfo.vue'
import { makeGroup } from '@/api/group';
import { error, success } from '@/assets/message';


    const store = useStore();
    const router = useRouter();

    // 控制打开抽屉的内容，3为添加好友，1为消息界面
    const defaultDrawerIndex = computed(() => store.state.defaultDrawerIndex);

    // 打开响应式组件标题
    const title = ref('');

    // 打开抽屉的尺寸
    const size = ref('')

    const defaultDialog = computed(() => store.state.defaultDialogVisible);
    const defaultDrawer = computed(() => store.state.defaultDrawerVisible);
    const defaultDialogIndex = computed(() => store.state.defaultDialogIndex)

    const smallDialog = computed(() => store.state.smallDialogVisible)
    const smallDialogIndex = computed(() => store.state.smallDialogIndex)


    const avatar = computed(() => store.state.avatar)

    function t2(){
        store.commit('setDefaultDialogIndex',3);
        // 是否打开默认dialog
        JsGetUserInfo(true);
        console.log("个人中心...");
    }

    function logOut(){
        store.commit('setJwt', '');
        router.push('/index/login');
    }

    // 点击添加打开添加抽屉
    function openAdd(){
        store.commit('setDefaultDrawerIndex', 3)
        size.value = '45%';
        title.value = "添加好友/群组";
        console.log("add")
        store.commit('reverseDefaultDrawerVisible');
        // console.log(defaultDialog.value)
        console.log(defaultDrawer.value)
    }

    // 点击消息按钮打开消息抽屉
    function openMessage(){
        store.commit('setDefaultDrawerIndex', 1)
        size.value = '30%';
        title.value = "消息";
        console.log("message")
        JsGetUserMessage()
        store.commit('reverseDefaultDrawerVisible');
    }

    function $_makeGroup(){
        const groupInfo = store.state.groupInfo;
        groupInfo.avatar = '';
        groupInfo.number = '';
        groupInfo.name = '';
        groupInfo.num = 0;
        groupInfo.makeUid = 0;
        groupInfo.makeUsername = '';
        groupInfo.id = 0;
        store.commit('setSmallDialogIndex',4);
        store.commit('reverseSmallDialogVisible');
    }

    //建群按钮点击效果
    const primaryBtClick = function(){
        const groupInfo = store.state.groupInfo;
        const numberRegex = /^\d{6,20}$/;
        const nameRegex = /^.{2,12}$/;
        if(!numberRegex.test(groupInfo.number)){
            error('群号应为6-20位数字');
            return;
        }
        if(!nameRegex.test(groupInfo.name)){
            error('群名长度应在2-12位之间');
            return;
        }
        if(groupInfo.avatar == ''){
            error('请上传头像');
            return;
        }
        makeGroup(groupInfo).then(resp =>{
            if(resp.data.code == 24200){
                success(resp.data.message);
                store.commit('reverseSmallDialogVisible')
                groupInfo.avatar = '';
                groupInfo.number = '';
                groupInfo.name = '';
                groupInfo.num = 0;
                groupInfo.makeUid = 0;
                groupInfo.makeUsername = '';
                groupInfo.id = 0;
            }else{
                error(resp.data.message);
            }
        });
    }


    function j2moments(){
        router.push("/moments")
    }
</script>
<style scoped>
.r{
    float: right;
}
.t{
    margin-top:5px;
}
.l{
    float: left;
}
</style>