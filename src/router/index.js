import { createRouter, createWebHistory } from "vue-router";
import BackendLayout from "../components/BackendLayout.vue";
import Dashboard from "../views/Dashboard.vue";
import Knowledge from "../views/Knowledge.vue";
import Consultations from "../views/Consultations.vue";
import Emotional from "../views/Emotional.vue";
import Authlayout from "../components/Authlayout.vue";
import login from "../views/login.vue";
import register from "../views/register.vue";
import FrontendLayout from "../components/FrontendLayout.vue";
import consulation from "../views/consulation.vue";
import emotionDiary from "../views/emotionDiary.vue";
import frontendKnowledge from "../views/frontendKnowledge.vue";
import home from "../views/home.vue";
import article from "../views/article.vue";

//路由配置---后台路由
const backendRoutes = [
    {
        path: '/back',
        redirect: '/back/dashboard',
        component: BackendLayout,
        children: [
            {
                path: 'dashboard',
                component: Dashboard,
                meta: {
                    title: '数据分析',
                    // icon: '<el-icon><PieChart /></el-icon>'
                    icon: 'PieChart'

                }
            },
            {
                path: 'knowledge',
                component: Knowledge,
                meta: {
                    title: '知识文章',
                    // icon: '<el-icon><PieChart /></el-icon>'
                    icon: 'ChatLineSquare'

                }
            },
            {
                path: 'consultations',
                component: Consultations,
                meta: {
                    title: '咨询记录',
                    // icon: '<el-icon><PieChart /></el-icon>'
                    icon: 'Message'

                }
            },
            {
                path: 'emotional',
                component: Emotional,
                meta: {
                    title: '情绪日志',
                    // icon: '<el-icon><PieChart /></el-icon>'
                    icon: 'User'

                }
            }
        ]
    },
    {
        path: '/auth',
        component: Authlayout,
        children: [
            {
                path: 'login',
                component: login,
                meta: {
                    title: '登录'
                }
            },
            {
                path: 'register',
                component: register,
                meta: {
                    title: '注册'
                }
            }
        ]
    }
]
//前台路由
const frontendRoutes = [
    {
        path: '/',
        component: FrontendLayout,
        children: [
            {
                path: '',
                component: home,

            },
            {
                path: 'consulation',
                component: consulation,

            },
            {
                path: 'emotion-diary',
                component: emotionDiary,

            },
            {
                path: 'knowledge',
                component: frontendKnowledge,

            },
            {
                path: 'knowledge/article/:id',
                component: article,
                props: true// props: (route) => ({ id: route.params.id }) //将路径参数id作为组件的props传递给article.vue组件，这样在article.vue组件中就可以直接使用defineProps来接收参数了
            },
        ]
    },

]
const router = createRouter({
    history: createWebHistory(),
    routes: [...backendRoutes, ...frontendRoutes]
})

//路由的前置守卫
router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token');
    if (token) {

        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        //如果是后台用户，直接进入目标路由
        if (userInfo.userType === 2) {
            if (to.path.startsWith('/back') || to.path.startsWith('/auth')) {
                next();
            } else {
                router.push('/back/dashboard'); //重定向到后台首页
            }
            //如果是前台用户，允许访问认证相关的路由，但不允许访问后台路由
        } else if (userInfo.userType === 1) {
            // 用户端账户只能访问前台路由
            // 不能访问后台路由和登录注册页面，重定向到前台首页
            if (to.path.startsWith('/back') || to.path.startsWith('/auth')) {
                next('/')
            } else {
                next()
            }
        }
    } else {
        //如果没有登录，判断目标路由是否需要认证
        if (to.path.startsWith('/back')) {
            //如果访问后台页面，重定向到登录页
            next('/auth/login');
        } else {
            //其他页面直接进入
            next();
        }

    }
})
export default router