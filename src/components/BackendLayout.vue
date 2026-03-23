
<template>
  <div class="backend-layout">
    <el-container class="main-container">
      <Sidebar />
      <el-container>
        <el-header>
          <Navbar />
        </el-header>
        <el-main class="main-content">
          <!-- 为什么app.vue和这个都使用了router-view -->
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
    .el-header{
      height: 74px !important;
    }
    .main-container{
      height: 100%;
      .content-contanier{
        padding: 20px;
        background-color: #fff;
        min-height: calc(100% - 74px);
      }
        
    }
 }
</style>

