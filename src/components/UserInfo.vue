<template>
    <div>
        <el-avatar :src="otherInfo.avatar" style="width: 200px;height: 200px;margin-left:35%;"/>
        <el-button type="danger" v-if="otherInfo.crony" @click="smVisible = !smVisible" style="float:right;margin-top:15px">删除好友</el-button>
          <el-descriptions style="margin-left:15%;margin-top:20px" :column="2">
            <el-descriptions-item label="用户名：">{{ otherInfo.username }}</el-descriptions-item>
            <el-descriptions-item label="昵&nbsp&nbsp&nbsp&nbsp称：">{{ otherInfo.nickname }}</el-descriptions-item>
            <el-descriptions-item label="性&nbsp&nbsp&nbsp&nbsp别：">{{ otherInfo.sex }}</el-descriptions-item>
            <el-descriptions-item label="签&nbsp&nbsp&nbsp&nbsp名：">{{ otherInfo.signature }}</el-descriptions-item>
            <el-descriptions-item label="电&nbsp&nbsp&nbsp&nbsp话：">{{ otherInfo.phone }}</el-descriptions-item>
            <el-descriptions-item label="地&nbsp&nbsp&nbsp&nbsp区：">{{ otherInfo.address }}</el-descriptions-item>
            <el-descriptions-item label="备&nbsp&nbsp&nbsp&nbsp注："><el-input style="width: 25%;" v-model="otherInfo.description" /></el-descriptions-item>
            <el-descriptions-item label="分&nbsp&nbsp&nbsp&nbsp组：
            ">
                <el-dropdown  @command="handleCommand" trigger="click">
                    <el-button>
                        {{ selectionGroupName }}<el-icon class="el-icon--right"><arrow-down /></el-icon>
                    </el-button>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item v-for="cronyGroup in otherInfo.cronyGroupVOS" :command="cronyGroup.cronyGroupId">{{ cronyGroup.crongGroupName }}</el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>

                <el-button type="primary" @click="addGroup()" style="margin-left:5px">新增</el-button>
            </el-descriptions-item>
          </el-descriptions>
          <div style="margin-top:40px">
            <el-button type="primary" v-if="props.custom" @click="props.primaryBtClick" style="margin-left:28%;width:100px;height: 50px;">{{ props.primaryBtText }}</el-button>
            <el-button type="primary" v-else-if="otherInfo.crony" @click="$_save()" style="margin-left:28%;width:100px;height: 50px;">保存</el-button>
            <el-button type="primary" v-else @click="JsCronyAdd" style="margin-left:28%;width:100px;height: 50px;">添加</el-button>
            <el-button type="" style="margin-left:15%;width:100px;height: 50px;" @click="cancel()">取消</el-button>
          </div>
    </div>

    <SmallDialog v-if="smallDialogIndex == 1" :isVisible="isVisibel">
        <span>分组名:<el-input v-model.lazy="groupInput" /></span>
        <el-button type="primary" @click="groupSubmit()">添加</el-button>
    </SmallDialog>

    <el-dialog
      v-model="smVisible"
      width="350"
    >
      <h1 style="color: red">警告</h1>
      <span style="font-size:17px">确定删除好友吗，删除好友不会删除聊天记录。</span>
      <template #footer>
        <div>
          <el-button type="primary" @click="$_dropCrony()" >确定</el-button>
          <el-button @click="smVisible = !smVisible" >取消</el-button>
        </div>
      </template>
    </el-dialog>
</template>

<script setup>
import {ref,reactive,computed,defineProps} from 'vue';
import { ArrowDown } from '@element-plus/icons-vue';
import {useStore} from 'vuex';
import SmallDialog from '@/components/common/SmallDialog.vue';
import {addCronyGroup, agreeCrony} from '@/api/crony.js'
import {getLeftMenu} from '@/api/home.js'
import {success,error} from '@/assets/message.js'
import { dropCrony } from '@/api/crony.js';
import {JsCronyAdd, JsUpdataCronyInfo} from '@/js/crony.js'

    const props = defineProps(['primaryBtText','primaryBtClick','custom'])
    const store = useStore();

    const smVisible = ref(false);
    const otherInfo = computed({
        get(){
            return store.state.otherInfo;
        }
    })

    const groupInput = ref('');

    const isVisibel = computed(() => store.state.smallDialogVisible);

    const smallDialogIndex = computed(() => store.state.smallDialogIndex);
    
      const selectionGroupName = computed(() => {
        const cronyGroupVOS = otherInfo.value.cronyGroupVOS;
        for(let i=0;i<cronyGroupVOS.length;i++){
            if(cronyGroupVOS[i].cronyGroupId == otherInfo.value.cronyGroupId){
                return cronyGroupVOS[i].crongGroupName;
            }
        }
      })

      const handleCommand = function(index){
        console.log(index)
        store.commit('updateOtherInfoCronyGroupId',index);
      }

      function cancel(){
        store.commit("reverseDefaultDialogVisible");
      }

      function addGroup(){
        store.commit('setSmallDialogIndex',1)
        console.log(smallDialogIndex)
        store.commit('reverseSmallDialogVisible')
      }

      function groupSubmit(){
        addCronyGroup(groupInput.value).then(resp => {
            if(resp.data.code == 24200){
                success(resp.data.message);
                console.log(resp.data.data)
                store.commit('updateOtherInfoCronyGroupVOS',resp.data.data);
                groupInput.value = '';
                // 添加分组成功，刷新左菜单
                getLeftMenu().then((resp) => {
                    if(resp.data.code == 24200){
                        store.commit('setLeftMenuList', resp.data.data)
                        store.commit('reverseSmallDialogVisible');
                    }else{
                        error(resp.data.message)
                    }
                })
            }else{
                error(resp.data.message);
            }
        })
      }

      function $_dropCrony(){
        const id = otherInfo.value.id;
        dropCrony(id).then((resp) => {
          if(resp.data.code == 24200){
            success(resp.data.message)
            store.commit('updateLeftMenuDelCrony',id)
            smVisible.value = !smVisible.value;
            store.commit("reverseDefaultDialogVisible");
          }else{
            error(resp.data.message)
          }
        })
      }

      function $_save(){
        JsUpdataCronyInfo()
        store.commit("reverseDefaultDialogVisible")
    }
</script>

<style scoped>
.example-showcase .el-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
}
</style>