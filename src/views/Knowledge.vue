<template>
    <div>
        <PageHead title="知识文章">
            <template #buttons>
                <!-- 添加新增插槽 -->
                <el-button type="primary" @click="handleEdit({})">新增</el-button>
                <el-button type="primary">删除</el-button>
            </template>
        </PageHead>
        <TableSearch :formItem="formItem" @search="handleSearch"/>
        <el-table :data="tableData" style="width: 100%;margin-top: 25px;">
            <el-table-column label="文章标题" fixed="left" width="350px">
                <template #default="scope">
                    <div style="display: flex; align-items: center;">
                        <el-icon><Timer /></el-icon>
                        <span>{{ scope.row.title }}</span>
                    </div>
                </template>
            </el-table-column>

            <el-table-column label="分类" width="200px">
                <template #default="scope">
                    <div style="display: flex; align-items: center;">
                        <el-icon><Timer /></el-icon>
                        <span>{{ categoryMap[scope.row.categoryId] }}</span>
                    </div>
                </template>
            </el-table-column>
            
            <el-table-column prop="authorName" label="作者" width="150px"/>
            <el-table-column prop="readCount" label="阅读量" width="150px"/>
            <el-table-column prop="updatedAt" label="发布时间" width="200px"/>
            <el-table-column label="操作" fixed="right" width="240">
                <template #default="scope">
                    <!--scope.row当前行数据作为参数  -->
                        <el-button @click="handleEdit(scope.row)" text type="primary">编辑</el-button>
                        <el-button @click="handlePublish(scope.row)" v-if="scope.row.status === 0 || scope.row.status === 2" text type="success">发布</el-button>
                        <el-button @click="handleUnPublish(scope.row)" v-if="scope.row.status === 1" text type="warning">下线</el-button>
                        <el-button @click="handleDelete(scope.row)" text type="danger">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
        style="margin-top: 25px;"
        :page-size="pagination.size"
        layout="prev, pager, next"
        :total="pagination.total"
        @change="handleChange"
        />

        <ArticleDialog v-model:modelValue="dialogVisible" :article="currentArticle" :categories="categories" @success="handleSuccess"/>
    </div>
    
    
</template>

<script setup>
import { onMounted, ref,  reactive} from 'vue';
import PageHead from '../components/PageHead.vue';
import TableSearch from '../components/TableSearch.vue';
import { categoryTree, deleteArticle } from '../api/admin';
import { articlePage, getArticlDetail, changeArticleStatus } from '../api/admin';
import ArticleDialog from '../components/ArticleDialog.vue';
import { ElMessage, ElMessageBox } from 'element-plus';


const formItem = [
    {comp: 'input',prop: 'title', label: '文章标题', placeholder: '请输入文章标题'},
    {comp: 'select',prop: 'categoryId', label: '分类',placeholder: '请选择分类'},
    {comp: 'select',prop: 'status', label: '状态',placeholder: '请选择文章内容', options: [{
        label: '草稿',
        value: '0'
    },{
        label: '已发布',
        value: '1'
    },{
        label: '已下线',
        value: '2'
    }
    ]},
]


//分页数据  //业务参数title，categoryId，status，authorName在formDate里面
const pagination = reactive({
    currentPage: 1,
    size: 10,
    total: 0
})
const handleSearch = async (formDate) =>{
      console.log(formDate,'咨询参数')
    
    const params = {
        ...pagination,
        ...formDate
    }
    // const data = await articlePage(params)
    // console.log(data, '分页数据+业务数据')
    const {records, total} = await articlePage(params)
    tableData.value = records 
    pagination.total = total
}
const handleChange = (page) =>{
    // ??????????为什么page展示的是当前页面页数，为什么handleSearch()就可以更新当前页面的数据，让其展示出来
    console.log(page)
    pagination.currentPage = page
    handleSearch()

}
//分类映射
const categoryMap = reactive([])
//分类列表
const categories = ref([])
//列表数据
const tableData = ref([])

//新增和编辑
//控制弹出开关按钮
const dialogVisible = ref(false)
//记录新增前文章数据
const currentArticle = ref(null)
//文章创建成功handleSubmit
const handleSuccess = () =>{
    console.log('编辑参数')
    //关闭弹窗
    dialogVisible.value = false
    //刷新列表
    handleSearch()
}
//文章编辑
const handleEdit = (row) =>{
    if(!row.id) {
        //新增
        //数据为空，保证在点击完编辑后点击新增是按钮正确“新增文章”
        currentArticle.value = null
        dialogVisible.value = true
    }else{
        //编辑
        getArticlDetail(row.id).then(res =>{
            console.log(res, '编辑详情')
            currentArticle.value = res
            dialogVisible.value = true
        })
    }
    
}

//发布
const handlePublish = (row) => {
    ElMessageBox.confirm(
        `确认发布文章${row.title}吗？`,
        '确认',
        {
            confirmButtonText: '确认发布',
            cancelButtonText: '取消',
            type: 'info'
        }
    ).then(()=>{
        //调用接口
        changeArticleStatus(row.id, {status: 1}).then(res =>{
            ElMessage.success('发布成功')
            handleSearch()
        })
    })
}
const handleUnPublish = (row) => {
    ElMessageBox.confirm(
        `确认下线文章${row.title}吗？`,
        '确认',
        {
            confirmButtonText: '确认下线',
            cancelButtonText: '取消',
            type: 'warning'
        }
    ).then(()=>{
        //调用接口
        changeArticleStatus(row.id, {status: 2}).then(res =>{
            ElMessage.success('下线成功')
            handleSearch()
        })
    })
}

const handleDelete = (row) => {
    ElMessageBox.confirm(
        `确认删除文章${row.title}吗？`,
        '确认',
        {
            confirmButtonText: '确认删除',
            cancelButtonText: '取消',
            type: 'danger'
        }
    ).then(()=>{
        //调用接口
        deleteArticle(row.id).then(res =>{
            ElMessage.success('删除成功')
            handleSearch()
        })
    })
}

onMounted(async ()=>{
    const data = await categoryTree()
    categories.value = data.map(item => { 
        //映射的数据
        categoryMap[item.id] = item.categoryName
        return{
            label: item.categoryName,
            value: item.id
        }
    })
    formItem[1].options = categories.value
//获取列表
    handleSearch()
})

</script>