<template>
    <div class="page-head">
        <p class="page-title">{{props.title}}</p>
        <div class="action-btn">
            <!-- 插槽---有按钮需求则需要替换 -->
            <slot name="buttons"></slot>
        </div>
    </div>
    
</template>

<script setup>
const props = defineProps({
    title:{
        type: String,
        default: '页面标题'
    }
})
console.log(props.title)
</script>

<style lang="scss" scoped>
    .page-head{
        margin-bottom: 20px;
        display: flex;
        // align-items: center;为什么老师写的center？？？？？？？？？？
        align-items: start;
        justify-content: space-between;
        .page-title{
            font-size: 24px;
            color: #2d3748;
        }
        
    }
</style>