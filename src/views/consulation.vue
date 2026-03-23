<template>
    <div class="consultation-container">
        <div class="sidebar">
            <!-- AI助手信息 -->
            <div class="ai-assistant-info">
                <div class="breathing-circle">
                    <el-image :src="iconUrl" style="width: 25px; height: 25px;" alt="AI助手" />
                </div>
                <h3 class="assistant-name">宁渡AI助手</h3>
                <div class="online-status">
                    <div class="status-dot"></div>
                    在线服务中
                    <!-- <span>在线服务中</span> -->
                </div>
            </div>

            <div class="emotion-garden">
                <!-- 情绪花园 -->
                <div class="garden-header">
                    <div class="garden-title">情绪花园</div>
                </div>
                <div class="emotion-info">
                    <div class="emotion-name">中性</div>
                    <div class="emotion-score">50</div>
                </div>
                <div class="warm-tips">
                    <div class="emotion-status-text">
                        <span class="status-label">今天感觉</span>
                        <span class="status-emotion">{{currentEmotion.isNegative ? '需要关注' : '很不错'}}</span>
                    </div> 
                    <div class="emotion-intensity">
                        <span class="intensity-dots ">
                            <span v-for="dot in 3" :key="dot" class="dot" :class="{'active': getIntensityClass(currentEmotion.emotionScore) >= dot}"></span>
                        </span>
                        <span class="intensity-text">
                            {{ getRiskText(currentEmotion.riskLevel) }}
                        </span>
                    </div>
                    <!-- 情绪卡片 -->
                    <div class="warm-suggestion" v-if="currentEmotion.suggestion">
                        <div class="suggestion-icon">💝</div>
                        <div class="suggestion-content">
                            <div class="suggestion-title">给您的小建议</div>
                            <div class="suggestion-text">{{ currentEmotion.suggestion }}</div>
                        </div>
                    </div>
                    <!-- 治疗行动 -->
                     <!-- currentEmotion.improvementSuggestions.length > 0为什么错了？？
                       忘记在currentEmotion上 定义improvementSuggestions了-->
                    <div class="healing-actions" v-if="currentEmotion.improvementSuggestions.length > 0">
                        <div class="actions-title">治愈小行动</div>
                        <div class="actions-list">
                            <div v-for="action in currentEmotion.improvementSuggestions" :key="action" class="action-item">
                                <div class="action-icon">✨</div>
                                <div class="action-text">{{ action }}</div>
                            </div>
                        </div>
                    </div>
                    <!-- 风险提示 -->
                    <div class="risk-notice" v-if='currentEmotion.isNegative && currentEmotion.riskLevel>1'>
                        <div class="notice-icon">🤗</div>
                        <div class="notice-content">
                            <div class="notice-title">温馨提示</div>
                            <div class="notice-text">{{ currentEmotion.riskDescription }}</div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="session-history">
                <!-- 会话历史 -->
                <h4 class="section-title">会话列表</h4>
                <div class="session-list">
                    <div v-for="session in sessionList" :key="session.id" @click="handleSessionClick(session)" class="session-item">
                        <div class="session-info">
                            <div class="session-title">
                                <span>{{ session.title }}</span>
                                <div class="session-meta">
                                    <span class="session-time">{{ session.startedAt }}</span>
                                </div>
                                <div class="session-preview">
                                    <span>{{ session.lastMessageContent }}</span>
                                </div>
                                <div class="session-stats">
                                    <span>
                                        <el-icon>
                                            <ChatRound />
                                        </el-icon>
                                        {{ session.messageCount || 0 }}
                                        <el-icon>
                                            <Clock />
                                        </el-icon>
                                        {{ session.lastMessageTime || 0 }}分钟
                                    </span>
                                </div>
                            </div>
                            <div class="session-actions">
                                <el-button text type="danger" size="small"
                                    @click.stop="handleSessionDelete(session.id)">
                                    <el-icon>
                                        <DeleteFilled />
                                    </el-icon>
                                </el-button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>

        <div class="chat-main">
            <div class="chat-header">
                <div class="header-left">
                    <div class="chat-avatar">
                        <el-image :src="iconUrl1" style="width: 30px; height: 30px;" />
                    </div>
                    <div class="chat-info">
                        <h2>宁渡AI助手</h2>
                        <p>您贴心的AI健康助手</p>
                    </div>
                </div>

                <el-button circle @click="createNewFrontendSession" title="新建会话" class="send-btn">
                    <el-icon>
                        <Plus />
                    </el-icon>
                </el-button>
            </div>

            <!-- 聊天消息区域 -->
            <div class="chat-messages">
                <!-- 默认信息----欢迎用语 -->
                <div class="message-item ai-message" v-if="messages.length === 0">
                    <div class="message-avatar">
                        <el-image :src="iconUrl" style="width: 18px; height: 18px;" />
                    </div>
                    <div class="message-content ">
                        <div class="message-bubble">
                            <p>您好！我是小暖，您的AI心理健康助手。很高兴陪伴您，为您提供温暖的心理支持。请告诉我，今天您感觉怎么样？有什么想要分享的吗？</p>
                        </div>
                        <div class="message-time">刚刚</div>
                    </div>
                </div>
                <!-- 消息列表 -->
                <div class="message-item" v-for="msg in messages" :key="msg.id"
                    :class="msg.senderType === 1 ? 'user-message' : 'ai-message'">
                    <div class="message-avatar">
                        <el-image v-if="msg.senderType === 1" :src="iconUrl2" style="width: 18px; height: 18px;" />
                        <el-image v-if="msg.senderType === 2" :src="iconUrl" style="width: 18px; height: 18px;" />
                    </div>
                    <div class="message-content">
                        <div class="message-bubble">
                            <!-- ai正在思考 -->
                            <div class="typing-indicator" v-if="msg.senderType === 2 && isAiTyping && !msg.content">
                                <div class="typing-dot"></div>
                                <div class="typing-dot"></div>
                                <div class="typing-dot"></div>
                            </div>
                            <!-- ai错误提醒 ?????-->
                            <div class="error-message" v-else-if="msg.isError">
                                <p>{{msg.content}}</p>
                            </div>
                            <!-- ai正常返回信息 -->
                            <MarkdownRenderer v-else-if="msg.senderType===2 && !msg.isError" :content="msg.content" :is-ai-message='true'/>
                            <p v-else-if="msg.content" v-html="formatMessageContent(msg.content)"></p>
                        </div>
                        <div class="message-time">{{ msg.senderType === 2 && isAiTyping ? 'AI正在输入...' : msg.createdAt  }}
                        </div>

                    </div>
                </div>
            </div>

            <!-- 消息输入区域 -->
            <div class="chat-input">
                <div class="input-container">
                    <el-input v-model="userMessage" placeholder="请输入您想要分享的内容..." type="textarea" :rows="3"
                        :disabled="isAiTyping" @keydown="handleKeyDown" class="message-input" clearable />
                    <div class=""></div>
                
                    <div class="input-footer">
                        <span>按Enter发送，Shift+Enter换行</span>
                        <span>{{ userMessage.length }}/1000</span>
                    </div>
                </div>
                <el-button :disabled="!userMessage.trim() || userMessage.length > 1000" class="send-btn" type="primary" @click="sendMessage">
                    <el-icon>
                        <Promotion />
                    </el-icon>
                </el-button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { startSession, getSessionList, deleteSession, getSessionDetail, getSessionEmotion } from '../api/fronted.js'
