<template>
    <div class="emotionDiary-container">
        <div class="header-section">
            <div class="header-content">
                <el-image :src="iconUrl" style="width: 60px; height: 60px;" alt="情绪日志" />
                <h1>情绪日志</h1>
            </div>
        </div>
        <div class="content">
            <!-- 情绪评分 -->
            <div class="diary-card">
                <div class="title">今日情绪评分</div>
                <div class="section">
                    <p>您今天的只能整体情绪状态如何？</p>
                    <div class="rate">
                        <!-- :texts是什么? -->
                        <el-rate 
                            v-model="diaryForm.moodScore" 
                            :texts="emotionStatus"    
                            show-text
                            :max="10"
                            size="large"
                        />
                    </div>
                </div>
            </div>
            <!-- 主要情绪 -->
            <div class="diary-card">
                <div class="title">主要情绪</div>
                <div class="emotion-grid">
                    <div class="emotion-card" v-for="emotion in emotionOptions" :key="emotion.name" @click="selectEmotion(emotion.name)" :class="{'selected': emotion.name===diaryForm.dominantEmotion}">
                        <el-image :src="emotion.url" style="width: 50px; height: 50px;" />
                        <div class="emotion-name">{{ emotion.name }}</div>
                    </div>
                </div>
            </div>
            <!-- 详细记录 -->
            <div class="diary-card">
                <div class="title">详细记录</div>
                <div class="detail-form">
                    <div class="form-group">
                        <div class="form-label">情绪触发因素</div>
                        <el-input v-model="diaryForm.emotionTriggers" type="textarea" placeholder="今天什么事情影响了你的情绪？" :rows="3" maxlength="1000" show-word-limit />
                    </div>
                    <div class="form-group">
                        <div class="form-label">今日感想</div>
                        <el-input v-model="diaryForm.diaryContent" type="textarea" placeholder="写下您今日的想法、感受或发生的有趣事情..." :rows="5" maxlength="2000" show-word-limit />
                    </div>
                    <!-- 生活指标 -->
                    <div class="life-indicators">
                        <div class="indicator-group">
                            <div class="form-label">睡眠质量</div>
                            <el-select v-model="diaryForm.sleepQuality" placeholder="请选择">
                                <el-option label="很差" value="1" />
                                <el-option label="较差" value="2" />
                                <el-option label="一般" value="3" />
                                <el-option label="良好" value="4" />
                                <el-option label="优秀" value="5" />
                            </el-select>
                        </div>
                        <div class="indicator-group">
                            <div class="form-label">压力水平</div>
                            <el-select v-model="diaryForm.stressLevel" placeholder="请选择">
                                <el-option label="很低" value="1" />
                                <el-option label="较低" value="2" />
                                <el-option label="中等" value="3" />
                                <el-option label="较高" value="4" />
                                <el-option label="很高" value="5" />
                            </el-select>
                        </div>
                    </div>
                    <!-- 按钮区域 -->
                    <div class="action-buttons">
                        <el-button @click="resetForm">重置</el-button>
                        <el-button type="primary" @click="submitForm">提交记录</el-button>        
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, reactive } from 'vue'
import { dayjs, ElMessage, selectEmits } from 'element-plus'
import { addEmotionDiary } from '../api/fronted'

const iconUrl = new URL('../assets/images/like.png', import.meta.url).href

//情绪状态
const emotionStatus = ['绝望崩溃', '消沉抑郁', '焦虑烦躁', '低落不悦', '平静淡然', '轻松惬意', '愉悦舒心', '欢欣满足', '兴奋欣喜', '极致幸福']
//情绪选项
const emotionOptions = [
    {name:'开心', url: new URL('../assets/images/开心.png', import.meta.url).href},
    {name:'平静', url: new URL('../assets/images/平静.png', import.meta.url).href},
    {name:'焦虑', url: new URL('../assets/images/焦虑.png', import.meta.url).href},
    {name:'悲伤', url: new URL('../assets/images/悲伤.png', import.meta.url).href},
    {name:'兴奋', url: new URL('../assets/images/兴奋.png', import.meta.url).href},
    {name:'疲惫', url: new URL('../assets/images/疲惫.png', import.meta.url).href},
    {name:'惊讶', url: new URL('../assets/images/惊讶.png', import.meta.url).href},
    {name:'困惑', url: new URL('../assets/images/困惑.png', import.meta.url).href},
]
const diaryForm = reactive({
    "diaryDate": dayjs().format('YYYY-MM-DD'),
    "moodScore": null,
    "dominantEmotion": '',
    "emotionTriggers": '',
    "diaryContent": '',
    "sleepQuality": null,
    "stressLevel": null
})
const selectEmotion = (emotion) => {
    diaryForm.dominantEmotion = emotion
}
const resetForm = () => {
    Object.assign(diaryForm, {
        diaryDate: dayjs().format('YYYY-MM-DD'),
        moodScore: null,
        dominantEmotion: '',
        emotionTriggers: '',
        diaryContent: '',
        sleepQuality: null,
        stressLevel: null
    })
    //为什么使用Object.assign而不是直接赋值？因为diaryForm是一个reactive对象，直接赋值会导致响应式丢失，而Object.assign可以保持响应式的特性。
//     diaryForm.moodScore = null
//     diaryForm.dominantEmotion = ''
//     diaryForm.emotionTriggers = ''
//     diaryForm.diaryContent = ''
//     diaryForm.sleepQuality = null
//     diaryForm.stressLevel = null
}
const submitForm = () => {
    console.log("提交的情绪日志数据", diaryForm)
    //这里可以添加表单验证和提交逻辑，例如调用API接口将数据发送到后端
    if(!diaryForm.moodScore) {
        ElMessage.error('请选择情绪评分')
        return
    }
    addEmotionDiary(diaryForm).then(res => {
        console.log("提交情绪日志接口返回", res)
        ElMessage.success('情绪日志提交成功')
        resetForm()
    })
}
</script>

