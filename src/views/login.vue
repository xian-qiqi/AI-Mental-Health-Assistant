<template>
    <div class="container">
        <div class="title">
            <div class="back-home">
                <el-icon><Back /></el-icon>
                <span>返回首页</span>
            </div>
            <div class="title-text">
                <h2>登陆您的账户</h2>
                <p>输入您的登录信息</p>
            </div>
        </div>
        <div class="form-container">
            <el-form
                ref="ruleFormRef"
                :model="formDate"
                :rules="rules"
                label-position="top"
            >
                <el-form-item label="用户名或邮箱" prop="username">
                    <el-input v-model="formDate.username" size="large" placeholder="请输入用户名或邮箱"/>
                </el-form-item>
                <el-form-item label="密码" prop="passward">
                    <el-input v-model="formDate.password" size="large" placeholder="请输入密码" type="password" show-password/>
                </el-form-item>
                <el-button class="btn" type="primary" @click="submitForm(ruleFormRef)">登录账户</el-button>
            </el-form>
            <div class="footer">
                <p>还没有账户？<<router-link to="/auth/register">去注册</router-link>></p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { login } from '../api/admin';
import { useRouter } from 'vue-router';
const ruleFormRef = ref()
const formDate = reactive({
    username: '',
    password: ''
})

const rules = reactive({
    username:[
        {required: true, message: '请输入用户名', trigger: 'blur'}
    ],
    password:[
        {required: true, message: '请输入密码', trigger: 'blur'}
    ]
})

//登录时的表单提交
const router = useRouter()
const submitForm = async(formEl) =>{
    console.log(formDate)
    if(!formEl) return
    await formEl.validate((valid,fields)=>{
        if(valid){
            login(formDate).then(data =>{
                //判断token是否存在
                if(!data.token){
                    return console.log('登录失败')
                }
                //登录成功，保存用户和登录信息
                localStorage.setItem('token',data.token)
                localStorage.setItem('userInfo',JSON.stringify(data.userInfo))

                //根据用户角色决定跳转的路径
                if(data.userInfo.userType === 2) {
                    router.push('/back/dashboard')
                }else if(data.userInfo.userType === 1){
                    router.push('/')
                }
            })
        }
    })
}
</script>

<style lang="scss" scoped>
.container{
    width: 384px;
    .title{
        .back-home{
            margin-bottom: 60px;
        }
        .title-text{
            text-align: center;
            h2{
                font-size: 36px;
                margin-bottom: 10px;
            }
            p{
                font-size: 18px;
                color: #6b7580;
            }
        }
    }
    .form-container{
        margin-top: 30px;
        .btn{
            margin-top: 40px;
            width: 100%;
        }
        .footer{
            padding: 30px;
            text-align: center;
        }
    }
}
</style>