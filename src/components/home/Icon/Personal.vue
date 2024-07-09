<template>
    <div style="margin-left:40px">
        <div class="avatarBlock">
            <el-avatar class="l" :size="100" :src="userInfo.avatar" />
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
              <el-button type="primary" style="height:35px">上传头像</el-button>
            </el-upload>
            <el-button type="" @click="cronyGroupManager()" style="height: 40px;float:right;" plain>好友组管理</el-button>
            <br>
            <br>
            <el-button type="" @click="groupManager()" style="height: 40px;float:right;" plain>群&nbsp;聊&nbsp;管&nbsp;理</el-button>
        </div>
        <div>
            <el-descriptions :title="'用户名 '+userInfo.username" column="2" style="margin-top:30px;">
                <el-descriptions-item label="昵&nbsp&nbsp&nbsp称">
                  <el-input v-model="userInfo.nickname" />
                </el-descriptions-item>
                <el-descriptions-item label="密&nbsp&nbsp&nbsp码">
                    {{ userInfo.password }}
                    <el-button @click="changePassword()" style="margin-left:20px">修改密码</el-button>
                </el-descriptions-item>
                <el-descriptions-item label="签&nbsp&nbsp&nbsp名">
                    <el-input v-model="userInfo.signature" />
                </el-descriptions-item>
                <el-descriptions-item label="性&nbsp&nbsp&nbsp别">
                    <el-radio-group v-model="userInfo.sex" class="ml-4">
                      <el-radio value="男" size="large">男</el-radio>
                      <el-radio value="女" size="large">女</el-radio>
                    </el-radio-group>
                </el-descriptions-item>
                <el-descriptions-item label="地&nbsp&nbsp&nbsp址">
                  <el-input v-model="userInfo.address" />
                </el-descriptions-item>
                <el-descriptions-item label="电&nbsp&nbsp&nbsp话">
                    <el-input v-model="userInfo.phone" />
                </el-descriptions-item>
              </el-descriptions>
        </div>
        <div class="buttonBlock">
            <el-button class='mbt' @click="$_save()" type="primary">保存</el-button>
            <el-button class='mbt' @click="cancel()" style="margin-left:100px">取消</el-button>
        </div>
    </div>

    <SmallDialog v-if="smallDialogIndex == 2" :isVisible="smallDialogVisible">
        <div class="changePasswordBlock">
            <p>旧&nbsp;&nbsp;密&nbsp;&nbsp;码:&nbsp;&nbsp;<el-input type="password" v-model="passwordModel.oldPassword" show-password/></p>
            <p>新&nbsp;&nbsp;密&nbsp;&nbsp;码:&nbsp;&nbsp;<el-input type="password" v-model="passwordModel.newPassword" show-password/></p>
            <p>确定密码:&nbsp;&nbsp;<el-input type="password" v-model="passwordModel.againPassword" show-password/></p>
            <div class="cpBtBlock" style="margin-top: 30px;">
                <el-button type="primary" @click="submitPassword()" style="margin-left:50px">确定</el-button>
                <el-button style="margin-left:90px" @click="store.commit('reverseSmallDialogVisible')">取消</el-button>
            </div>
        </div>
    </SmallDialog>
    
    <SmallDialog v-if="smallDialogIndex == 3" :isVisible="smallDialogVisible">
        <div style="height: 200px;overflow:auto">
            <el-card type="info" v-for="cronyGroup in cronyGroups" style="width: 50%;height: 40px;float:left">
                <div style="margin-top:-10px">
                    <p style="float: left;font-size: 15px;">
                        {{cronyGroup.cronyGroupName}}
                    </p>
                    <el-button type="danger" @click="delGroup(cronyGroup.id,cronyGroup.cronyGroupName)"  style="float:right;margin-top:-5px" :icon="Delete" circle />
                </div>
            </el-card>
        </div>
    </SmallDialog>
    
    <SmallDialogT v-if="smallDialogTIndex == 1" :isVisible="smallDialogTVisible">
        <div style="height: 200px;overflow:auto;">
            <el-card type="info" v-for="group in groups" style="width: 100%;float:left">
                <div style="margin-left:-10px">
                    <el-avatar class="l" :src="group.avatar" :size="90" />
                    <div class="l" style="margin-top: 10px;">
                        <p style="font-size:18px">
                            群昵称:{{ group.name }}
                        </p>
                        <p style="margin-top:20px">
                            群&nbsp;&nbsp;&nbsp;&nbsp;号:{{ group.number }}
                        </p>
                    </div>
                </div>
                <el-button @click="$_edit(group.id)" style="float:right;margin-top:25px;margin-right: -10px;width: 70px;height: 40px;" type="primary" plain>
                    编辑
                </el-button>
            </el-card>
        </div>
    </SmallDialogT>
    <SmallDialog v-if="smallDialogIndex == 6" :isVisible="smallDialogVisible">
        <GroupInfo  primaryBtText="保存" :primaryBtClick="groupInfoSave" :edit="true" />
    </SmallDialog>
</template>