import { ElMessage } from 'element-plus';
import MarkdownRenderer from '../components/MarkdownRenderer.vue'
import {fetchEventSource} from '@microsoft/fetch-event-source'


const iconUrl = new URL('../assets/images/robot-fill.png', import.meta.url).href
const iconUrl1 = new URL('../assets/images/like.png', import.meta.url).href
const iconUrl2 = new URL('../assets/images/users.png', import.meta.url).href

const resetSessionState = () => {
    // 重置消息列表
    messages.value = [];
    // 清空输入框
    userMessage.value = '';
    // 重置AI输入状态
    isAiTyping.value = false;
    // 重置情绪数据（核心：保证新会话有默认情绪值）
    currentEmotion.value = {
        primaryEmotion: '中性',
        emotionScore: 50,
        isNegative: false,
        riskLevel: 0,
        suggestion: '情绪状态平稳',
        improvementSuggestions: [],
        riskDescription: '当前情绪状态良好，无需特别关注',
    };
};
const createNewFrontendSession = () => {
    //创建一个新的会话对象
    const newSession = {
        sessionId: `temp_${Date.now()}`, // 使用时间戳作为唯一ID
        status: 'TEMP', // 会话状态,没与AI对话的默认欢迎语是TEMP状态，之后与AI对话后变为ACTIVE状态
        sessionTitle: '新对话',
    }
    currentSession.value = newSession
    //展示默认页面欢迎语
    resetSessionState()
}
//用于存储当前会话的信息，包括会话ID、状态、标题等
const currentSession = ref(null)
//用于存储会话列表，作用于侧边栏的会话历史记录展示，用户可以点击切换不同的会话
const sessionList = ref([])
//定义是否又对话消息,有的话则显示我的对话信息，否则显示默认AI信息
const messages = ref([])
//用于存储用户输入的消息内容
const userMessage = ref('')
//用于控制AI是否正在输入状态，输入状态下禁用输入框和发送按钮
const isAiTyping = ref(false)
//情绪花园
const currentEmotion = ref({
    primaryEmotion: '中性',
    emotionScore: 50,
    isNegative: false,
    riskLevel: 0,
    suggestion: '情绪状态平稳',
    improvementSuggestions: [],
    riskDescription: '当前情绪状态良好，无需特别关注',
})
const getIntensityClass = (score) => {
    if(score >= 61){
        return 3
    }else if(score >= 31){
        return 2
    }else{
        return 1
    }
}
const getRiskText = (riskLevel) => {
    switch(riskLevel){
        case 0:
            return '正常'
        case 1:
            return '关注'
        case 2:
            return '预警'
        case 3:
                return '危机'   
            default:
            return '正常'
    }
}
const loadSessionEmotion = (sessionId) => {
    //确保sessionId格式正确
    const id  = sessionId.toString().startsWith('session_')?sessionId: `session_${sessionId}`
    getSessionEmotion(id).then(res => {
        console.log("情绪分析数据consultation", res)
        currentEmotion.value = res
    })
}
//用于监听输入框的键盘事件，当用户按下Enter键时触发发送消息的函数，同时支持Shift+Enter换行功能
const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();

    }

}
//用于发送消息的函数，负责将用户输入的消息添加到消息列表中，并触发AI助手的回复逻辑
const sendMessage = () => {
    if (!userMessage.value.trim()) return
    if (isAiTyping.value) {
        ElMessage.error('AI助手正在输入，请稍后...')
        return
    }
    const message = userMessage.value.trim()
    userMessage.value = ''

    //如果没有会话或者是临时会话，则先创建一个新的会话
    if (currentSession.value.status === 'TEMP') {
        // await startNewSession(message)
        startNewSession(message)
    }else{
        //已经有对话了，在这基础上继续对话
        //为什么不对？？
        // startNewSession(messages)
        //必须将新输入的用户信息传输给后端，才能让AI助手基于这个新的用户信息继续生成回复。如果直接调用startNewSession函数而不传递消息内容，后端就无法知道用户输入了什么，也就无法生成相应的回复。因此，我们需要将用户输入的消息内容作为参数传递给startNewSession函数，以确保AI助手能够正确地接收和处理用户的输入，从而继续进行对话。
        messages.value.push({
            id: Date.now(),
            senderType: 1,
            content: message,
            createdAt: new Date().toISOString(),
        })
        startAIResponse(currentSession.value.sessionId, message)
        //使用startNewSession(message)为什么用两个输入信息？因为当用户发送消息时，如果当前会话是临时会话（TEMP状态），我们需要先创建一个新的会话，并将用户输入的消息作为初始消息传递给后端，以便AI助手能够基于这个消息生成回复。因此，在这种情况下，我们调用startNewSession(message)来创建新的会话并传递用户消息。而如果当前会话已经是活跃状态（ACTIVE状态），我们只需要将用户输入的消息添加到消息列表中，并调用startAIResponse函数来继续进行对话，而不需要再创建新的会话，所以在这种情况下我们直接调用startAIResponse(currentSession.value.sessionId, message)即可。
        //
        // startNewSession(message)
    }
    getSessionPage()

}
const startNewSession = (message) => {
    //构建会话参数
    const sessionParams = {
        initialMessage: message
    }
    if (currentSession.value.sessionTitle === '新对话') {
        sessionParams.sessionTitle = `宁渡AI助手 - ${new Date().toLocaleString()}`
    } else {
        //如果又历史会话记录
        sessionParams.sessionTitle = currentSession.value.sessionTitle
    }
    //调用API创建新的会话
    startSession(sessionParams).then(res => {
        console.log("会话后端返回的数据", res)
        //将后端返回的数据转化为前端会话格式
        const sessionData = {
            sessionId: res.sessionId,
            status: res.status,
            sessionTitle: sessionParams.sessionTitle
        }
        //如果当前是临时会话，更新数据
        if (currentSession.value && currentSession.value.status === 'TEMP') {
            Object.assign(currentSession.value, sessionData)
        } else {
            currentSession.value = sessionData
        }

        //更新会话列表
        getSessionPage()
        //添加初始用户信息
        messages.value.push({
            id: Date.now(),
            senderType: 1,
            content: message,
            createdAt: new Date().toISOString(),
        })
        //流式对话
        startAIResponse(currentSession.value.sessionId, message)
    })   
}
//流式对话
const startAIResponse = (sessionId, userMessage) =>{
    if(isAiTyping.value){
        ElMessage.error('AI助手正在输入中，请稍等')

        return
    }
    //为什么要在这里设置isAiTyping为true？因为当用户发送消息后，AI助手需要一些时间来生成回复，在这个过程中我们希望禁用输入框和发送按钮，以防止用户在AI回复过程中发送多条消息，造成混乱。因此，在开始AI回复之前，我们将isAiTyping设置为true，表示AI正在输入状态。在AI回复完成后，我们会将isAiTyping设置回false，重新启用输入框和发送按钮。
    isAiTyping.value = true
    //在消息列表中添加一个占位的AI消息对象，用于显示AI正在输入的状态
    //之前message只有用户信息，没有AI信息，所以在用户发送消息后，我们需要在消息列表中添加一个占位的AI消息对象，这个对象的content属性为空，表示AI正在输入状态。当AI回复完成后，我们会更新这个占位对象的content属性，显示AI的回复内容。
    //toString(36)是将随机数转换为36进制字符串，substr(2,9)是从转换后的字符串中截取第3到第11个字符，作为消息ID的一部分，以确保每条消息都有一个唯一的ID。
    const ai_message = {
        id: `ai_${Date.now()}_${Math.random().toString(36).substr(2,9)}`,
        senderType: 2,
        content: '',
        createAt: new Date().toISOString(),
    }
    messages.value.push(ai_message)
    const ctrl = new AbortController() //终止fetch请求
    fetchEventSource('/api/psychological-chat/stream', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Token': localStorage.getItem('token'),
            'Accept': 'text/event-stream'
        },
        body: JSON.stringify({
            sessionId,
            userMessage
        }),
        signal: ctrl.signal,
        onopen: (response) => {
            //为什么是content-type，不应该是application/json吗？因为我们使用了fetchEventSource来处理服务器发送事件（SSE），服务器会以流式的方式发送数据，而不是一次性返回完整的JSON对象。因此，服务器会将响应的Content-Type设置为text/event-stream，表示这是一个事件流，而不是普通的JSON响应。在onopen回调中，我们检查响应头中的Content-Type是否为text/event-stream，以确保服务器正确地返回了流式数据。如果不是，我们就显示一个错误消息，提示用户服务器返回了非流式数据。
            //可是在headers中不是设置了'Accept': 'text/event-stream'，而不是'Content-Type'吗？是的，您说得对。在fetch请求中，我们设置了'Accept': 'text/event-stream'，这是告诉服务器我们希望接收流式数据。然而，在服务器响应时，它会设置Content-Type为text/event-stream来指示这是一个事件流。因此，在onopen回调中，我们检查的是response.headers.get('Content-Type')，而不是request headers中的Accept。我们需要确保服务器正确地返回了流式数据，以便fetchEventSource能够正确地处理和解析这些数据。
            if (response.headers.get('Content-Type') !== 'text/event-stream') {
                ElMessage.error('服务器返回非流式数据')
            }
        },
        onmessage: (event) =>{
            const raw = event.data.trim()
            if(!raw) return 
            const eventName = event.event
            //在这个函数中，我们首先获取消息内容并去除前后空格，如果消息内容为空，我们直接返回，不进行任何处理。然后，我们获取事件名称，如果事件名称是'done'，表示流式会话结束，我们将isAiTyping设置为false，并调用ctrl.abort()来终止请求，防止继续接收服务器发送的消息。如果事件名称不是'done'，我们将解析消息内容为JSON对象，并检查返回的状态码是否为200。如果状态码为200且数据中包含content属性，我们将AI消息对象的content属性更新为返回的内容，以显示AI的回复。如果状态码不为200，我们调用handleError函数来显示一个错误消息，提示用户AI助手回复失败。
            //message.value[message.value.length - 1]没看懂？？
            const aiMessage = messages.value[messages.value.length - 1]
            if(eventName === 'done'){
                //流式会话结束
                isAiTyping.value = false
                ctrl.abort() //终止请求
                //进行情绪分析
                loadSessionEmotion(currentSession.value.sessionId)
                return
            }
            const payload = JSON.parse(raw)
            const ok = String(payload.code) === '200'
            if(ok && payload.data && payload.data.content){
                // ❌ 错误：直接覆盖，会一段一段跳
                // aiMessage.content = payload.data.content
                // ✅ 正确：拼接内容，实现流式打字效果
                aiMessage.content += payload.data.content
            }else if(!ok){
                //错误回复显示
                handleError(payload.message || 'AI助手回复失败')
            }
        },
        onerror: (err) => {
            //在这个函数中，我们调用handleError函数来显示一个错误消息，提示用户AI助手回复失败。这个函数会在fetch请求发生错误时被触发，例如网络问题、服务器错误等。
            //为什么使用err.message，而不是err本身？因为err对象可能包含多个属性，例如message、name、stack等，而我们通常只关心错误的消息内容，因此使用err.message来获取错误的描述信息。如果err.message不存在，我们就直接使用err对象本身来显示错误消息，以确保用户能够看到错误的详细信息。
            // handleError(err.message || 'AI助手回复失败')
            handleError(err || 'AI助手回复失败')

        },
        onclose: () => {
            //开始情绪分析
            loadSessionEmotion(currentSession.value.sessionId)
        } 
    })
}
const  handleError = (error) => {
    //在这个函数中，我们首先获取消息列表中的最后一个消息对象，这个对象应该是我们之前添加的占位AI消息对象。如果这个对象存在，我们将它的content属性更新为一个错误提示消息，告诉用户AI助手回复失败。然后，我们将isAiTyping设置为false，表示AI不再输入状态。最后，我们使用Element Plus的ElMessage组件显示一个错误消息，提示用户AI助手回复失败。
    //这里的error没用，是不是可以删掉？是的，您说得对。在当前的handleError函数中，error参数没有被使用到，因此我们可以将其删除，以简化函数的定义和调用。删除后，函数将直接显示一个固定的错误消息，而不依赖于传入的error参数。这也使得函数更简洁和易于维护。
    const aiMessage = messages.value[messages.value.length - 1]
    if(aiMessage){
        aiMessage.content = 'AI助手回复失败，请稍后再试,对象存在'
    }
    isAiTyping.value = false
    ElMessage.error('AI助手回复失败，请稍后再试， 信息提示')
}

