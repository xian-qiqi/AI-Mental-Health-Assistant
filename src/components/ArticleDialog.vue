<!-- 用与 服务端Knowedge页面 “新增”按钮的编辑页面表单---dialog弹出对话框 -->
 <template>
    <el-dialog
        :title="isEdit?'编辑文章' : '新增文章'"
        v-model="dialogVisible"
        width="50%"
        @close="handleClose" 
        
    >
        <el-form :model="formData" :rules="rules" ref="formRef" label-width="120px">
            <el-form-item label="文章标题" prop="title">
                <el-input v-model="formData.title" placeholder="请输入文章标题" maxlength="200" show-word-limit clearable></el-input>
            </el-form-item>
            <el-form-item label="所属分类" prop="categoryId"> 
                <el-select v-model="formData.categoryId" placeholder="请选择分类">
                    <el-option v-for="item in props.categories" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="文章摘要" prop="summary"> 
                <el-input type="textarea" v-model="formData.summary" placeholder="请输入文章摘要(可选)" maxlength="1000" show-word-limit :rows="4"></el-input>
            </el-form-item>
            <el-form-item label="文章标签" prop="tags"> 
                <el-select v-model="formData.tagArray" placeholder="请输入文章标签(逗号分隔)" multiple filterable allow-create style="width: 100%">
                    <el-option v-for="tag in commonTags" :key="tag" :label="tag" :value="tag" />
                </el-select>
            </el-form-item>
            <el-form-item label="封面图片">
                <div class="cover-upload">
                    <el-upload
                        class="avater-upload"
                        action="#"  
                        :show-file-list="false"
                        :before-upload="beforeUpload"
                        :http-request="handleUploadRequest"
                        accept="image/*"
                    >
                        <div v-if="!imgUrl" class="cover-placeholder">
                            <p>点击上传封面</p>
                        </div>
                        <img v-else :src="imgUrl" class="cover-image" alt="封面图片">
                    </el-upload>
                    <div class="cover-remove" v-if="imgUrl" >
                        <el-button type="danger" size="mini" @click="handleRemove">移除封面</el-button>
                    </div>
                </div>
            </el-form-item>
            <el-form-item label="文章内容" prop="content">
                <RichTextEditor 
                    v-model="formData.content"
                    placeholder="请输入文章内容，支持富文本格式\n\n可以使用加粗、斜体、列表、标题等格式来丰富文章内容。"
                    :maxCharCount="5000"
                    @change="handleContentChange"
                    @create="handleEditorCreated"
                    min-height="400px"
                />
            </el-form-item>
        </el-form>
        <div v-if="btnPreview">
            <h3>内容预览</h3>
            <div v-html="formData.content"></div>
        </div>
        <template #footer>
            <el-button @click="btnPreview = ! btnPreview">{{btnPreview ? '隐藏预览':'预览效果'}}</el-button>
            <el-button @click="handleClose">取消</el-button>
            <el-button type="primary" @click="handleSubmit" :loading="loading">{{ isEdit ? '更新文章' : '新增文章' }}</el-button>
        </template>
    </el-dialog>
 </template>

 <script setup>
import { ElMessage } from 'element-plus';
import { ref, reactive, computed, nextTick, watch} from 'vue';
import { uploadFile, createArticle, updataArticle} from '../api/admin';
import { fileBaseUrl } from '../config';
import RichTextEditor from './RichTextEditor.vue'
//来自于父组件Knowledge
const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    },
    categories: {
        type: Array,
        default: () =>[]
    },
    article: {
        type: Object,
        default: null
    }
})
console.log(props.categories)

//update:modelValue来自于RichTextEditor
const emit = defineEmits(['update:modelValue', 'success'])
const dialogVisible = computed({
    get(){
        return props.modelValue
    },
    set(val){   
        emit('update:modelValue', val)
    }
})

