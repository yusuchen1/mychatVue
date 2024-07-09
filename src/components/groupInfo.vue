<template>
    <div style="overflow: hidden;">
        <div class="avatarBlock" style="width: 100%;">
                <el-avatar class="l" :size="100" :src="groupInfo.avatar" />
                <el-upload
                  class="avatar-uploader l"
                  action="/api/user/uploadAvatar"
                  :headers="{'token':jwt}"
                  :show-file-list="false"
                  :on-success="handleSuccess"
                  :auto-upload="true"
                  :before-upload="beforeUpload"
                  style="margin-top:35px;margin-left:25px"
                >
                  <el-button v-if="props.edit" type="primary" style="height:35px">上传头像</el-button>
                </el-upload>
                <span class="r">群聊人数:{{ groupInfo.num }}</span>
                <br></br>
                <el-button class="r"
                @click="smVisible = !smVisible" 
                v-if="!props.edit" 
                type="danger" 
                style="font-size: 15px;width: 70px;margin-top: 10px">退出本群</el-button>


                <el-button class="r"
                @click="SeeMember(groupInfo.id)" 
                type="" 
                style="font-size: 15px;width: 70px;margin-top: 10px">成员信息</el-button>


        </div>
        <div class='l' style="margin-top:20px;width: 100%;">
            <el-descriptions :column="2" :title="'群主:'+groupInfo.makeUsername">
                <el-descriptions-item label="群&nbsp;&nbsp;&nbsp;&nbsp;号：">
                    <el-input v-if="props.edit" v-model="groupInfo.number" />
                    <span v-else>{{ groupInfo.number }}</span>
                </el-descriptions-item>
                
                <el-descriptions-item label="群昵称:">
                    <el-input v-if="props.edit" v-model="groupInfo.name"/>
                    <span v-else>{{ groupInfo.name }}</span>
                </el-descriptions-item>
            </el-descriptions>    
        </div>
        <div class="btBlock" style="">
            <el-button v-if="props.edit && props.primaryBtText == '保存'" type="danger" @click="sm2Visible = !sm2Visible">解散群聊</el-button>
            <el-button type="primary" @click="props.primaryBtClick" >{{ props.primaryBtText }}</el-button>
            <el-button v-if="props.edit" @click="store.commit('reverseSmallDialogVisible')" >取消</el-button>
        </div>
    </div>

    <el-dialog
      v-model="smVisible"
      width="350"
    >
      <h1 style="color: red">警告</h1>
      <span style="font-size:17px">确定退出群聊吗。</span>
      <template #footer>
        <div>
          <el-button type="primary" @click="$_exitGroup(groupInfo.id)" size="45%">确定</el-button>
          <el-button @click="smVisible = !smVisible" >取消</el-button>
        </div>
      </template>
    </el-dialog>
    
    <el-dialog
      v-model="sm2Visible"
      width="350"
    >
      <h1 style="color: red">警告</h1>
      <span style="font-size:17px">确定解散群聊吗。</span>
      <template #footer>
        <div>
          <el-button type="primary" @click="$_dissGroup(groupInfo.id)" size="45%">确定</el-button>
          <el-button @click="sm2Visible = !sm2Visible" >取消</el-button>
        </div>
      </template>
    </el-dialog>

    <DefaultDrawer v-if="defaultDrawerIndex == 2" :darwer="defaultDrawer" direction="rtl" :title="groupInfo.name" size="45%">
        <GroupMember />
    </DefaultDrawer>
</template>

<script setup>
import { exitGroup,dissGroup } from '@/api/group';
import { error, success } from '@/assets/message';
import {defineProps,reactive,computed,ref} from 'vue';
import {useStore} from 'vuex';
import GroupMember from '@/components/home/GroupMember.vue'
import DefaultDrawer from './common/DefaultDrawer.vue';
import { getGroupMember } from '@/api/crony';

    const store = useStore();

    const props = defineProps(['edit','primaryBtText','primaryBtClick']) 
    const jwt = sessionStorage.getItem('jwt');
    const smVisible = ref(false);
    const sm2Visible = ref(false);
    const defaultDrawerIndex = computed(() => store.state.defaultDrawerIndex)
    const defaultDrawer = computed(() => store.state.defaultDrawerVisible);


    const handleSuccess = (response, file, fileList) => {
      // 上传成功后的回调函数
      // 这里可以处理上传后的逻辑，比如更新用户头像
      console.log(response.data);
      if(response.code == 24200){
          store.state.groupInfo.avatar = response.data;
      }
    }

    const beforeUpload = (file) => {
      // 在这里可以添加文件名修改逻辑，如果需要的话
      return true; // 返回true继续上传
    }

    

    const groupInfo = computed(() => store.state.groupInfo);
    
    reactive({
        avatar:'',
        number:'88888888',
        name:'青龙山疗养院',
        makeUsername:'suchen'
    })

    function $_exitGroup(gid){
        exitGroup(gid).then(resp => {
            if(resp.data.code == 24200){
                success(resp.data.message)
                store.commit('updateLeftMenuDelGroup',gid);
                smVisible.value = !smVisible.value;
                store.commit('reverseSmallDialogVisible');
            }else{
                error(resp.data.message)
            }
        })
    }

    function SeeMember(gid){
        if(gid == null || gid == ''){
            error("该群还没有成员哦");
            return;
        }
        store.commit('setDefaultDrawerIndex',2);
        getGroupMember(gid).then(resp => {
            if(resp.data.code == 24200){
                store.state.groupMembers = resp.data.data;
                store.commit('reverseDefaultDrawerVisible')
            }else{
                error(resp.data.message)
            }
        })
    }

    function $_dissGroup(gid){
        dissGroup(gid).then(resp => {
            if(resp.data.code == 24200){
                success(resp.data.message);
                store.commit('updateLeftMenuDelGroup',gid);
                sm2Visible.value = !sm2Visible.value;
                store.commit('reverseSmallDialogVisible');
            }else{
                error(resp.data.message);
            }
        })
    }
</script>

<style scoped>
.l{
    float:left;
}
.r{
    float:right;
}
.el-input{
    width: 100px;
}
.btBlock{
    float:right;
}
</style>