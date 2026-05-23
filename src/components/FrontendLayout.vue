<template>
    <div class="frontend-layout">
        <div class="navbar-container">
            <div class="brand-section">
                <el-image style="width: 50px; height: 50px;" :src="iconUrl" class="brand-logo"></el-image>
                <div class="brand-name">心理健康AI助手</div>
            </div>
            
            <!-- 桌面端导航 -->
            <div class="nav-section desktop-nav">
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
            
            <!-- 移动端汉堡菜单按钮 -->
            <div class="mobile-menu-btn" @click="toggleMobileMenu">
                <el-icon :size="24"><Menu /></el-icon>
            </div>
        </div>
        
        <!-- 移动端菜单 -->
        <div class="mobile-menu" :class="{'active': mobileMenuOpen}">
            <div class="mobile-menu-content">
                <router-link to="/" class="mobile-nav-link" @click="closeMobileMenu">首页</router-link>
                <router-link to="/consulation" class="mobile-nav-link" v-if="isLogoutIn" @click="closeMobileMenu">AI咨询</router-link>
                <router-link to="/emotion-diary" class="mobile-nav-link" v-if="isLogoutIn" @click="closeMobileMenu">情绪日志</router-link>
                <router-link to="/knowledge" class="mobile-nav-link" @click="closeMobileMenu">知识库</router-link>
                <div class="mobile-menu-divider" v-if="isLogoutIn"></div>
                <el-button class="mobile-logout-btn" v-if="isLogoutIn" @click="handleLogout">退出登录</el-button>
                <template v-else>
                    <router-link to="/auth/login" class="mobile-nav-link" @click="closeMobileMenu">登录</router-link>
                    <router-link to="/auth/register" class="mobile-nav-link" @click="closeMobileMenu">注册</router-link>
                </template>
            </div>
        </div>

        <div class="main-container">
            <router-view></router-view>
        </div>
        
        <div class="footer-container">
            <div class="footer-bottom">
                <p>&copy; 2026 心理健康AI助手. All rights reserved.</p>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, reactive, onMounted } from 'vue';
import { logout } from '../api/admin';
import { useRouter } from 'vue-router';
import { Menu } from '@element-plus/icons-vue';
const iconUrl = new URL('../assets/images/机器人.png',import.meta.url).href
const router = useRouter();
const mobileMenuOpen = ref(false);

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

const toggleMobileMenu = () => {
    mobileMenuOpen.value = !mobileMenuOpen.value;
};

const closeMobileMenu = () => {
    mobileMenuOpen.value = false;
};

onMounted(() => {
    isLogoutIn.value = localStorage.getItem('token') !== null;
    
    // 点击外部关闭移动端菜单
    document.addEventListener('click', (e) => {
        const mobileMenu = document.querySelector('.mobile-menu');
        const menuBtn = document.querySelector('.mobile-menu-btn');
        if (mobileMenuOpen.value && 
            !mobileMenu?.contains(e.target) && 
            !menuBtn?.contains(e.target)) {
            closeMobileMenu();
        }
    });
});
</script>


<style lang="scss" scoped>
.frontend-layout {
    background-color: #fff;
    min-height: 100vh;
    display: flex;
    flex-direction: column;

    .navbar-container {
        max-width: 1200px;
        width: 100%;
        height: 100%;
        margin: 0 auto;
        padding: 10px 20px;
        display: flex;
        align-items: center;
        // justify-content: flex-start;
        justify-content: space-between;
        gap: 80px;
        position: relative;
        z-index: 100;
        flex-shrink: 0; // 防止navbar被压缩

        .brand-section {
            display: flex;
            align-items: center;
            flex-shrink: 0;

            .brand-name {
                margin-left: 10px;
                font-size: 24px;
                font-weight: 600;
                color: #333;
                
                @media (max-width: 768px) {
                    font-size: 18px;
                }
                
                @media (max-width: 480px) {
                    font-size: 16px;
                }
            }
        }

        .desktop-nav {
            margin-left: auto;
            display: flex;
            align-items: center;
            gap: 40px;

            .nav-link {
                color: #4b5563;
                font-size: 16px;
                font-weight: 500;
                transition: color 0.3s;

                &:hover {
                    color: #4A90E2;
                }
            }
            
            .logout-btn {
                margin-left: 20px;
            }
        }
        
        .mobile-menu-btn {
            display: none;
            cursor: pointer;
            padding: 8px;
            border-radius: 4px;
            transition: background-color 0.3s;
            
            &:hover {
                background-color: #f5f5f5;
            }
        }
    }
    
    .mobile-menu {
        position: fixed;
        top: 70px;
        left: 0;
        right: 0;
        background: white;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        transform: translateY(-100%);
        opacity: 0;
        transition: all 0.3s ease;
        z-index: 99;
        pointer-events: none;
        
        &.active {
            transform: translateY(0);
            opacity: 1;
            pointer-events: auto;
        }
        
        .mobile-menu-content {
            padding: 20px;
            display: flex;
            flex-direction: column;
            gap: 15px;
            
            .mobile-nav-link {
                padding: 12px 16px;
                border-radius: 8px;
                color: #4b5563;
                font-size: 16px;
                font-weight: 500;
                transition: all 0.3s;
                
                &:hover {
                    background-color: #f5f5f5;
                    color: #4A90E2;
                }
                
                &.router-link-active {
                    background-color: #e8f4fd;
                    color: #4A90E2;
                }
            }
            
            .mobile-menu-divider {
                height: 1px;
                background-color: #e5e7eb;
                margin: 10px 0;
            }
            
            .mobile-logout-btn {
                width: 100%;
                margin-top: 10px;
            }
        }
    }

    .main-container {
        flex: 1; // 让main-container占据剩余空间，将footer推到底部
        display: flex;
        flex-direction: column;
    }

    .footer-container {
        background: #1f2937;
        color: white;
        padding: 15px 0;
        flex-shrink: 0; // 防止footer被压缩

        .footer-bottom {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
            text-align: center;
            
            @media (max-width: 768px) {
                padding: 0 15px;
                font-size: 14px;
            }
        }
    }
}

// 响应式断点
@media (max-width: 1024px) {
    .frontend-layout {
        .navbar-container {
            .desktop-nav {
                gap: 20px;
                
                .nav-link {
                    font-size: 14px;
                }
            }
        }
    }
}

@media (max-width: 768px) {
    .frontend-layout {
        .navbar-container {
            padding: 10px 15px;
            
            .desktop-nav {
                display: none;
            }
            
            .mobile-menu-btn {
                display: flex;
                align-items: center;
                justify-content: center;
            }
        }
        
        .mobile-menu {
            top: 60px;
        }
    }
}

@media (max-width: 480px) {
    .frontend-layout {
        .navbar-container {
            padding: 8px 10px;
            
            .brand-section {
                .brand-logo {
                    width: 40px !important;
                    height: 40px !important;
                }
            }
        }
    }
}
</style>