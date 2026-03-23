import { defineStore } from "pinia";
import { ref } from "vue";
// 组件--Sidebar与Navber的通信--进行左侧导航的收缩
export const useAdminStore = defineStore('admin',()=>{
    // 全局状态
    const isCollapse = ref(false)
    const toggleCollapse = ()=>{
        isCollapse.value = !isCollapse.value
    }
    // 暴露状态和方法
    return {
        isCollapse,
        toggleCollapse
    }
})