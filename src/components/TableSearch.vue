<template>
    <el-form :model="formDate" ref="ruleFormRef">
        <el-row :gutter="24">
            <template v-for="item in formItemAttr" :key="item.prop">
                <el-col v-bind="item.col">
                    <el-form-item :label="item.label" :prop="item.prop">
                        <!-- ???动态组件---查看Sidebar也有使用 -->
                        <component v-model="formDate[item.prop]" :is="isComp(item.comp)" :placeholder="item.placeholder">
                            <template v-if="item.comp === 'select'">
                                <el-option label="全部" value=""></el-option>
                                <el-option 
                                    v-for="opt in item.options"
                                    :key="opt.value"
                                    :label='opt.label'
                                    :value="opt.value"/>
                            </template>
                        </component>
                        
                        <!-- **把item里的所有属性（placeholder/options等）传给组件 ,但要拼接label="全部" value=""的话需要重新使用函数进行-->
                        <!-- <component :is="isComp(item.comp)" v-bind="item" ></component> -->
                    </el-form-item>
                </el-col>
                
            </template>
        </el-row>
        
        <el-row>
            <el-button type="primary" @click="handleSearch">查询</el-button>
            <el-button @click="handleReset(ruleFormRef)">重置</el-button>
        </el-row>
        
    </el-form>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { computed } from 'vue';

// 接受传过来的数据---如Knowledge中的formItem
const props = defineProps({
    formItem: {
        type: Array,
        default: ()=>{}
    }
})
// ????????????????与Knowledge有关-----组件通信
const emit = defineEmits(['search'])
const formItemAttr = computed(() => {
    const {formItem} = props
    formItem.forEach(item => {
        item.col = {xs: 24, sm: 12, md: 8, lg: 6, xl: 6}
    })
    return formItem
})

//表单数据
const ruleFormRef = ()=>{}
const formDate = reactive({})
const isComp = (comp)=>{
    return {
        input: 'elInput',
        select: 'elSelect'
    }[comp]
}
const handleSearch = () => {
    //?????????????????????
    console.log(formDate)
    emit('search', formDate)
}
const handleReset = (formEl) => {
    //先重置表单，再触发查询
    if(!formEl) return 
    formEl.resetFields()
    emit('search', formDate)  //不写这个不是也可以吗？？？？？？？？？？/
}
</script>