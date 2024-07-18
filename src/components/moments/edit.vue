<template>
    <div class="container">
        <h1 style="text-align: center">动态编辑</h1>
        <textarea v-model="editMoment.content" class="input" placeholder="输入文字..."></textarea>
        <p style="text-align: center">
            <el-button @click="$_reset()">重置</el-button>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <el-button type="primary" @click="$_addOrEditMoment()">保存</el-button>
        </p>
    </div>
</template>

<script setup>
import { addOrEditMoment } from '@/api/moment';
import { error,success, warning } from '@/assets/message';
import {computed, ref} from 'vue';
import {useStore} from 'vuex';
import {useRouter} from 'vue-router'
    const store = useStore();
    const router = useRouter();
    const editMoment = computed(() => store.state.editMoment);
    function $_addOrEditMoment(){
        if(editMoment.value.content == ''){
            warning('您还没有输入内容');
            return;
        }
        addOrEditMoment(editMoment.value).then(resp => {
            if(resp.data.code == 24200){
                success(resp.data.message);
                router.push("/moments/show")
            }else{
                error(resp.data.message);
            }
        })
    }

    function $_reset(){
        store.state.editMoment.content = '';
    }
</script>

<style scoped>
.container{
    margin-left: 20%;
    position: relative;
    top: 15vh;
    height: 70vh;
    width: 60%;
    background-color: rgba(175, 188, 255, 0.436);
}
.l{
    float:left
}
.input {
    width: 90%;
    height: 80%;
    margin-left: 5%;
    resize: none;
    background-color: rgba(255, 255, 255, 0.5);
    border: 1px solid #ccc;
    border-radius: 10px;
    padding: 10px;
    font-size: 16px;
    outline: none;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>