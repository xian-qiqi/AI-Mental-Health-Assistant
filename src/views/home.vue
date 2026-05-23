<template>
    <div class="home-container">
        <div class="content">
            <div class="text">
                <h2 class="title">
                    一次温暖的对话<br>
                    <span class="highlight-text">化孤独为慰藉</span>
                </h2>
                <p class="description">每个深夜，每个焦虑的时刻，我们都在这里。不必独自承受，让心与心的连接温暖您的每一天</p>
                <div class="hero-actions">
                    <el-button size="large" class="action-btn" @click="router.push('/consulation')">开始倾诉，获得陪伴</el-button>
                    <el-button size="large" class="action-btn secondary-btn" @click="router.push('/emotion-diary')">记录心情，释放感情</el-button>
                </div>
            </div>
            

            <div class="robot">
                <el-image style="width: 150px; height: 150px;" :src="iconUrl" class="robot-image"/>
            </div>
        </div>    
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router'
const router = useRouter()
const iconUrl = new URL('../assets/images/robot-fill.png',import.meta.url).href
</script>

<style lang="scss" scoped>
.home-container {
    background: linear-gradient(90deg, rgb(74, 156, 140) 0%, rgb(61, 138, 122) 100%) rgba(74, 156, 140, 0.95);
    color: white;
    padding: 5rem 20px;
    min-height: 100%;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;

    .content {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 30px;
        max-width: 1200px;
        width: 100%;
        padding: 0 20px;

        .text {
            width: 500px;
            flex: 1;

            .title {
                font-size: 45px;
                font-weight: bold;
                margin-bottom: 15px;
                line-height: 1.3;

                .highlight-text {
                    color: #ffd700;
                }
            }

            .description {
                font-size: 18px;
                line-height: 1.6;
                margin-bottom: 30px;
                opacity: 0.95;
            }

            .hero-actions {
                margin-top: 30px;
                display: flex;
                gap: 15px;
                flex-wrap: wrap;
                
                .action-btn {
                    min-height: 48px;
                    padding: 12px 24px;
                    font-size: 16px;
                    border-radius: 8px;
                    transition: all 0.3s;
                    
                    &:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
                    }
                    
                    &.secondary-btn {
                        background: transparent;
                        border: 2px solid white;
                        color: white;
                        
                        &:hover {
                            background: rgba(255, 255, 255, 0.1);
                        }
                    }
                }
            }
        }

        .robot {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 260px;
            height: 260px;
            border-radius: 50%;
            border: 2px solid rgba(255, 255, 255, 0.2);
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%);
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.3);
            flex-shrink: 0;
            
            .robot-image {
                width: 150px;
                height: 150px;
                object-fit: contain;
            }
        }
    }
}

// 平板设备
@media (max-width: 1024px) {
    .home-container {
        padding: 4rem 15px;
        
        .content {
            gap: 20px;
            
            .text {
                width: 450px;
                
                .title {
                    font-size: 38px;
                }
                
                .description {
                    font-size: 16px;
                }
            }
            
            .robot {
                width: 220px;
                height: 220px;
                
                .robot-image {
                    width: 120px;
                    height: 120px;
                }
            }
        }
    }
}

// 移动设备
@media (max-width: 768px) {
    .home-container {
        padding: 3rem 15px;
        min-height: 100%;
        
        .content {
            flex-direction: column-reverse;
            text-align: center;
            gap: 30px;
            
            .text {
                width: 100%;
                
                .title {
                    font-size: 32px;
                    margin-bottom: 12px;
                }
                
                .description {
                    font-size: 15px;
                    margin-bottom: 25px;
                }
                
                .hero-actions {
                    justify-content: center;
                    flex-direction: column;
                    width: 100%;
                    max-width: 300px;
                    margin: 0 auto;
                    
                    .action-btn {
                        width: 100%;
                    }
                }
            }
            
            .robot {
                width: 180px;
                height: 180px;
                
                .robot-image {
                    width: 100px;
                    height: 100px;
                }
            }
        }
    }
}

// 小屏移动设备
@media (max-width: 480px) {
    .home-container {
        padding: 2rem 10px;
        
        .content {
            .text {
                .title {
                    font-size: 26px;
                }
                
                .description {
                    font-size: 14px;
                }
                
                .hero-actions {
                    .action-btn {
                        font-size: 14px;
                        padding: 10px 20px;
                    }
                }
            }
            
            .robot {
                width: 150px;
                height: 150px;
                
                .robot-image {
                    width: 80px;
                    height: 80px;
                }
            }
        }
    }
}
</style>