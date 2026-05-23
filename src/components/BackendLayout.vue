
<template>
  <div class="backend-layout">
    <el-container class="main-container">
      <Sidebar />
      <el-container>
        <el-header>
          <Navbar />
        </el-header>
        <el-main class="main-content">
          <router-view class="content-contanier"></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
  import Sidebar from './Sidebar.vue';
  import Navbar from './Navbar.vue';
</script>

<style  lang='scss' scoped>
 .backend-layout {
    height: 100vh;
    overflow: hidden;
    
    .el-header{
      height: 74px !important;
      padding: 0 15px;
    }
    
    .main-container{
      height: 100%;
      overflow: hidden;
      
      .content-contanier{
        padding: 20px;
        background-color: #fff;
        min-height: calc(100% - 74px);
        overflow-y: auto;
        
        @media (max-width: 768px) {
          padding: 15px;
        }
        
        @media (max-width: 480px) {
          padding: 10px;
        }
      }
    }
 }
 
 // 响应式设计
 @media (max-width: 1024px) {
   .backend-layout {
     .el-header {
       height: 64px !important;
     }
   }
 }
 
 @media (max-width: 768px) {
   .backend-layout {
     .el-header {
       height: 56px !important;
       padding: 0 10px;
     }
   }
 }
</style>