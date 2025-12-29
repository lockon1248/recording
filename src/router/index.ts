import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    // 雖然 Home 是首頁，但建議也用動態加載
    component: () => import('@/views/Home.vue'),
    meta: { title: '三商美邦' }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/Login.vue'),
    meta: { title: '登入' }
  },
  {
    path: '/recordingList',
    name: 'recordingList',
    component: () => import('@/views/RecordingList.vue'),
    meta: { title: '首頁 - 三商美邦' }
  },
  {
    path: '/recordingView',
    name: 'recording',
    component: () => import('@/views/RecordingView.vue'),
    meta: { title: '三商美邦-錄音' }
  }
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
    // 切換頁面時，自動滾動到頂部
    // scrollBehavior() {
    //     return { top: 0 }
    // }
})

// 路由守衛：自動根據 meta 設定網頁標題
// 路由前置守衛
router.beforeEach((to, _from, next) => {
    // 1. 設定網頁標題 (你原本的功能)
    const title = to.meta.title as string
    if (title) {
        document.title = title
    }
    // 2. 檢查登入狀態
    // 假設我們把登入 Token 存在 localStorage
    const isAuthenticated = !!localStorage.getItem('user_token')
    // 3. 判斷邏輯
    if (to.name !== 'login' && !isAuthenticated) {
        // 如果不是要去登入頁，且沒有登入狀態 -> 強制導向登入頁
        next({ name: 'login' })
    } else if (to.name === 'login' && isAuthenticated) {
        // 如果已經登入卻還想去登入頁 -> 導向首頁
        next({ name: 'home' })
    } else {
        next()
    }
})

export default router