const getSessionPage = () => {
    const params = {
        pageNum: 1,
        pageSize: 10
    }
    getSessionList(params).then(res => {
        console.log("会话列表数据", res)
        sessionList.value = res.records
    })
}
//点击会话列表项时，切换到对应的会话
const handleSessionClick = (session) => {
    getSessionDetail(session.id).then(res => {
        console.log("会话详情数据", res)
        messages.value = res
    })

    //查看情绪花园后端返回数据
    //无法获取数据，为什么？？？？？？
    // if (currentSession.value && currentSession.value.sessionId) {
    //     loadSessionEmotion(currentSession.value.sessionId)
    // } else {
    //     console.log("当前无会话ID，无法获取情绪数据")
    // }
    loadSessionEmotion(session.id)

    //需要更新当前会话对象数据
    const sessionData = {
        sessionId: session.sessionId,
        status: 'ACTIVE',
        sessionTitle: session.sessionTitle
    }
    currentSession.value = sessionData

    

}
const handleSessionDelete = (sessionId) => {
    //删除会话的逻辑
    deleteSession(sessionId).then(res => {
        ElMessage.success('会话删除成功')
        //如果删除的会话是当前会话，重置当前会话为null
        if (currentSession.value && currentSession.value.sessionId === sessionId) {
            currentSession.value = null
        }
        //刷新会话列表
        getSessionPage()
        //浏览器自动刷新页面
        location.reload()
    }).catch(err => {
        ElMessage.error('删除会话失败，请稍后再试')
    })
}

