<template>
    <Index marginLeft="20%" marginTop="5%">
        <el-form v-model="registerUser" .label-width="auto" max-width="480px">
            <el-form-item class="elfi" label="账&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp号">
                <el-input placeholder="请输入账号" v-model.lazy="registerUser.username"/>
            </el-form-item>
            <el-form-item class="elfi" label="密&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp码">
                <el-input type="password" v-model.lazy="registerUser.password" placeholder="请输入密码" show-password/>
            </el-form-item>
            <el-form-item class="elfi" label="确认密码">
                <el-input type="password" v-model.lazy="password2" placeholder="请再次输入密码" show-password/>
            </el-form-item>
            <el-form-item class="elfi" label="昵&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp称">
                <el-input v-model.lazy="registerUser.nickname" placeholder="请输入昵称"/>
            </el-form-item>
            <el-form-item class="elfi" label="性&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp别">
                <el-radio-group v-model="registerUser.sex" class="ml-4">
                    <el-radio value="男" size="large">男</el-radio>
                    <el-radio value="女" size="large">女</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item class="elfi" label="电话号码">
                <el-input v-model.lazy="registerUser.phone" placeholder="请输入电话号码"/>
            </el-form-item>
            <div class="elit40">
                <el-button type="primary" style="margin-left: 60px" @click="registerc()">注册</el-button>
                <el-button style="margin-left: 80px;" @click="j2login()">返回</el-button>
            </div>
        </el-form>
    </Index>
</template>
<script setup>
import {ref,reactive} from 'vue'
import Index from '../index.vue'
import "../../assets/common.css"
import {useRouter} from 'vue-router'
import {register} from '../../api/user.js'
import {success,error} from '../../assets/message.js'

    const password2 = ref('');
    const router = useRouter();

    const registerUser = reactive({
        nickname:'',
        username:'',
        password:'',
        sex:'男',
        phone:''
    });

    function registerc(){
        // console.log(registerUser.nickname);
        // console.log(registerUser.username);
        // console.log(registerUser.password);
        // console.log(password2);
        // console.log(registerUser.sex);
        // console.log(registerUser.phone);
        console.log(registerUser);
        register(registerUser).then(resp => {
            console.log(resp.data);
            if(reso.data.code == 24200){
                success(resp.data.message);
                router.push('/login')
            }else{
                error(resp.data.message)
            }
        })
    }

    function j2login(){
        router.push("/login")
    }
</script>
<style scoped>
.elfi{
    width:360px;
}
</style>