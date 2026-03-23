import service from "../utils/requist";
//用于register.vue
export function register(data) {
    return service.post('/user/add', data)
}
//consulation.vue
export function startSession(data) {
    return service.post('/psychological-chat/session/start', data)
}
//consulation.vue
export function getSessionList(params) {
    return service.get('/psychological-chat/sessions', {params})
}

//consulation.vue
export function deleteSession(sessionId) {
    return service.delete(`/psychological-chat/sessions/${sessionId}`)
}
//consulation.vue
export function getSessionDetail(sessionId) {
    return service.get(`/psychological-chat/sessions/${sessionId}/messages`)
}
//consulation.vue
export function getSessionEmotion(sessionId) {
    return service.get(`/psychological-chat/session/${sessionId}/emotion`)
}
//emotion-diary.vue
export function addEmotionDiary(data) {
    return service.post('/emotion-diary', data)
}
//emotion-diary.vue
export function getKnowledgeArticles(params) {
    return service.get('/knowledge/article/page', {params})
}
//article.vue
export function getArticleDetail(id) {
    return service.get(`/knowledge/article/${id}`)
}
