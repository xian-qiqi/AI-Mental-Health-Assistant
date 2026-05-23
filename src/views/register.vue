<template>
    <div class="container">
        <div class="title">
            <div class="title-text">
                <h2>创建您的账户</h2>
                <p>请填写注册信息</p>
            </div>
            <div class="form-container">
                <el-form :model="formData" :rules="rules" ref="submitFormRef" label-position="top">
                    <el-form-item label="用户名或邮箱" prop="username">
                        <el-input v-model="formData.username" placeholder="请输入用户名" size="large"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="formData.email" placeholder="请输入邮箱" size="large"></el-input>
                    </el-form-item>
                    <el-form-item label="昵称" prop="nickname">
                        <el-input v-model="formData.nickname" placeholder="请输入昵称(可选)" size="large"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号" prop="phone">
                        <el-input v-model="formData.phone" placeholder="请输入手机号" size="large"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input v-model="formData.password" placeholder="请输入密码" size="large" type="password" show-password></el-input>
                    </el-form-item>
                    <el-form-item label="确认密码" prop="confirmPassword">
                        <el-input v-model="formData.confirmPassword" placeholder="请确认密码" size="large" type="password" show-password></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button class="btn" type="primary" size="large" @click="submitForm(submitFormRef)">注册</el-button>
                    </el-form-item>
                </el-form>
                <div class="back-to-login">
                    <span class="login-text">已有账户？</span>
                    <router-link to="/auth/login" class="login-link">立即登录</router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { number } from 'echarts';
import { ref, reactive } from 'vue'
import { register } from '../api/fronted';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router'

const formData = reactive({
    "username": "",
    "email": "",
    "nickname": "",
    "phone": "",
    "password": "",
    "confirmPassword": "",
    "gender": 0,
    "userType": 1 //1为普通用户，2为管理员
})

const rules = reactive({
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' }
    ],
    email: [
        { required: true, message: '请输入邮箱', trigger: 'blur' },
        { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
    ],
    confirmPassword: [
        { required: true, message: '请确认密码', trigger: 'blur' },
    ]
})
//表单提交 ， ---获取到formData中的数据，进行注册逻辑处理

const router = useRouter()
const submitFormRef = ref(null)
const submitForm = async (formEl) => {
    if (!formEl) return
    formEl.validate(async (valid, fields) => {
        register(formData).then(({ data }) => {
            if(!data){
                ElMessage.success('注册成功！')
                router.push('/auth/login')
            }   
            if(data.code === "BUSINESS_ERROR"){
                ElMessage.error(data.message)
            }
        })
    })
}
</script>

<style lang="scss" scoped>
.container {
    width: 384px;
    max-width: 100%;
    padding: 20px;

    .flex-box {
        display: flex;
        align-items: center;
    }

    .title {
        .title-text {
            text-align: center;

            h2 {
                font-size: 36px;
                margin-bottom: 10px;
                color: #1f2937;
                
                @media (max-width: 768px) {
                    font-size: 28px;
                }
                
                @media (max-width: 480px) {
                    font-size: 24px;
                }
            }

            p {
                font-size: 18px;
                color: #6b7280;
                
                @media (max-width: 768px) {
                    font-size: 16px;
                }
                
                @media (max-width: 480px) {
                    font-size: 14px;
                }
            }
        }
    }

    .form-container {
        margin-top: 30px;

        .btn {
            margin-top: 40px;
            width: 100%;
            min-height: 48px;
            font-size: 16px;
            border-radius: 8px;
            
            @media (max-width: 768px) {
                margin-top: 30px;
                font-size: 15px;
            }
            
            @media (max-width: 480px) {
                margin-top: 25px;
                font-size: 14px;
                min-height: 44px;
            }
        }
        
        .back-to-login {
            margin-top: 25px;
            text-align: center;
            padding: 15px 0;
            
            @media (max-width: 768px) {
                margin-top: 20px;
                padding: 12px 0;
            }
            
            @media (max-width: 480px) {
                margin-top: 15px;
                padding: 10px 0;
            }
            
            .login-text {
                color: #6b7280;
                font-size: 14px;
                margin-right: 5px;
                
                @media (max-width: 768px) {
                    font-size: 13px;
                }
                
                @media (max-width: 480px) {
                    font-size: 12px;
                }
            }
            
            .login-link {
                color: #4A90E2;
                font-size: 14px;
                font-weight: 500;
                text-decoration: none;
                transition: all 0.3s ease;
                border-bottom: 1px solid transparent;
                
                &:hover {
                    color: #357ABD;
                    border-bottom-color: #357ABD;
                }
                
                &:active {
                    color: #2A5F8F;
                }
                
                @media (max-width: 768px) {
                    font-size: 13px;
                }
                
                @media (max-width: 480px) {
                    font-size: 12px;
                }
            }
        }

        .footer {
            padding: 30px;
            text-align: center;
        }
    }
}

// 响应式容器
@media (max-width: 768px) {
    .container {
        width: 100%;
        max-width: 400px;
        padding: 15px;
    }
}

@media (max-width: 480px) {
    .container {
        width: 100%;
        padding: 10px;
    }
}
</style>