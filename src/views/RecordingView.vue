<script setup lang="ts">
import router from '@/router'
import { LeftOutlined, CloudUploadOutlined } from '@ant-design/icons-vue'

// 模擬文稿數據
const scripts = [
  {
    id: 1,
    title: '開始錄音',
    member: '業務員',
    content: `測O音先生，您好！我是服務於三商美邦人壽的林O芬，業務員登入字號是0105308576，並已獲得授權招攬。根據法律規定，我將以錄音方式紀錄本次銷售過程。請問您是否同意？`,
    note: '(請依錄音對象唸出客戶姓名，若客戶不同意，則本次銷售過程終止;如為共同承攬件，兩名業務員所屬公司、姓名、登錄字號均須告知。)',
    customer: '客戶',
    order: '同意 / 不同意'
  },
  {
    id: 2,
    title: '播稿並錄音',
    member: '業務員',
    content: `您所購買的是三商美邦人壽發行的投資型保險商品...`,
    note: '(若有2人(含)以上客戶同時錄音，請個別唸出自己的姓名再回答)',
    customer: '客戶',
    order: '同意 / 不同意'
  },
  {
    id: 2,
    title: '播稿並錄音',
    member: '業務員',
    content: `您所購買的是三商美邦人壽發行的投資型保險商品...`,
    note: '(若有2人(含)以上客戶同時錄音，請個別唸出自己的姓名再回答)',
    customer: '客戶',
    order: '同意 / 不同意'
  },
  {
    id: 2,
    title: '播稿並錄音',
    member: '業務員',
    content: `您所購買的是三商美邦人壽發行的投資型保險商品...`,
    note: '(若有2人(含)以上客戶同時錄音，請個別唸出自己的姓名再回答)',
    customer: '客戶',
    order: '同意 / 不同意'
  },
  {
    id: 2,
    title: '播稿並錄音',
    member: '業務員',
    content: `您所購買的是三商美邦人壽發行的投資型保險商品...`,
    note: '(若有2人(含)以上客戶同時錄音，請個別唸出自己的姓名再回答)',
    customer: '客戶',
    order: '同意 / 不同意'
  }
]

const backToList = () => {
  router.push('/recordingList')
}
</script>
<template>
  <div class="w-full h-full bg-white flex flex-col">
    <div class="flex items-center justify-between px-4 py-3 border-b border-gray-100">
      <a-button @click="backToList" type="link" class="!flex items-center !text-blue-500">
        <template #icon><LeftOutlined /></template> Back
      </a-button>
      <div class="flex-1 text-center font-bold text-lg">錄音文稿內容</div>
      <a-button class="!rounded-full !flex items-center shadow-sm border-gray-200">
        <template #icon><CloudUploadOutlined class="text-orange-500" /></template>
        錄音上傳
      </a-button>
    </div>
    <div class="bg-gray-50 px-6 py-4 text-center border-b border-gray-200">
      <span class="font-bold text-gray-700"
        >重要提醒：執行銷售錄音作業時，應確實向客戶解說相關內容，不得僅依範本逐字宣讀。</span
      >
    </div>
    <div class="flex-1 overflow-auto">
      <table class="w-full border-collapse">
        <thead class="bg-orange-50 sticky top-0 z-10">
          <tr class="divide-x border-b text-center">
            <th class="w-48 py-3 text-mliNavy font-bold">題號 / 操作</th>
            <th class="py-3 text-mliNavy font-bold">錄音文稿內容</th>
          </tr>
        </thead>
        <tbody class="divide-y-1 divide-gray-300">
          <tr v-for="item in scripts" :key="item.id">
            <td class="w-48 bg-[#FFF7ED] align-top p-6">
              <div class="flex flex-col items-center gap-4">
                <div class="text-gray-500 font-bold mb-2">{{ item.id }}</div>
                <a-button class="recording-btn group">
                  <div class="flex gap-1 items-center">
                    <span
                      class="w-3 h-3 rounded-full bg-red-500 mr-2 group-hover:animate-pulse"
                    ></span>
                    <span class="font-bold">開始錄音</span>
                  </div>
                </a-button>
                <a-button class="play-btn" disabled>
                  <span class="text-gray-400 font-bold">聽取錄音內容</span>
                </a-button>
              </div>
            </td>
            <td class="p-6 align-top">
              <div class="flex flex-col">
                <span> {{ item.member }}: </span>
                <span class="whitespace-pre-wrap leading-relaxed text-gray-800 font-medium">
                  {{ item.content }}
                </span>
                <span class="mt-4 text-[#F58220] text-sm italic pt-2">
                  {{ item.note }}
                </span>
              </div>
              <div class="mt-6 p-3 flex flex-col gap-2">
                <span>{{ item.customer }}:</span>
                <span>{{ item.order }}</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
/* 為了達成截圖中那種圓潤且有陰影的按鈕效果 */
.recording-btn {
  @apply !h-12 !px-4 !rounded-full !flex !items-center !justify-center !bg-white !border-gray-200 !shadow-md !w-full;
}

.play-btn {
  @apply !h-12 !px-4 !rounded-full !flex !items-center !justify-center !bg-gray-100 !border-gray-200 !w-full;
}

/* RecordingView.vue */
table,
th,
td {
  border: 1px solid #d1d5db; /* 強制加上灰色細邊線 */
}

/* 表格邊框微調 */
table {
  border-left: 1px solid #d1d5db;
  border-right: 1px solid #d1d5db;
}
</style>
