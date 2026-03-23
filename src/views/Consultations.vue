<template>
    <div>
        <PageHead title="咨询服务" />
        <el-table :data="tableData" style="width: 100%;">
            <el-table-column label="会话" width="100">
                <template #default="scope">
                    <!-- 为什么可以使用scop.row.userNickname得到数据 -->
                    <el-avatar>{{ scope.row.userNickname }}</el-avatar>
                </template>
            </el-table-column>
            <el-table-column label="情绪日志">
                <template #default="scope">
                    <div class="session-title">{{ scope.row.sessionTitle }}</div>
                    <div class="session-preview">{{ scope.row.lastMessageContent
                        }}</div>
                </template>
            </el-table-column>
            <el-table-column prop="messageCount" label="消息数" width="100" />
            <el-table-column prop="lastMessageTime" label="时间" width="200" />
            <el-table-column label="操作" width="100">
                <template #default="scope">
                    <el-button type="primary" text @click="viewSessionDetail(scope.row)">详情</el-button>
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

        <el-dialog v-model="showDetailDialog" title="咨询会话详情" width="70%" :close-on-click-modal="false">
            <div class="session-detail">
                <div class="detail-header">
                    <div class="detail-label">用户：</div>
                    <div class="detail-value">{{ sessionDetail.userNickname }}</div>
                </div>
                <div class="detail-header">
                    <div class="detail-label">开始时间：</div>
                    <div class="detail-value">{{ sessionDetail.startedAt }}</div>
                </div>
                <div class="detail-header">
                    <div class="detail-label">消息数：</div>
                    <div class="detail-value">{{ sessionDetail.messageCount }}</div>
                </div>
            </div>
            <div class="messages-container" >
                <div class="message-header">
                    <span>对话记录</span>
                </div>
                <div class="message-list" v-loading="LoadingMessage">
                    <div v-for="message in sessionMessages" :key="message.id" class="message-item" :class="message.senderType===1?'user-message':'ai-message'">
                        <div class="message-item-header">
                            <span class="sender">{{message.senderType===1?'用户':'AI助手'}}</span>
                            <span class="time">{{ message.createdAt }}</span>
                        </div>

                        <div class="message-content">{{ message.content }}</div>
                    </div>
                </div>
            </div>
            <!-- 为什么不添加#footer,就不显示按钮 -->
            <template #footer>
                <el-button @click="showDetailDialog = false">关闭</el-button>
            </template>
        </el-dialog>
    </div>

</template>


<script setup>
import PageHead from '../components/PageHead.vue';
import { ref, reactive, onMounted } from 'vue';
import { getConsultationPage, getSessionDetail } from '../api/admin'

const tableData = ref([])

const pagination = reactive({
    currentPage: 1,
    size: 10,
    total: 0
})
//用于存储当前查看的会话详情数据，用于dialog显示
const sessionDetail = ref({})
//用于存储后端接口返回的会话消息列表数据，用于dialog显示
const sessionMessages = ref([])
const LoadingMessage = ref(false)
const viewSessionDetail = (row) => {
        LoadingMessage.value = true
        showDetailDialog.value = true
    getSessionDetail(row.id).then(res => {
        //res与row居然不一样，res是接口返回的数据，row是表格当前行的数据
        LoadingMessage.value = false
        sessionMessages.value = res
        sessionDetail.value = row
        
    })
}
const handleChange = (page) => {
    pagination.currentPage = page
    handleSearch()
}
const handleSearch = () => {
    getConsultationPage(pagination).then(res => {
        //为什么可以使用res来得到数据，为什么console.log显示不出来
        console.log(res.value)
        const { records, total } = res
        tableData.value = records
        pagination.total = total

    })
}

//详情
const showDetailDialog = ref(false)

onMounted(() => {
    handleSearch()
})
</script>
<style lang="scss" scoped>
.session-title {
    font-weight: 500;
    color: #333;
    margin-bottom: 4px;
}

.session-preview {
    font-size: 13px;
    color: #666;
    margin-bottom: 4px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

// 基本信息卡片样式
.session-detail {
    background: #f8f9fa; // 浅灰色背景
    border: 1px solid #e9ecef;
    border-radius: 6px;
    padding: 12px 16px;
    margin-bottom: 20px;

    .detail-header {
        display: flex;
        align-items: center;
        justify-content: left;
        margin-bottom: 8px;

        &:last-child {
            margin-bottom: 0;
        }

        .detail-label {
            min-width: 80px; 
            max-width: 80px; 
            color: #495057;
            font-weight: 500;
            text-align: left;
            padding-right: 8px;
        }

        .detail-value {
            color: #212529;
        }
    }
}

.messages-container {
    // 修复：类名匹配模板里的 message-header（去掉多余的s）
    .message-header {
        margin-bottom: 12px;

        span {
            margin: 10px 0; // 调整margin，避免左右间距过大
            color: #333;
            font-size: 20px;
            // font-weight: 600;
            // 可选：加个下划线/边框，更贴近参考样式
            padding-bottom: 8px;
            border-bottom: 1px solid #e9ecef;
        }
    }

    .message-list {
        max-height: 400px;
        overflow-y: auto;
        padding: 0;
    }

    // 修复：把 message-item-header 提到外层，确保样式生效
    .message-item {
        padding: 10px 12px;
        border-radius: 6px;
        margin-bottom: 10px;
        position: relative;

        .message-item-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px; // 加间距，和内容分开
        }

        .sender {
            font-weight: 500;
            color: #495057;
        }

        .time {
            font-size: 12px;
            color: #999;
        }

        // 用户消息气泡
        &.user-message {
            background: #e3f2fd;
            border: 1px solid #dbebf8;
        }

        // AI消息气泡
        &.ai-message {
            background: #f0f9f0;
            border: 1px solid #e9ecef;
        }

        .message-content {
            color: #333;
            line-height: 1.6;
            white-space: pre-wrap;
            font-size: 14px;
        }
    }
}
</style>
