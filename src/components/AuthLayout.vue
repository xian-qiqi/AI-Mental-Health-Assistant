<template>
    <div class="auth-layout">
        <!-- 左侧品牌区域 - 在小屏幕时隐藏 -->
        <div class="left-section">
            <div class="content">
                <h2 class="title">心理AI助手</h2>
                <p class="text">每个深夜，每个焦虑的时刻，我们都在这里。不必独自承受，让心与心的连接温暖您的每一天</p>
                <div class="robot">
                    <el-image style="width: 90px;height: 90px" :src="iconUrl" alt="心理AI助手"/>
                </div>
            </div> 
        </div>

        <!-- 右侧表单区域 - 在小屏幕时全屏显示 -->
        <div class="right-section">
            <router-view></router-view>
        </div>
    </div>
</template>

<script setup>
const iconUrl = new URL('../assets/images/robot-fill.png', import.meta.url).href
</script>

<style lang="scss" scoped>
.auth-layout {
    display: flex;
    min-height: 100vh;
    
    .left-section {
        display: flex;
        justify-content: center;
        align-items: center;
        flex: 1;
        background: linear-gradient(90deg, rgb(74, 156, 140) 0%, rgb(61, 138, 122) 100%) rgba(74, 156, 140, 0.95);
        min-height: 100vh;
        
        .content {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 20px;
            
            .title {
                margin-bottom: 20px;
                font-size: 40px;
                font-weight: bold;
                color: #fff;
                text-align: center;
            }
            
            .text {
                margin-bottom: 20px;
                font-size: 20px;
                color: #fff;
                text-align: center;
                line-height: 1.6;
                max-width: 400px;
            }
            
            .robot {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 160px;
                height: 160px;
                border-radius: 50%;
                border: 2px solid rgba(255, 255, 255, 0.2);
                background: linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%);
                box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.3);
            }
        }
    }
    
    .right-section {
        display: flex;
        justify-content: center;
        align-items: center;
        flex: 1;
        min-height: 100vh;
        background-color: #fff;
        padding: 20px;
    }
}

// 平板设备响应式
@media (max-width: 1024px) {
    .auth-layout {
        .left-section {
            .content {
                .title {
                    font-size: 32px;
                }
                
                .text {
                    font-size: 18px;
                }
                
                .robot {
                    width: 140px;
                    height: 140px;
                }
            }
        }
    }
}

// 移动设备响应式 - 隐藏左侧区域，全屏显示表单
@media (max-width: 768px) {
    .auth-layout {
        .left-section {
            display: none;
        }
        
        .right-section {
            flex: 1;
            width: 100%;
            padding: 15px;
            align-items: flex-start;
            padding-top: 40px;
        }
    }
}

// 小屏移动设备优化
@media (max-width: 480px) {
    .auth-layout {
        .right-section {
            padding: 10px;
            padding-top: 20px;
            align-items: center;
        }
    }
}
</style>