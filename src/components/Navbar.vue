<template>
    <div class="navber">
        <div class="flex-box">
            <el-button @click="handleCollapse" class="collapse-btn">
                <el-icon><Expand /></el-icon>
            </el-button>
            <p class="page-title">{{route.meta.title}}</p>
        </div>
        <div class="flex-box">
            <!-- 下拉组件 -->
            <el-dropdown @command="handleCommand" class="user-dropdown">
                <div class="flex-box">
                    <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" class="user-avatar"/>
                    <p class="user-name">admin</p>
                    <el-icon class="dropdown-icon"><ArrowDown /></el-icon>
                </div>
                 <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item command="logout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                 </template>
            </el-dropdown>
        </div>
    </div>
</template>

<script setup>
import { useAdminStore } from '../stores/admin';
import {logout} from '../api/admin'
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { ElMessageBox } from 'element-plus';
//useRouter和useRoute是vue-router提供的两个函数，分别用于获取路由对象和当前路由信息
const router = useRouter();
const route = useRoute();
console.log(route.meta, '导航栏查看路由信息')

const handleCommand = (command) => {
    console.log(command)
    if(command === 'logout'){
        ElMessageBox.confirm('确定要退出登录吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }).then(() => {
            // 这里执行退出登录的逻辑，比如清除用户信息、跳转到登录页等
            // 例如：localStorage.removeItem('token');
            //清除缓存
            logout().then(()=>{
                localStorage.removeItem('token');
                localStorage.removeItem('userInfo');
                router.push('/auth/login');
            })});
    }
}
//toggleCollapse是admin store中的一个方法，用于切换侧边栏的展开和收起状态
const handleCollapse = ()=>{
    useAdminStore().toggleCollapse()
}
</script>

<style lang="scss" scoped>
.navber{
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 15px;
    background-color: white;
    box-shadow: 0 1px 4px rgba(0,21,41,0.08);
    border-bottom: 1px solid #e5e7eb;

    .flex-box{
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .collapse-btn {
        min-width: 40px;
        min-height: 40px;
        padding: 8px;
        
        @media (max-width: 768px) {
            min-width: 36px;
            min-height: 36px;
            padding: 6px;
        }
    }
    
    .page-title{
        margin-left: 20px;
        font-size: 26px;
        font-weight: bold;
        color: #1f2937;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 300px;
        
        @media (max-width: 1024px) {
            font-size: 22px;
            margin-left: 15px;
            max-width: 250px;
        }
        
        @media (max-width: 768px) {
            font-size: 18px;
            margin-left: 12px;
            max-width: 180px;
        }
        
        @media (max-width: 480px) {
            font-size: 16px;
            margin-left: 10px;
            max-width: 120px;
        }
    }
    
    .user-dropdown {
        .flex-box {
            cursor: pointer;
            padding: 8px 12px;
            border-radius: 8px;
            transition: background-color 0.3s;
            
            &:hover {
                background-color: #f5f5f5;
            }
            
            .user-avatar {
                width: 36px;
                height: 36px;
                
                @media (max-width: 768px) {
                    width: 32px;
                    height: 32px;
                }
                
                @media (max-width: 480px) {
                    width: 28px;
                    height: 28px;
                }
            }
            
            .user-name {
                margin: 0 8px;
                font-size: 14px;
                color: #374151;
                
                @media (max-width: 768px) {
                    font-size: 13px;
                    margin: 0 6px;
                }
                
                @media (max-width: 480px) {
                    display: none;
                }
            }
            
            .dropdown-icon {
                @media (max-width: 480px) {
                    display: none;
                }
            }
        }
    }
}

// 响应式设计
@media (max-width: 1024px) {
    .navber {
        padding: 0 12px;
    }
}

@media (max-width: 768px) {
    .navber {
        padding: 0 10px;
    }
}

@media (max-width: 480px) {
    .navber {
        padding: 0 8px;
        
        .flex-box:first-child {
            gap: 8px;
        }
    }
}
</style>