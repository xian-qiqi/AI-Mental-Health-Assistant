import service from "../utils/requist";

export function login(data) {
    return service.post('/user/login',data)
}
//用户Knowledge.vue
export function categoryTree() {
    return service.get('/knowledge/category/tree')
}
//用于Knowledge.vue
export function articlePage(params) {
    return service.get('/knowledge/article/page', {params})

}
//用于ArticleDIalog.vue
export function uploadFile(file, businessInfo) {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('businessType', 'ARTICLE')
    formData.append('businessId', businessInfo.businessId)
    formData.append('businessField', 'cover')
    return service.post('/file/upload', formData, {
        headers: {
            "Content-Type": 'multipart/form-data'
        }
    })

}
//用于ArticleDIalog.vue
export function createArticle(data) {
    return service.post('/knowledge/article', data)

}
//用于Knowledge.vue
export function getArticlDetail(id) {
    return service.get(`/knowledge/article/${id}`)

}
//用于Knowledge.vue
export function updataArticle(id, data) {
    return service.put(`/knowledge/article/${id}`, data)

}
//用于Knowledge.vue
export function changeArticleStatus(id, status) {
    return service.put(`/knowledge/article/${id}/status`, status)

}
//用于Knowledge.vue
export function deleteArticle(id) {
    return service.delete(`/knowledge/article/${id}`)

}
//用于Consultations.vue
export function getConsultationPage(params) {
    return service.get(`/psychological-chat/sessions`, {params})

}
//用于Consultations.vue
export function getSessionDetail(sessionId) {
    return service.get(`/psychological-chat/sessions/${sessionId}/messages`)

}
//用于Emotional.vue
export function getEmotionPage(params) {
    return service.get(`/emotion-diary/admin/page`, {params})

}
//用于Emotional.vue
export function deleteEmotional(id) {
    return service.delete(`/emotion-diary/admin/${id}`)

}
//Dashboard.vue
export function getAnalyticsOverview(params) {
    return service.get(`/data-analytics/overview`, {params})

}
//Navbar.vue
export function logout() {
    return service.post(`/user/logout`)

}

