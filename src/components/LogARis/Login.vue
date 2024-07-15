<template>
    <div class="card" h="30" w="30" m="2" :style="{ boxShadow: `var(${getCssVarName(shadow.type)})` }">
        <h1 style="text-align: center;">登录</h1>
        <div class="cardContext">
            <div class="background">
                <el-form class="elf240" v-model="loginUser" .label-width="auto">
                    <el-form-item label="账号">
                        <el-input v-model="loginUser.username" style-width="150px" placeholder="请输入账号" />
                    </el-form-item>
                    <el-form-item class="elit40" v-model="loginUser.password" label="密码">
                        <el-input type="password" v-model="loginUser.password" style-width="240px" placeholder="请输入密码"
                            show-password />
                    </el-form-item>
                    <div class="elit40">
                        <el-button type="primary" style="margin-left: 25px" @click="loginc()">登录</el-button>
                        <el-button style="margin-left: 80px;" @click="j2register()">注册</el-button>
                    </div>
                </el-form>
            </div>
        </div>

    </div>



</template>
<script setup>
import { ref, reactive, computed } from 'vue';
import '../../assets/common.css';
import { useRouter } from 'vue-router';
import { login } from '../../api/user.js';
import { success, info, warning, error } from '../../assets/message.js';
import { useStore } from 'vuex';
import { init } from '../../js/webSocket.js'

    const shadow = reactive({
        name:'Basic Shadow',
        type: ''
    })
    const getCssVarName=(type) => {
        return '--el-box-shadow' + (type? '-' : '') + type;
    }


const store = useStore();

const router = useRouter();

const loginUser = reactive({
    username: '',
    password: ''
})

function loginc() {
    console.log(getJwt())
    login(loginUser).then(resp => {
        console.log(resp.data);
        if (resp.data.code == 24200) {
            success(resp.data.message);
            console.log(resp.data)
            sessionStorage.setItem('jwt', resp.data.data)
            init();
            router.push('/home');
        } else {
            error(resp.data.message);
        }
    })
}

function getJwt() {
    return store.state.jwt;
}

function j2register() {
    router.push("/index/register");
}
</script>

<style scoped>
.elit40 {
    margin-top: 40px;
}

.cardContext {
    margin-left: 30%;
    position: relative;
    top:20%;
}

.card {
    width: 600px;
    height: 400px;
    margin-left: 30%;
    margin-top: 10%;
    background-color: rgba(240, 248, 255,0.5);
}
</style>