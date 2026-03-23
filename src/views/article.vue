<template>
    <div class="articleDetail-container">
        <div class="header-section">
            <div class="header-content">
                <el-image :src="iconUrl" style="width: 60px; height: 60px;" />
                <h1>知识文章详情</h1>
            </div>
        </div>
        <div class="content">
            <div class="diary-card">
                <p class="title">文章信息</p>
                <div class="sub-title">
                    <el-tag size="large" type="primary" class="category-tag">{{ articleDetail?.categoryName }}</el-tag>
                    <div class="flex-box">
                        <el-icon><List /></el-icon>
                        <span>{{ dayjs(articleDetail?.updatedAt).format('YYYY-MM-DD') }}</span>
                    </div>
                </div>
                <h1 class="article-title">{{ articleDetail?.title }}</h1>
                <!-- 没有summary ，content为什么？？？？
                 原因：在定义articleDetail时，使用ref({}),而不是ref(null)-->
                <div class="summary-content" v-if="articleDetail.summary">
                    <p>{{ articleDetail.summary }}</p>
                </div>
                <div :style="{ marginTop: '20px' }" class="flex-box">
                    <div class="item flex-box">
                        <el-icon><Avatar /></el-icon>
                        <span>{{ articleDetail?.authorName }}</span>
                    </div>
                    <div class="item flex-box">
                        <el-icon><Platform /></el-icon>
                        <span>{{ articleDetail?.readCount }}次阅读</span>

                    </div>
                </div>
            </div>
            <div class="diary-card">
                <div class="title">正文内容</div>
                <div class="content-wrapper"  v-html="formatContent(articleDetail?.content)"></div>
                <div class="tags-content" v-if="articleDetail.tags && articleDetail.tags.length">
                    <div class="tags-title">相关标签</div>
                    <div class="tags-list">
                        <el-tag v-for="tag in articleDetail.tagArray" :key="tag" class="tag-item" type="info" effect="light">{{ tag }}</el-tag>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, reactive } from 'vue';
import { getArticleDetail } from '../api/fronted';
import { useRoute } from 'vue-router';
import { dayjs } from 'element-plus';

const iconUrl = new URL('../assets/images/book.png', import.meta.url).href
//基本HTML清理和格式化函数，后续可以根据需要进行扩展，比如支持更多的Markdown语法或者自定义标签等
const formatContent = (content) => {
  if (!content) return ''
  
  // 基本的HTML清理和格式化
  let formatted = content
      .replace(/\n/g, '<br>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
  
  return formatted
}

const articleDetail = ref({})
// defineProps用于接收父组件传递的参数，这里我们需要接收文章的id，它的父组件是frontendKnowledge.vue，为什么是这个父组件？因为这个组件是frontendKnowledge.vue通过路由跳转过来的，路由传递了id参数，所以我们在这里需要接收这个参数
const props = defineProps({
    id: String
}) 

// 关键1：通过useRoute获取路由实例，读取查询参数
// const route = useRoute()

onMounted(() =>{
    console.log('接收到的文章id:', props.id)//是undefined，说明没有接收到参数，为什么没有接收到参数？因为路由传递参数的方式有两种，一种是通过路径参数，一种是通过查询参数，我们在frontendKnowledge.vue中是通过查询参数的方式传递的，所以在这里我们需要使用useRoute来获取查询参数，而不是使用defineProps来接收路径参数
    // const articleId = route.query.id

    //或者在路由里面定义props: true，这样就可以直接使用defineProps来接收参数了，或者在路由里面定义props: (route) => ({ id: route.query.id })，这样也可以直接使用defineProps来接收参数了，或者在路由里面定义props: (route) => ({ id: route.params.id })，这样也可以直接使用defineProps来接收参数
    getArticleDetail(props.id).then(res => {
        console.log('知识文章详情根据id返回的后端数据:', res)
        articleDetail.value = res
    })
})
</script>

<style lang="scss" scoped>
.articleDetail-container {
    background: linear-gradient(135deg, #fafbfc 0%, #f7f9fc 50%, #f2f6fa 100%);

    .flex-box {
        display: flex;
        align-items: center;

        .item {
            margin-right: 20px;

            span {
                margin-left: 5px;
            }
        }
    }

    .header-section {
        background: linear-gradient(135deg, #f59e0b 0%, #8b5cf6 100%);
        color: white;
        padding: 48px;

        .header-content {
            display: flex;
            align-items: center;
            gap: 12px;
        }
    }

    .content {
        margin: 0 auto;
        width: 980px;
        padding: 20px;

        .diary-card {
            margin-bottom: 20px;
            background: white;
            border-radius: 10px;
            padding: 20px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);

            .title {
                margin-bottom: 15px;
                font-size: 20px;
                font-weight: 600;
                color: #374151;
            }

            .sub-title {
                margin-top: 20px;
                display: flex;
                align-items: center;

                .category-tag {
                    margin-right: 20px;
                }
            }

            .article-title {
                font-size: 28px;
                font-weight: bold;
                color: #111827;
                margin-top: 30px;
                margin-bottom: 10px;
            }

            .summary-content {
                background: rgba(126, 211, 33, 0.1);
                border-left: 4px solid #7ED321;
                padding: 10px 15px;
                border-radius: 0 8px 8px 0;
                position: relative;
            }

            .content-wrapper {
                font-size: 15px;
                color: #374151;

                :deep(p) {
                    margin-bottom: 10px;
                }

                :deep(h1),
                :deep(h2),
                :deep(h3),
                :deep(h4),
                :deep(h5),
                :deep(h6) {
                    margin: 15px 0 10px;
                    color: #111827;
                    font-weight: 600;
                }

                :deep(h2) {
                    font-size: 15px;
                    border-bottom: 2px solid #e5e7eb;
                    padding-bottom: 5px;
                }

                :deep(h3) {
                    font-size: 13px;
                }

                :deep(ul),
                :deep(ol) {
                    padding-left: 15px;
                    margin-bottom: 10px;
                }

                :deep(li) {
                    margin-bottom: 5px;
                }
            }

            .tags-content {
                margin-top: 20px;
                padding-top: 15px;
                border-top: 1px solid #e5e7eb;

                .tags-title {
                    margin-bottom: 10px;
                    font-size: 14px;
                    font-weight: 600;
                    color: #374151;
                }

                .tags-list {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 10px;
                }
            }
        }
    }
}
</style>