//表单数据
const formData =reactive({
    "title": "",
    "content": "",
    "coverImage": "",
    "categoryId": '',
    "summary": "",
    "tags": "",
    "id": ""
})
console.log('ArticleDialog'+formData)
const rules = reactive({
    title: [
        {required: true, message: '请输入文章标题', trigger: 'blur'},
        {max: 200, message: '文章标题最多200个字符', trigger: 'blur'},
    ],
    categoryId: [
        {required: true, message: '请选择分类', trigger: 'change'},
    ],
    content: [
        {required: true, message: '请输入文章内容', trigger: 'change'},
         {max: 5000, message: '文章内容最多5000个字符', trigger: 'blur'},
    ]
})

const commonTags = [
  '情绪管理', '焦虑', '抑郁', '压力', '睡眠', 
  '冥想', '正念', '放松', '心理健康', '自我成长',
  '人际关系', '工作压力', '学习方法', '生活技巧'
]

//上传
const imgUrl = ref('')
const beforeUpload = (file) =>{
    //针对上传的文件进行校验
    console.log(file)
    const isImage = file.type.startsWith('image/')
    const isLt5M = file.size / 1024/ 1024 < 5
    if(!isImage){
        ElMessage.error('上传封面图片，请选择图片文件')
        return false
    }
    if(!isLt5M){
        ElMessage.error('上传封面图片，图片大小不能超过5MB')
        return false
    }
    return isImage
}
//上传图片的唯一标识
const businessId = ref(null)
const handleUploadRequest =async ({file}) =>{
     //随机生成唯一id，crypto加密
    businessId.value = crypto.randomUUID()
    console.log(businessId.value, 'businessId')
    const fileRes =  await uploadFile(file , {
        businessId: businessId.value
    })
    console.log(fileRes,'上传返回的 fileRes 完整数据：')

    //拼接完整图片路径
    imgUrl.value = fileBaseUrl + fileRes.filePath
    formData.coverImage = fileRes.filePath
 
}
const handleRemove = () =>{
    imgUrl.value=''
    formData.coverImage=''
}

//富文本
const handleContentChange = (data) =>{
    console.log(data)
    formData.content = data.html
}
const editorInstance = ref(null) 
const handleEditorCreated = (editor) =>{
    editorInstance.value = editor
    //编译，原始数据有文本
    if(formData.content && editor){
        nextTick(() =>{
            editor.setHTML(formData.content)
        })
    }
}
//预览效果
//状态定义---用于判断
const btnPreview = ref(false)
//创建文章
const formRef = ref()
const loading = ref(false) 
const handleSubmit = () => {
    formRef.value.validate((valid, fields) =>{
        if(valid){
            loading.value = true
        }
        console.log(formData, 'formData')
        const submitData = {
            ...formData,
            tags: formData.tagArray.join(',')
        }
        delete submitData.tagArray
        if(!isEdit.value){
            //新增
            submitData.id = businessId.value
            createArticle(submitData).then(res =>{
            loading.value = false
            emit('success')
        })
        }else{
            //更新
            updataArticle(props.article.id, submitData).then(res =>{
                loading.value = false
                emit('success')
            })
        }
        
    })
}

//用于判断是新增还是编辑
const isEdit = computed(() => !!props.article?.id) //!!表示将其转化为boolear值，true为编辑，false为新增
watch(() =>props.article, (newVal) =>{
    if(newVal){
        nextTick(() => {
            Object.assign(formData, newVal)
            //使用现有ID
            businessId.value = newVal.id
            //封面Url
            imgUrl.value = fileBaseUrl + newVal.coverImage
        })
    }
})
//“取消”按钮
//点击了编辑按钮后，再点击新增按钮时，会记录编辑按钮的数据，不对啊!!!!!!!!!!!!!!!!!!
const handleClose = () =>{
    //取消时重置数据
    formRef.value.resetFields()
    //重置id
    businessId.value = ''
    //手动清除标签
    formData.tagArray = []
    //重置封面图片和数据的图片路径
    handleRemove()
    dialogVisible.value = false 
    //或者
    // emit('update:modelValue', false)

}
</script>

<style lang="scss" scoped> 
.cover-placeholder{
    width: 200px;
    height: 120px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #8b949e;
    background: #f6f8fa;
}
.cover-image{
    width: 200px;
    height: 120px;
    display: block;
    object-fit: cover;
    object-position: center;
}
</style>