const formatMessageContent = (content) => {
    //对消息内容进行格式化处理，例如将换行符转换为HTML的换行标签
    return content.replace(/\n/g, '<br>')
}

onMounted(() => {
    getSessionPage()
    //页面加载时创建一个新的会话
    createNewFrontendSession()
    
    //加上这段代码，一点击AI咨询界面，直接给你浏览器缓存的token和userSessionId都给清除了，就跳转到登录界面，永远无法点击AI咨询界面？？？？为什么？？
    // if (currentSession.value?.sessionId) {
    //     loadSessionEmotion(currentSession.value.sessionId);
    // } else {
    //     console.log("当前无会话ID，无法获取情绪数据");
    // }

})
</script>

<style lang="scss" scoped>
.consultation-container {
    margin: 0 auto;
    width: 1200px;
    display: flex;
    gap: 20px;
    padding: 20px;

    .sidebar {
        width: 320px;

        .ai-assistant-info {
            margin-bottom: 20px;
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 252, 248, 0.95) 100%);
            border-radius: 16px;
            padding: 16px;
            box-shadow: 0 8px 32px rgba(251, 146, 60, 0.06), 0 2px 8px rgba(0, 0, 0, 0.04);
            border: 1px solid rgba(251, 146, 60, 0.08);
            backdrop-filter: blur(10px);
            transition: all 0.3s ease;

            .breathing-circle {
                width: 60px;
                height: 60px;
                background: linear-gradient(135deg, #fb923c 0%, #f59e0b 100%);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto 12px;
                animation: breathing 4s ease-in-out infinite;
                box-shadow: 0 6px 24px rgba(251, 146, 60, 0.25);
                position: relative;
            }

            .assistant-name {
                font-size: 16px;
                font-weight: 700;
                background: linear-gradient(135deg, #fb923c, #f59e0b);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                text-align: center;
                background-clip: text;
                margin: 0 0 12px;
            }

            .online-status {
                display: flex;
                align-items: center;
                justify-content: center;
                color: #059669;
                font-size: 12px;
                font-weight: 600;

                .status-dot {
                    width: 8px;
                    height: 8px;
                    background: #059669;
                    border-radius: 50%;
                    margin-right: 8px;
                    animation: pulse 2s infinite;
                    box-shadow: 0 0 8px rgba(5, 150, 105, 0.4);
                }
            }
        }

        .session-history {
            background: white;
            border-radius: 16px;
            padding: 16px;
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
            margin-bottom: 20px;
            min-height: 250px;
            display: flex;
            flex-direction: column;

            .section-title {
                font-size: 16px;
                font-weight: 600;
                color: #333;
                margin: 0 0 16px;
                display: flex;
                align-items: center;
                justify-content: space-between;

            }

            .session-list {
                overflow-y: auto;
                max-height: 200px;
                scrollbar-width: thin;
                scrollbar-color: rgba(64, 150, 255, 0.3) transparent;

                .session-item {
                    position: relative;
                    display: flex;
                    align-items: flex-start;
                    gap: 12px;
                    padding: 12px;
                    margin-bottom: 8px;
                    border-radius: 12px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    border: 2px solid transparent;

                    &:hover {
                        background: #f8f9ff;
                        border-color: #e6f0ff;
                    }

                    &.active {
                        background: #e6f0ff;
                        border-color: #4096ff;
                    }

                    .session-info {
                        flex: 1;

                        .session-title {
                            font-weight: 500;
                            font-size: 14px;
                            color: #333;
                            margin-bottom: 4px;
                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;

                            .session-meta {
                                display: flex;
                                align-items: center;
                                gap: 8px;
                                margin-bottom: 6px;

                                .session-time {
                                    font-size: 12px;
                                    color: #999;
                                }
                            }

                            .session-preview {
                                width: 200px;
                                font-size: 12px;
                                color: #666;
                                margin-bottom: 6px;
                                white-space: nowrap;
                                overflow: hidden;
                                text-overflow: ellipsis;
                            }

                            .session-stats {
                                display: flex;
                                align-items: center;
                                gap: 12px;

                                span {
                                    font-size: 12px;
                                    color: #999;
                                    display: flex;
                                    align-items: center;
                                    gap: 4px;
                                }
                            }
                        }

                        .session-actions {
                            position: absolute;
                            top: 10px;
                            right: 12px;
                        }
                    }
                }

                .no-sessions-text {
                    text-align: center;
                    font-size: 14px;
                    color: #999;
                }
            }
        }

        .emotion-garden {
            background: linear-gradient(135deg, #fef9e7 0%, #fcf4e6 50%, #f6f0e8 100%);
            border-radius: 20px;
            padding: 16px;
            margin-bottom: 20px;
            box-shadow: 0 8px 32px rgba(252, 244, 230, 0.8);
            border: 1px solid rgba(255, 255, 255, 0.2);
            position: relative;
            overflow: hidden;
            min-height: 300px;

            .garden-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 20px;
                position: relative;
                z-index: 2;

                .garden-title {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 16px;
                    font-weight: 600;
                    color: #8b4513;
                }
            }

            .emotion-info {
                margin: 0 auto;
                width: 80px;
                height: 80px;
                border-radius: 50%;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                z-index: 10;
                box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
                border: 2px solid rgba(255, 255, 255, 0.8);
                background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%);
                color: #fff;

                .emotion-name {
                    font-size: 15px;
                    font-weight: 600;
                    line-height: 1;
                    margin-bottom: 2px;
                }

                .emotion-score {
                    font-size: 14px;
                    font-weight: 700;
                    opacity: 0.9;
                }
            }

            .warm-tips {
                text-align: center;
                margin-bottom: 16px;

                .emotion-status-text {
                    margin-bottom: 12px;

                    .status-label {
                        font-size: 14px;
                        color: #8b7355;
                        margin-right: 8px;
                    }

                    .status-emotion {
                        font-size: 16px;
                        font-weight: 600;
                        padding: 4px 12px;
                        border-radius: 16px;
                        display: inline-block;
                    }
                }

                .emotion-intensity {
                    margin-bottom: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;

                    .intensity-dots {
                        display: flex;
                        gap: 4px;

                        .dot {
                            width: 8px;
                            height: 8px;
                            border-radius: 50%;
                            background: #e0e0e0;
                            transition: all 0.3s ease;

                            &.active {
                                background: linear-gradient(135deg, #ff9a9e, #fecfef);
                                transform: scale(1.2);
                                box-shadow: 0 2px 8px rgba(255, 154, 158, 0.4);
                            }
                        }
                    }

                    .intensity-text {
                        font-size: 12px;
                        color: #8b7355;
                        font-weight: 500;
                    }
                }

                .warm-suggestion {
                    background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.8));
                    border-radius: 16px;
                    padding: 12px;
                    margin-bottom: 16px;
                    display: flex;
                    align-items: flex-start;
                    gap: 10px;
                    border: 1px solid rgba(255, 255, 255, 0.6);
                    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);

                    .suggestion-icon {
                        font-size: 20px;
                        flex-shrink: 0;
                        margin-top: 2px;
                    }

                    .suggestion-content {
                        text-align: left;
                        flex: 1;

                        .suggestion-title {
                            font-size: 14px;
                            font-weight: 600;
                            color: #8b7355;
                            margin-bottom: 6px;
                        }

                        .suggestion-text {
                            font-size: 13px;
                            color: #6b5b47;
                            line-height: 1.5;
                        }
                    }
                }

                .healing-actions {
                    margin-bottom: 16px;

                    .actions-title {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 8px;
                        font-size: 14px;
                        font-weight: 600;
                        color: #8b7355;
                        margin-bottom: 16px;
                    }

                    .actions-list {
                        display: flex;
                        flex-direction: column;
                        gap: 10px;

                        .action-item {
                            background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7));
                            border-radius: 12px;
                            padding: 12px;
                            display: flex;
                            align-items: center;
                            gap: 10px;
                            border: 1px solid rgba(255, 255, 255, 0.5);
                            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
                            text-align: left;

                            .action-icon {
                                font-size: 14px;
                                color: #ffd700;
                                flex-shrink: 0;
                            }

                            .action-text {
                                font-size: 12px;
                                color: #6b5b47;
                                line-height: 1.4;
                                flex: 1;
                            }
                        }
                    }
                }

                .risk-notice {
                    background: linear-gradient(135deg, #fff9e6, #ffeaa7);
                    border-radius: 16px;
                    padding: 16px;
                    display: flex;
                    align-items: flex-start;
                    gap: 12px;
                    border: 1px solid rgba(255, 234, 167, 0.6);
                    box-shadow: 0 6px 20px rgba(255, 234, 167, 0.3);

                    .notice-icon {
                        font-size: 20px;
                        flex-shrink: 0;
                        margin-top: 2px;
                    }

                    .notice-content {
                        flex: 1;

                        .notice-title {
                            font-size: 14px;
                            font-weight: 600;
                            color: #d4840f;
                            margin-bottom: 6px;
                        }

                        .notice-text {
                            font-size: 13px;
                            color: #b8740c;
                            line-height: 1.5;
                        }
                    }
                }
            }
        }
    }

    .chat-main {
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 252, 250, 0.98) 100%);
        border-radius: 20px;
        box-shadow: 0 12px 40px rgba(251, 146, 60, 0.08), 0 4px 16px rgba(0, 0, 0, 0.04);
        border: 1px solid rgba(251, 146, 60, 0.1);
        backdrop-filter: blur(10px);
        display: flex;
        flex-direction: column;
        overflow: hidden;
        flex: 1;

        .chat-header {
            background: linear-gradient(135deg, #fb923c 0%, #f59e0b 100%);
            color: white;
            padding: 20px 24px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            position: relative;
            flex-shrink: 0;

            .header-left {
                display: flex;
                align-items: center;

                .chat-avatar {
                    width: 48px;
                    height: 48px;
                    background: rgba(255, 255, 255, 0.25);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-right: 16px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                    position: relative;
                    z-index: 1;
                }

                .chat-info {
                    h2 {
                        font-size: 20px;
                        font-weight: 700;
                        margin-bottom: 4px;
                    }

                    p {
                        font-size: 14px;
                    }
                }
            }
        }

        .chat-messages {
            flex: 1;
            overflow-y: auto;
            padding: 24px;
            display: flex;
            flex-direction: column;
            gap: 16px;
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 252, 248, 0.05) 100%);
            min-height: 0;
            max-height: calc(100vh - 200px);
            scrollbar-width: thin;
            scrollbar-color: rgba(251, 146, 60, 0.3) transparent;

            .message-item {
                display: flex;
                align-items: flex-start;
                gap: 12px;

                .message-avatar {
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 14px;
                    color: white;
                    flex-shrink: 0;
                }

                &.ai-message {
                    .message-avatar {
                        background: linear-gradient(135deg, #fb923c, #f59e0b);
                        box-shadow: 0 4px 12px rgba(251, 146, 60, 0.3);
                    }
                }

                &.user-message {
                    .message-avatar {
                        background: linear-gradient(135deg, #6b7280, #4b5563);
                        box-shadow: 0 4px 12px rgba(107, 114, 128, 0.3);
                    }
                }

                .message-content {
                    max-width: 70%;

                    .message-bubble {
                        background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 252, 248, 0.95) 100%);
                        border-radius: 16px;
                        padding: 12px 16px;
                        position: relative;
                        animation: fadeInUp 0.4s ease-out;
                        border: 1px solid rgba(251, 146, 60, 0.1);
                        box-shadow: 0 4px 16px rgba(251, 146, 60, 0.05);

                        .typing-indicator {
                            display: flex;
                            gap: 4px;
                            padding: 8px 0;

                            .typing-dot {
                                width: 8px;
                                height: 8px;
                                background: #ccc;
                                border-radius: 50%;
                                animation: typing 1.5s ease-in-out infinite;

                                &:nth-child(2) {
                                    animation-delay: 0.2s;
                                }

                                &:nth-child(3) {
                                    animation-delay: 0.4s;
                                }
                            }
                        }

                        /* 错误消息样式 */
                        .error-message {
                            background: linear-gradient(135deg, #FEF2F2 0%, #FECACA 100%);
                            border: 1px solid #F87171;
                            border-radius: 12px;
                            padding: 12px 16px;
                            color: #991B1B;
                            font-weight: 500;
                            display: flex;
                            align-items: center;
                            gap: 8px;
                        }
                    }

                    .message-time {
                        font-size: 12px;
                        color: #999;
                        margin-top: 4px;
                    }
                }
            }
        }

        .chat-input {
            border-top: 1px solid rgba(251, 146, 60, 0.1);
            padding: 20px 24px;
            display: flex;
            gap: 12px;
            align-items: flex-end;
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.5) 0%, rgba(255, 252, 248, 0.7) 100%);
            backdrop-filter: blur(10px);
            flex-shrink: 0;

            .input-container {
                flex: 1;
            }

            .input-footer {
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: 12px;
                color: #78716c;
                font-weight: 500;
            }

            .send-btn {
                height: 60px;
                width: 60px;
                border-radius: 16px;
                background: linear-gradient(135deg, #fb923c 0%, #f59e0b 100%) !important;
                border: none !important;
                box-shadow: 0 6px 20px rgba(251, 146, 60, 0.25);
                transition: all 0.3s ease;
            }

        }

    }
}
</style>
