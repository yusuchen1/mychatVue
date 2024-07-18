<template>
        <el-button class="r" 
        style="margin-right: 10px;margin-top: 10px;width: 45px;height: 45px" 
        @click="EditMoment()"
        type="primary" :icon="Plus" circle plain />
        <div class="context">
            <div class="moment" v-for="moment in moments">
                <el-avatar class="l" style="margin-top:10px;margin-left:5px;" :size="80" :src="moment.avatar" />
                <p style="margin-top:15px;font-size: 20px;">
                    {{ moment.nickname }}
                    <span v-if="moment.me">
                        <el-button class="r" type="danger" @click="openSmallDialog(moment.id)" :icon="Delete" circle/>
                        <el-button class="r" type="primary" @click="$_editMoment(moment.id,moment.content)" :icon="Edit" circle />
                    </span>
                    <span class="r" style="font-size:15px;">
                        {{ formatTime(moment.time) }}
                    </span>
                </p>
                <p>{{ moment.content }}</p> 
                <div style="margin-top:10px;font-size:17px">
                    <p style="font-size: 15px;color: #0881d5;">
                        <br>
                        点赞
                        <el-button @click="$_like(moment.id)" class="r" type="primary" circle>❤</el-button>
                    </p>
                    {{ formatLikeList(moment.likelist) }}
                </div>
                <div style="margin-top:10px">
                    <p style="font-size: 15px;color: #0881d5;">评论</p>
                    <div v-for="comment in moment.comments">

                          <el-popconfirm
                            confirm-button-text="回复"
                            cancel-button-text="删除"
                            @confirm="$_replayComment(moment.id,comment.userId)"
                            @cancel="$_deleteComment(moment.id,comment.id)"
                            hide-icon="true"
                          >

                          
                          <template #reference>
                                <el-button
                                  key="plain"
                                  type=""
                                  link
                                >
                                {{ formatComment(comment) }}
                                </el-button>

                            </template>
                          </el-popconfirm>
                       
                    </div>
                </div>
                <div>
                    <el-input style="width:90%" type="text" v-model="moment.input" />
                    <el-button type="primary" @click="$_addComment(moment.id,moment.input)" style="width: 10%;">发送</el-button>
                </div>
            </div>
        </div>
        <el-dialog
      v-model="smallDialog"
      width="350"
    >
      <h1 style="color: red">警告</h1>
      <span style="font-size:17px">你确定要删除动态吗</span>
      <template #footer>
        <div>
          <el-button type="primary" @click="$_deleteMoment()" >确定</el-button>
          <el-button @click="closeSmallDialog()" >取消</el-button>
        </div>
      </template>
    </el-dialog>
</template>

<script setup>
import { Plus } from '@element-plus/icons-vue'
import { useStore } from 'vuex';
import {reactive,onMounted,computed,ref} from 'vue';
import { Delete, Edit } from '@element-plus/icons-vue'
import {useRouter} from 'vue-router'
import {addComment, deleteComment, deleteMoment, getMoments, likeMoments} from '@/api/moment'
import { error, success, warning } from '@/assets/message';

    const router = useRouter();
    const store = useStore();
    const smallDialog = ref(false);

    const moments = computed(() => store.state.moments)
    onMounted(() => {
        getMoments().then(resp => {
            if(resp.data.code == 24200){
                store.commit("setMoments",resp.data.data)
            }else{
                error(resp.data.mesage);
            }
        })
    })
    
    function formatLikeList(list) {
        if(list == null){
            return;
        }
        if(list.length == 0) {
            return '';
        }
        let str = '';
        for(let i = 0; i < list.length; i++) {
            const like = list[i];
            str += (like.nickname + ",")
        }
        console.log("str = " + str);
        str = str.substring(0,str.length-1) + " 赞了";
        return str;
    }

    function formatComment(comment) {
        if(comment.replayNickname == null || comment.replayNickname == ''){
            return comment.nickname + ": " + comment.content;
        }else{
            return comment.nickname + " 回复 " + comment.replayNickname + ": " + comment.content;
        }
    }

    function EditMoment(){
        store.commit('setEditMoment', reactive({
            id:'',
            content: ''
        }))
        router.push("/moments/edit")
    }

    function $_editMoment(id,content){
        store.commit('setEditMoment', reactive({
            id,
            content
        }))
        router.push("/moments/edit")
    }

    function formatTime(time) {
        let str = "";
        for(let i=0; i < 3; i++){
            let temp = time[i] + "";
            if(temp.length == 1){
                temp = "0"+temp;
            }
            if(i != 2){
                str = str + temp + '-';
            }else{
                str = str + temp;
            }
        }
        str = str + " ";
        for(let i=3; i < 6; i++){
            let temp = time[i] + "";
            if(temp.length == 1){
                temp = "0"+temp;
            }
            if(i != 5){
                str = str + temp + ':';
            }else{
                str = str + temp;
            }
        }
        return str
    }

    const tempMomentId = ref('');

    function openSmallDialog(id){
        tempMomentId.value = id;
        smallDialog.value = !smallDialog.value;
        console.log(tempMomentId.value);
    }

    function closeSmallDialog(){
        smallDialog.value = !smallDialog.value;
    }

    function $_deleteMoment(){
        const id = tempMomentId.value;
        deleteMoment(id).then(resp => {
            if(resp.data.code == 24200){
                success(resp.data.message);
                smallDialog.value = !smallDialog.value;
                store.commit('deleteMomentById',id);
            }else{
                error(resp.data.message);
            }
        })
    }

    function $_like(momentId){
        likeMoments(momentId).then(resp => {
            if(resp.data.code == 24200){
                store.commit('updateMomentsLikList',{
                    momentId,
                    nickname: resp.data.data
                });
            }else{
                error(resp.data.message);
            }
        })
    }

    function $_addComment(id,input){
        if(input == ''){
            warning("不能发送空的消息");
            return;
        }
        const data = {
            replay:'',
            content:input,
            momentsId:id
        }
        if(replayCheck.momentId == id){
            data.replay = replayCheck.userId;
            replayCheck.momentId = '';
            replayCheck.userId = '';
        }
        addComment(data).then(resp => {
            if(resp.data.code == 24200){
                success(resp.data.message);
                store.commit('updateComments',{
                    momentId:id,
                    commentId:resp.data.data.momentDetailsId,
                    userId: resp.data.data.userId,
                    nickname:resp.data.data.nickname,
                    replayNickname:resp.data.data.replayNickname,
                    content:input
                });
            }else{
                error(resp.data.message);
            }
        })
    }

    const replayCheck = reactive({
        momentId:'',
        userId:'',
    })
    const $_replayComment = (momentId,userId) => {
        replayCheck.momentId = momentId;
        replayCheck.userId = userId;
        success("选择成功")
    }
    const $_deleteComment = (momentId,commentId) => {
      deleteComment(commentId).then(resp => {
        if(resp.data.code == 24200){
            success(resp.data.message);
            store.commit('deleteComment',{
                momentId,
                commentId
            })
        }else{
            error(resp.data.message);
        }
      })
    }

</script>

<style scoped>
.context{
    width: 40%;
    height: 100vh;
    background-color: rgba(253, 255, 255, 0.735);
    margin-left: 30%;
    overflow: auto;
}
.moment{
    width: 80%;
    margin-left:10%;
    /* background-color: rgba(126, 252, 252, 0.735); */
    overflow: hidden;
}
.l{
    float:left;
}
.r{
    float:right;
}
</style>