<style lang="scss" scoped>
.emotionDiary-container {
    background: linear-gradient(135deg, #fafbfc 0%, #f7f9fc 50%, #f2f6fa 100%);
    min-height: 100vh;

    .header-section {
        background: linear-gradient(135deg, #7ED321 0%, #F5A623 100%);
        color: white;
        padding: 48px 20px;

        .header-content {
            display: flex;
            align-items: center;
            gap: 12px;
            max-width: 980px;
            margin: 0 auto;
            
            h1 {
                font-size: 28px;
                font-weight: 600;
            }
        }
    }

    .content {
        margin: 0 auto;
        width: 100%;
        max-width: 980px;
        padding: 20px;

        .diary-card {
            margin-bottom: 20px;
            background: white;
            border-radius: 10px;
            padding: 20px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);

            .title {
                margin-bottom: 20px;
                font-size: 25px;
                font-weight: 600;
                color: #374151;
            }

            .section {
                margin-bottom: 20px;

                p {
                    font-size: 15px;
                    color: #6B7280;
                    margin-bottom: 15px;
                }
            }

            .emotion-grid {
                display: flex;
                flex-wrap: wrap;
                gap: 10px;

                .emotion-card {
                    padding: 15px;
                    border: 2px solid #E5E7EB;
                    border-radius: 15px;
                    text-align: center;
                    cursor: pointer;
                    background: #F9FAFB;
                    transition: all 0.3s ease;

                    .emotion-name {
                        margin-top: 10px;
                        padding: 0 20px;
                        color: #374151;
                        font-size: 14px;
                    }

                    &.selected {
                        border-color: #7ED321;
                        background: #F0FDF4;
                        transform: translateY(-3px);
                        box-shadow: 0 4px 12px rgba(126, 211, 33, 0.2);
                    }
                    
                    &:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                    }
                }
            }

            .detail-form {
                .form-label {
                    margin: 10px 0;
                    color: #374151;
                    font-weight: 500;
                }

                .life-indicators {
                    display: flex;
                    gap: 20px;

                    .indicator-group {
                        flex: 1;
                    }
                }

                .action-buttons {
                    margin-top: 40px;
                    display: flex;
                    gap: 15px;
                    justify-content: flex-end;
                }
            }
        }
    }
}

// 平板设备
@media (max-width: 1024px) {
    .emotionDiary-container {
        .header-section {
            padding: 40px 20px;
            
            .header-content {
                h1 {
                    font-size: 24px;
                }
            }
        }
        
        .content {
            padding: 15px;
            
            .diary-card {
                padding: 18px;
                
                .title {
                    font-size: 22px;
                }
                
                .emotion-grid {
                    .emotion-card {
                        padding: 12px;
                        
                        .emotion-name {
                            font-size: 13px;
                        }
                    }
                }
            }
        }
    }
}

// 移动设备
@media (max-width: 768px) {
    .emotionDiary-container {
        .header-section {
            padding: 30px 15px;
            
            .header-content {
                gap: 8px;
                
                h1 {
                    font-size: 20px;
                }
            }
        }
        
        .content {
            padding: 15px;
            
            .diary-card {
                padding: 15px;
                margin-bottom: 15px;
                
                .title {
                    font-size: 18px;
                    margin-bottom: 15px;
                }
                
                .section {
                    p {
                        font-size: 14px;
                    }
                    
                    .rate {
                        display: flex;
                justify-content: center;
                    }
                }
                
                .emotion-grid {
                    gap: 8px;
                    justify-content: center;
                    
                    .emotion-card {
                        padding: 10px;
                        width: calc(50% - 4px);
                        
                        .emotion-name {
                            font-size: 12px;
                            padding: 0 10px;
                        }
                    }
                }
                
                .detail-form {
                    .life-indicators {
                        flex-direction: column;
                        gap: 15px;
                    }
                    
                    .action-buttons {
                        flex-direction: column;
                        
                        .el-button {
                            width: 100%;
                        }
                    }
                }
            }
        }
    }
}

// 小屏移动设备
@media (max-width: 480px) {
    .emotionDiary-container {
        .header-section {
            padding: 20px 10px;
            
            .header-content {
                h1 {
                    font-size: 18px;
                }
            }
        }
        
        .content {
            padding: 10px;
            
            .diary-card {
                padding: 12px;
                
                .title {
                    font-size: 16px;
                }
                
                .emotion-grid {
                    gap: 6px;
                    
                    .emotion-card {
                        padding: 8px;
                        width: calc(50% - 3px);
                        
                        .emotion-name {
                            font-size: 11px;
                        }
                    }
                }
                
                .detail-form {
                    .form-label {
                        font-size: 14px;
                    }
                }
            }
        }
    }
}
</style>