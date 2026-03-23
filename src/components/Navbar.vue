<template>
    <div class="navber">
        <div class="flex-box">
            <el-button @click="handleCollapse">
                <el-icon><Expand /></el-icon>
            </el-button>
            <p class="page-title">{{route.meta.title}}</p>
        </div>
        <div class="flex-box">
            <!-- 下拉组件 -->
            <el-dropdown @command="handleCommand">
                <!-- ?????????为什么div是定义在dropdown里面 -->
                <div class="flex-box">
                    <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"/>
                    <p class="user-name">admin</p>
                    <el-icon><ArrowDown /></el-icon>
                </div>
                <!-- 插槽????????????????----element-plus官网dropdown组件使用方法 -->
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
    // 这是？？？？？？？？？？!rgba(0,21,41,0.08)
    box-shadow: 0 1px 4px rgba(0,21,41,0.08);
    border-bottom: 1px solid #e5e7eb;

    .flex-box{
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .page-title{
        margin-left: 20px;
        font-size: 26px;
        // font-weight: bold;!!!!!!!!!!!!!!!!!!
        font-weight: bold;
        color: #1f2937;

    }
}
    
</style>