<script setup>
import {useStore} from 'vuex'
import {computed,reactive,ref} from 'vue'
import { ElUpload } from 'element-plus'
import { JsUpdateUserInfo, JsUserUpdatePassword } from '@/js/user';
import SmallDialog from '@/components/common/SmallDialog.vue'
import SmallDialogT from '@/components/common/SmallDialogT.vue'
import { error, success } from '@/assets/message';
import { updatePassword } from '@/api/user';
import { deleteCronyGroup, getAllCronyGroup } from '@/api/crony';
import {Delete} from '@element-plus/icons-vue'
import { getGroupInfo, getGroupsM,updateGroup } from '@/api/group';
import GroupInfo from '@/components/groupInfo.vue';

    const passwordModel = reactive({
        oldPassword:'',
        newPassword:'',
        againPassword:'',
    });
    const jwt = ref(sessionStorage.getItem('jwt'))

    const handleSuccess = (response, file, fileList) => {
      // 上传成功后的回调函数
      // 这里可以处理上传后的逻辑，比如更新用户头像
      console.log(response.data);
      if(response.code == 24200){
          store.commit('updateUserInfoAvatar',response.data)
      }
    }

    const beforeUpload = (file) => {
      // 在这里可以添加文件名修改逻辑，如果需要的话
      return true; // 返回true继续上传
    }
    const store = useStore();
    const userInfo = computed(() => store.state.userInfo);
    const smallDialogIndex = computed(() => store.state.smallDialogIndex);
    const smallDialogVisible = computed(() => store.state.smallDialogVisible);
    
    const smallDialogTIndex = computed(() => store.state.smallDialogTIndex);
    const smallDialogTVisible = computed(() => store.state.smallDialogTVisible);
    
    reactive({
    "id": 3,
    "avatar": "https://sc-canqiong.oss-cn-hangzhou.aliyuncs.com/defaultAvatar.jpg",
    "nickname": "懒大王",
    "signature": null,
    "username": "landawang",
    "password": "********",
    "sex": "女",
    "address": null,
    "phone": "12345678912"
  });

  function cancel(){
    store.commit("reverseDefaultDialogVisible");
  }

  function $_save(){
    const nicknameRegex = /^.{2,}$/;
    const phoneRegex = /^\d{11}$/;
    if(!nicknameRegex.test(userInfo.value.nickname)){
        error("昵称长度至少为2");
        return;
    }
    if(!phoneRegex.test(userInfo.value.phone)){
        error("电话号码为11位整数");
        return;
    }
    JsUpdateUserInfo();
    store.commit("reverseDefaultDialogVisible");
  }

  function changePassword(){
    store.commit('setSmallDialogIndex',2);
    store.commit("reverseSmallDialogVisible");
    console.log(smallDialogIndex)
    console.log(smallDialogVisible)
  }

  function submitPassword(){
    const passwordRegex = /^.{6,20}$/;
    if(!passwordRegex.test(passwordModel.newPassword)){
        error("新密码应在6-20位之间");
        return;
    }
    // 如果用户输入新密码与确认密码不一致则打印该语句
    if(passwordModel.newPassword != passwordModel.againPassword){
        error("两次输入的密码不一致");
        return;
    }
    // 发送修改密码请求
    updatePassword(passwordModel).then(resp => {
        if(resp.data.code == 24200){
            success(resp.data.message);
            // 清空表单数据
            passwordModel.newPassword = '';
            passwordModel.oldPassword = '';
            passwordModel.againPassword = '';
            // 关闭dialog
            store.commit("reverseSmallDialogVisible")
        }else{
            error(resp.data.message);
        }
    })
    console.log(passwordModel)
  }

  let cronyGroups = reactive([]);
  function cronyGroupManager(){
    store.commit('setSmallDialogIndex',3);
    getAllCronyGroup().then(resp => {
        if(resp.data.code == 24200){
            cronyGroups = resp.data.data;
            console.log(cronyGroups)
            store.commit("reverseSmallDialogVisible");
        }else{
            error(resp.data.message)
        }
    })
  }

  function delGroup(gid,cronyGroupName){
    deleteCronyGroup(gid).then(resp => {
        if(resp.data.code == 24200){
            success(resp.data.message);
            store.commit("reverseSmallDialogVisible");
            store.commit('updateLeftMenuDelCronyGroup',cronyGroupName);
        }else{
            error(resp.data.message)
        }
    })
  }

  let groups = reactive([]);

  function groupManager(){
    store.commit('setSmallDialogTIndex', 1);
    getGroupsM().then(resp => {
        if(resp.data.code == 24200){
            groups = resp.data.data;
            store.commit('reverseSmallDialogTVisible');
        }else{
            error(resp.data.message)
        }
    })
  }

  function $_edit(gid){
    store.commit('setSmallDialogIndex', 6);
    getGroupInfo(gid).then(resp => {
            if(resp.data.code == 24200){
                store.commit('setGroupInfo',resp.data.data);
                store.commit('reverseSmallDialogVisible');
            }else{
                error(resp.data.message);
            }
        })
  }

  const groupInfoSave = function(){
    let groupInfo = store.state.groupInfo;
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
    updateGroup(groupInfo).then(resp => {
        if(resp.data.code == 24200){
            success(resp.data.message);
            store.commit('reverseSmallDialogVisible');
        }else{
            error(resp.data.message)
        }
    })
  }
</script>

<style scoped>
.avatarBlock{
    width:100%;
    height: 100px
}
.l{
    float:left;
}
.el-input{
    width:200px
}
.mbt{
    width:100px;
    height:50px
}
.buttonBlock{
    margin-top:40px;
    margin-left:150px
}
.changePasswordBlock{
    margin-left:12%;
}
.changePasswordBlock p{
    margin-top:10px;
}
</style>
