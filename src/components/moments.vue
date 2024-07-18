<template>
    <div class="contains">
        <div>
            <el-button @click="lastStep()" type="primary" style="margin-left: 20px;margin-top: 10px;float: left">返回</el-button>
        </div>
        <router-view></router-view>
    </div>
</template>

<script setup>
import {ref,computed} from 'vue';
import {useStore} from 'vuex'
import {useRouter} from 'vue-router';

    const router = useRouter();
    const store = useStore();
    const flag = computed(() => store.state.momentFlag);
    function lastStep(){
        const pathname = window.location.pathname;
        if(pathname == "/moments/show"){
            router.push("/home")
        }else if(pathname == "/moments/edit"){
            router.push("/moments/show");
        }
        console.log(pathname);
    }
</script>

<style scoped>
.contains{
    background-image: url("https://sc-mychat.oss-cn-hangzhou.aliyuncs.com/moments-background.jpg");
    /* background-image: url("/images/moments-background.jpg"); */
    background-repeat: no-repeat;
    background-size:100% 100%;
    width: 100%;
    height: 100vh;
}
</style>