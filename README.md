# 錄音管理系統（Recording）

以 Vue 3 + Vite 建置的錄音管理系統前端範例，包含登入、案件清單與錄音文稿頁面。資料為前端模擬，方便快速展示與 UI 開發。

## 主要功能

- 登入頁（簡單帳密驗證 + localStorage token）
- 錄音案件清單（搜尋輸入框、狀態標籤、進入錄音）
- 錄音文稿頁（提醒訊息、文稿內容、錄音操作按鈕）
- 左側選單與品牌化視覺樣式

## 技術棧

- Vue 3 + TypeScript
- Vite
- Vue Router
- Ant Design Vue
- UnoCSS

## Node.js 版本

- Node.js 20 以上

## 開發與執行

```bash
npm install
npm run dev
```

其他指令：

```bash
npm run build
npm run preview
```

## 頁面與路由

- `/login` 登入頁
- `/home` 首頁（歡迎頁）
- `/recordingList` 錄音案件清單
- `/recordingView` 錄音文稿內容

## 登入測試帳號

- 帳號：`adm`
- 密碼：`111`

## 專案結構

```text
src/
  views/        頁面（Login / Home / RecordingList / RecordingView）
  components/   共用元件（Sidebar）
  router/       路由與守衛
  utils/        共用工具
```

## 備註

- 目前資料為前端假資料，若要串接 API 可從 `src/api` 或新增 service 層開始。
