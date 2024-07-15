<template>
    <div class="card" h="30" w="30" m="2" :style="{ boxShadow: `var(${getCssVarName(shadow.type)})` }">
        <h1 style="text-align: center;">注册账号</h1>
        <div class="cardContext">
            <div class="background">
                <el-form v-model="registerUser" .label-width="auto" max-width="480px">
                    <el-form-item class="elfi" label="账&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp号">
                        <el-input placeholder="请输入账号" v-model.lazy="registerUser.username" />
                    </el-form-item>
                    <el-form-item class="elfi" label="密&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp码">
                        <el-input type="password" v-model.lazy="registerUser.password" placeholder="请输入密码"
                            show-password />
                    </el-form-item>
                    <el-form-item class="elfi" label="确认密码">
                        <el-input type="password" v-model.lazy="password2" placeholder="请再次输入密码" show-password />
                    </el-form-item>
                    <el-form-item class="elfi" label="昵&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp称">
                        <el-input v-model.lazy="registerUser.nickname" placeholder="请输入昵称" />
                    </el-form-item>
                    <el-form-item class="elfi" label="性&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp别">
                        <el-radio-group v-model="registerUser.sex" class="ml-4">
                            <el-radio value="男" size="large">男</el-radio>
                            <el-radio value="女" size="large">女</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item class="elfi" label="电话号码">
                        <el-input v-model.lazy="registerUser.phone" placeholder="请输入电话号码" />
                    </el-form-item>
                    <div class="elit40">
                        <el-button type="primary" style="margin-left: 60px" @click="registerc()">注册</el-button>
                        <el-button style="margin-left: 80px;" @click="j2login()">返回</el-button>
                    </div>
                </el-form>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, reactive, watch } from 'vue';
import Index from '../index.vue';
import "../../assets/common.css";
import { useRouter } from 'vue-router';
import { register } from '../../api/user.js';
import { success, error } from '../../assets/message.js';

const shadow = reactive({
        name:'Basic Shadow',
        type: ''
    })
    const getCssVarName=(type) => {
        return '--el-box-shadow' + (type? '-' : '') + type;
    }

const password2 = ref('');
const router = useRouter();

const registerUser = reactive({
    nickname: '',
    username: '',
    password: '',
    sex: '男',
    phone: ''
});

// 正则表达式校验
const validateFields = () => {
    const usernameRegex = /^[a-zA-Z0-9]{4,20}$/;
    const passwordRegex = /^.{6,20}$/;
    const nicknameRegex = /^.{2,}$/;
    const phoneRegex = /^\d{11}$/;

    if (!usernameRegex.test(registerUser.username)) {
        error('账号长度必须在4到20位之间，且只能包含字母和数字');
        return false;
    }
    if (!passwordRegex.test(registerUser.password)) {
        error('密码长度必须在6到20位之间');
        return false;
    }
    if (registerUser.password !== password2.value) {
        error('两次输入的密码不一致');
        return false;
    }
    if (!nicknameRegex.test(registerUser.nickname)) {
        error('昵称长度至少为2');
        return false;
    }
    if (!phoneRegex.test(registerUser.phone)) {
        error('电话号码必须为11位数字');
        return false;
    }
    return true;
};

// 监听提交事件
function registerc() {
    if (validateFields()) {
        // 如果校验通过，则执行注册逻辑
        console.log(registerUser);
        register(registerUser).then(resp => {
            console.log(resp.data);
            if (resp.data.code == 24200) {
                success(resp.data.message);
                router.push('/index/login');
            } else {
                error(resp.data.message);
            }
        });
    }
}

function j2login() {
    router.push("/index/login")
}
</script>
<style scoped>
.elfi {
    width: 360px;
}

.cardContext {
    margin-left: 25%;
    position: relative;
    top:10%;
}

.card {
    width: 700px;
    height: 500px;
    margin-left: 28%;
    margin-top: 7%;
    background-color: rgba(240, 248, 255,0.5);
}
</style>