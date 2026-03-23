<template>
    <div class="frontend-layout">
        <div class="navbar-container">
            <div class="brand-section">
                <el-image style="width: 50px; height: 50px;" :src="iconUrl" class="brand-logo"></el-image>
                <div class="brand-name">心理健康AI助手</div>
            </div>
            <div class="nav-section">
                <router-link to="/" class="nav-link">首页</router-link>
                <router-link to="/consulation" class="nav-link" v-if="isLogoutIn">AI咨询</router-link>
                <router-link to="/emotion-diary" class="nav-link" v-if="isLogoutIn">情绪日志</router-link>
                <router-link to="/knowledge" class="nav-link">知识库</router-link>
                <el-button class="logout-btn" size="medium" v-if="isLogoutIn" @click="handleLogout">退出登录</el-button>
                <template v-else>
                    <router-link to="/auth/login" class="nav-link">登录</router-link>
                    <router-link to="/auth/register" class="nav-link">注册</router-link>
                </template>
            </div>
        </div>
        <div class="main-container">
            <router-view></router-view>
        </div>
        <div class="footer-container">
            <div class="footer-bottom">
                <p>&copy; 2023 心理健康AI助手. All rights reserved.</p>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, reactive, onMounted } from 'vue';
import { logout } from '../api/admin';
import { useRouter } from 'vue-router';
const iconUrl = new URL('../assets/images/机器人.png',import.meta.url).href
const router = useRouter();

//登出
const handleLogout = () => {
    logout().then(() =>{
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo');
        // isLogoutIn.value = false;可以不写，因为根据有无token来定义true和false
        isLogoutIn.value = false //好像得写，不然无法立即更新页面。必须自己刷新浏览器才能更新isLogoutIn的值
        router.push('/')
    })
    
}
const isLogoutIn = ref(false);
onMounted(() => {
    isLogoutIn.value = localStorage.getItem('token') !== null;
})
</script>

<style lang="scss" scoped>
.frontend-layout {
    background-color: #fff;

    .navbar-container {
        max-width: 1200px;
        height: 100%;
        margin: 0 auto;
        padding: 10px;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .brand-section {
            display: flex;
            align-items: center;

            .brand-name {
                margin-left: 10px;
                font-size: 24px;
                font-weight: 600;
                color: #333;
            }
        }

        .nav-section {
            display: flex;
            align-items: center;
            gap: 40px;

            .nav-link {
                color: #4b5563;
                font-size: 16px;
                font-weight: 500;

                &:hover {
                    color: #4A90E2;
                }
            }
        }
    }

    .footer-container {
        background: #1f2937;
        color: white;
        padding: 15px 0;
        margin-top: auto;

        .footer-bottom {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 10px;
            text-align: center;
        }
    }
}
</style>