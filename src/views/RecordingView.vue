<template>
  <div class="w-full h-full bg-white flex flex-col">
    <div class="flex items-center justify-between px-4 py-3 border-b border-gray-100">
      <a-button @click="backToList" type="link" class="!flex items-center !text-blue-500">
        <template #icon><LeftOutlined /></template> Back
      </a-button>
      <div class="flex-1 text-center font-bold text-lg">錄音文稿內容</div>
      <a-button
        v-if="!readonly"
        class="!rounded-full !flex items-center shadow-sm border-gray-200"
        @click="handleUpload"
      >
        <template #icon><CloudUploadOutlined class="text-orange-500" /></template>
        錄音上傳
      </a-button>
    </div>
    <div class="bg-gray-50 px-6 py-4 text-center border-b border-gray-200">
      <span class="font-bold text-gray-700">
        重要提醒：執行銷售錄音作業時，應確實向客戶解說相關內容，不得僅依範本逐字宣讀。
      </span>
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
          <tr v-for="item in scripts" :key="item.id" :class="{ 'bg-gray-200': item.recordStatus === 2 }">
            <td class="w-48 align-top p-6" :class="item.recordStatus === 2 ? 'bg-gray-200' : 'bg-[#FFF7ED]'">
              <div class="flex flex-col items-center gap-4">
                <div class="text-gray-500 font-bold mb-2">{{ item.id }}</div>
                <a-button
                  v-if="!readonly"
                  class="recording-btn group"
                  :disabled="isRecordingDisabled(item)"
                  @click="recording(item)"
                >
                  <div class="flex items-center">
                    <i-material-symbols:radio-button-checked
                      :class="[getStatusStyle(item).color, getStatusStyle(item).pulse ? 'animate-pulse' : '']"
                    />
                    <span class="font-bold text-gray-700">
                      {{ getStatusStyle(item).text }}
                    </span>
                  </div>
                </a-button>
                <a-button class="play-btn" :disabled="isPlayDisabled(item)" @click="playRecording(item)">
                  <div class="flex items-center">
                    <i-material-symbols:pause v-if="playingItemId === item.id" class="text-red-500" />
                    <i-material-symbols:play-arrow v-else class="text-green" />
                    <span :class="item.audioUrl ? 'text-gray-900' : 'text-gray-400'" class="font-bold"> 播放 </span>
                  </div>
                </a-button>
                <!-- <a-button class="play-btn" :disabled="!item.audioBlob" @click="downloadRecording(item)">
                  <div class="flex items-center">
                    <i-material-symbols:download class="text-blue-500" />
                    <span :class="item.audioBlob ? 'text-gray-900' : 'text-gray-400'" class="font-bold"> 下載 </span>
                  </div>
                </a-button> -->
                <a-button
                  v-if="!readonly && item.showSkip"
                  class="play-btn"
                  :disabled="item.recordStatus === 2"
                  @click="skipRecording(item)"
                >
                  <div class="flex items-center">
                    <i-material-symbols:lock-sharp class="text-yellow-400" />
                    <span class="text-gray-700 font-bold">此題已跳過</span>
                  </div>
                </a-button>
              </div>
            </td>
            <td class="p-6 align-top">
              <div class="flex flex-col">
                <span> {{ item.member }}:</span>
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
    <CommonModal v-model:open="modalOpen" :title="modalTitle" :content="modalContent" ok-text="我知道了" />
    <CommonModal
      v-model:open="leaveModalOpen"
      :title="leaveTitle"
      :content="leaveContent"
      ok-text="離開"
      cancel-text="留在此頁"
      :show-cancel="true"
      @ok="confirmLeave"
      @cancel="cancelLeave"
    />
    <CommonModal
      v-model:open="reRecordModalOpen"
      :title="reRecordTitle"
      :content="reRecordContent"
      ok-text="是的，重錄"
      cancel-text="取消"
      :show-cancel="true"
      @ok="confirmReRecord"
      @cancel="cancelReRecord"
    />
  </div>
</template>

<script setup lang="ts">
import { LeftOutlined, CloudUploadOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { reactive, computed, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import router from '@/router'
import MicRecorder from 'mic-recorder-to-mp3'
import CommonModal from '@/components/CommonModal.vue'
import { checkMicrophoneAccess } from '@/utils/microphone'
import { useUnsavedWarning } from '@/composables/useUnsavedWarning'
import { loadAudio, saveAudio } from '@/utils/audioStore'
type ScriptItem = {
  id: number
  title: string
  actionLabel?: string
  member: string
  content: string
  note: string
  customer: string
  order: string
  showSkip?: boolean
  scriptAudioUrl?: string
  recordStatus?: number
  audioBlob?: Blob
  audioUrl?: string
}
const props = withDefaults(defineProps<{ readonly?: boolean }>(), { readonly: false })
const modalTitle = ref('')
const modalContent = ref('')
const activeItem = ref<ScriptItem | null>(null)
const playingItemId = ref<number | null>(null)
const currentAudio = ref<HTMLAudioElement | null>(null)
const scriptAudio = ref<HTMLAudioElement | null>(null)
const scriptPlayingItemId = ref<number | null>(null)
const recorder = new MicRecorder({ bitRate: 128 })
const modalOpen = ref(false)
const reRecordModalOpen = ref(false)
const reRecordTitle = ref('此題已有錄音')
const reRecordContent = ref('此題已有錄音內容或是被跳過，是否要重新錄音？')
const pendingReRecordItem = ref<ScriptItem | null>(null)
const route = useRoute()
const caseId = computed(() => (route.params.id as string | undefined) || '')
// 模擬文稿數據
const scripts = reactive<ScriptItem[]>([
  {
    id: 1,
    title: '開始錄音',
    actionLabel: '開始錄音',
    member: '業務員',
    content: `測O音先生，您好！我是服務於三商美邦人壽的林O芬，業務員登入字號是0105308576，並已獲得授權招攬。根據法律規定，我將以錄音方式紀錄本次銷售過程。請問您是否同意？`,
    note: '(請依錄音對象唸出客戶姓名，若客戶不同意，則本次銷售過程終止;如為共同承攬件，兩名業務員所屬公司、姓名、登錄字號均須告知。)',
    customer: '客戶',
    order: '同意 / 不同意',
    recordStatus: 0 // 0: 未錄音, 1: 錄音中, 2: 錄音結束
  },
  {
    id: 2,
    title: '播稿並錄音',
    actionLabel: '播稿並錄音',
    member: '業務員',
    scriptAudioUrl: '/voice2.mp3',
    content: `您所購買的是三商美邦人壽發行的投資型保險商品-金世紀副利變額萬能壽險Ａ型。以下將說明本商品內容及重要事項，請您聽完後逐一回答`,
    note: '(若有2人(含)以上客戶同時錄音，請個別唸出自己的姓名再回答)',
    customer: '客戶',
    order: '同意 / 不同意',
    recordStatus: 0 // 0: 未錄音, 1: 錄音中, 2: 錄音結束
  },
  {
    id: 3,
    title: '開始錄音',
    actionLabel: '開始錄音',
    member: '業務員',
    content: `本保險「投資標的」是可以轉換的，請問需要為您說明【投資標的轉換】條款內容嗎？`,
    note: '(若客戶回答「需要」時，須說明以下《》內容',
    customer: '客戶',
    order: '需要 / 不需要',
    recordStatus: 0 // 0: 未錄音, 1: 錄音中, 2: 錄音結束
  },
  {
    id: 4,
    title: '播稿並錄音',
    actionLabel: '播稿並錄音',
    member: '業務員',
    scriptAudioUrl: '/voice4.mp3',
    content: `22-1. 有關【投資標的轉換】提供以下轉換方式：1. 停利機制為所持有之投資標的報酬率達到您所設定之停利點時，將全數金額轉出至您所指定之投資標的，若未指定則轉出至「停泊標的」。 2. 申請轉換為設定將持有之「一般投資標的」或「停泊標的」轉出至所指定之「一般投資標的」。 22-2. 以上說明，請問您清楚嗎？`,
    note: '',
    customer: '客戶',
    order: '清楚 / 不清楚',
    showSkip: true,
    recordStatus: 0 // 0: 未錄音, 1: 錄音中, 2: 錄音結束
  },
  {
    id: 5,
    title: '確認聲明與結束',
    actionLabel: '開始錄音',
    member: '業務員',
    content: `以上說明及重要事項已完整告知，請問您是否已充分了解商品內容、投資風險，並確認剛才所有回答皆為您本人真實意願的表達？`,
    note: '(此為結尾確認，須確保客戶回答語音清晰；若客戶回答不清楚或有疑義，請重新說明相關章節內容並再次確認。)',
    customer: '客戶',
    order: '是，清楚並同意',
    recordStatus: 0 // 0: 未錄音, 1: 錄音中, 2: 錄音結束
  }
])

// 2. 使用 computed 控制樣式邏輯
// 這裡我們回傳一個閉包函式，讓 template 可以根據 status 取得對應設定
const getStatusStyle = computed(() => {
  return (item: ScriptItem) => {
    switch (item.recordStatus) {
      case 1:
        return { text: '錄音結束', color: 'text-green-500', pulse: true }
      case 2:
        if (item.actionLabel === '播稿並錄音') {
          return { text: '播稿並重新錄音', color: 'text-black', pulse: false }
        } else {
          return { text: '重新錄音', color: 'text-black', pulse: false }
        }

      default:
        return { text: item.actionLabel || '開始錄音', color: 'text-red-500', pulse: false }
    }
  }
})

const buildSnapshot = () =>
  scripts.map(item => ({
    id: item.id,
    recordStatus: item.recordStatus ?? 0,
    hasAudio: !!item.audioBlob
  }))

const {
  modalOpen: leaveModalOpen,
  modalTitle: leaveTitle,
  modalContent: leaveContent,
  confirmLeave,
  cancelLeave,
  requestLeave,
  syncSnapshot
} = useUnsavedWarning(buildSnapshot, {
  title: '錄音尚未完成',
  content: '你已修改錄音資料，離開將不會保存。是否仍要離開？',
  enabled: !props.readonly
})

const backToList = () => {
  requestLeave('/recordingList')
}

const startRecording = async (item: ScriptItem) => {
  if (item.audioUrl) {
    URL.revokeObjectURL(item.audioUrl)
    item.audioUrl = undefined
    item.audioBlob = undefined
  }
  await recorder.start()
  item.recordStatus = 1
  activeItem.value = item
}

const stopRecording = async (item: ScriptItem) => {
  const [, recordedBlob] = await recorder.stop().getMp3()
  if (item.scriptAudioUrl) {
    const combinedBlob = await concatScriptAndRecording(item.scriptAudioUrl, recordedBlob)
    item.audioBlob = combinedBlob
    item.audioUrl = URL.createObjectURL(combinedBlob)
  } else {
    item.audioBlob = recordedBlob
    item.audioUrl = URL.createObjectURL(recordedBlob)
  }
  if (caseId.value) {
    await saveAudio(caseId.value, item.id, item.audioBlob)
  }
  item.recordStatus = 2
  activeItem.value = null
}

const playRecording = (item: ScriptItem) => {
  if (!item.audioUrl) return
  stopScriptPlayback()
  if (playingItemId.value === item.id && currentAudio.value) {
    currentAudio.value.pause()
    currentAudio.value.currentTime = 0
    currentAudio.value = null
    playingItemId.value = null
    return
  }
  if (currentAudio.value) {
    currentAudio.value.pause()
    currentAudio.value.currentTime = 0
  }
  const audio = new Audio(item.audioUrl)
  currentAudio.value = audio
  playingItemId.value = item.id
  audio.onended = () => {
    currentAudio.value = null
    playingItemId.value = null
  }
  audio.play()
}

// const downloadRecording = (item: ScriptItem) => {
//   if (!item.audioBlob) {
//     message.warning('目前沒有可下載的錄音')
//     return
//   }
//   const blobType = item.audioBlob.type || 'audio/wav'
//   const ext = blobType.includes('wav') ? 'wav' : 'mp3'
//   const url = URL.createObjectURL(item.audioBlob)
//   const link = document.createElement('a')
//   link.href = url
//   link.download = `recording-${item.id}.${ext}`
//   document.body.appendChild(link)
//   link.click()
//   link.remove()
//   URL.revokeObjectURL(url)
// }

const stopListeningPlayback = () => {
  if (!currentAudio.value) return
  currentAudio.value.pause()
  currentAudio.value.currentTime = 0
  currentAudio.value = null
  playingItemId.value = null
}

const stopScriptPlayback = () => {
  if (!scriptAudio.value) return
  scriptAudio.value.pause()
  scriptAudio.value.currentTime = 0
  scriptAudio.value = null
  scriptPlayingItemId.value = null
}

const concatScriptAndRecording = async (scriptUrl: string, recordedBlob: Blob) => {
  const audioContext = new AudioContext()
  const decode = async (buffer: ArrayBuffer) => audioContext.decodeAudioData(buffer)
  const resample = async (buffer: AudioBuffer, targetRate: number) => {
    if (buffer.sampleRate === targetRate) return buffer
    const offline = new OfflineAudioContext(buffer.numberOfChannels, Math.ceil(buffer.duration * targetRate), targetRate)
    const source = offline.createBufferSource()
    source.buffer = buffer
    source.connect(offline.destination)
    source.start()
    return offline.startRendering()
  }
  const encodeWav = (buffer: AudioBuffer) => {
    const numChannels = buffer.numberOfChannels
    const sampleRate = buffer.sampleRate
    const length = buffer.length * numChannels * 2 + 44
    const arrayBuffer = new ArrayBuffer(length)
    const view = new DataView(arrayBuffer)
    let offset = 0
    const writeString = (str: string) => {
      for (let i = 0; i < str.length; i += 1) {
        view.setUint8(offset, str.charCodeAt(i))
        offset += 1
      }
    }
    writeString('RIFF')
    view.setUint32(offset, length - 8, true)
    offset += 4
    writeString('WAVE')
    writeString('fmt ')
    view.setUint32(offset, 16, true)
    offset += 4
    view.setUint16(offset, 1, true)
    offset += 2
    view.setUint16(offset, numChannels, true)
    offset += 2
    view.setUint32(offset, sampleRate, true)
    offset += 4
    view.setUint32(offset, sampleRate * numChannels * 2, true)
    offset += 4
    view.setUint16(offset, numChannels * 2, true)
    offset += 2
    view.setUint16(offset, 16, true)
    offset += 2
    writeString('data')
    view.setUint32(offset, length - 44, true)
    offset += 4
    const channels = []
    for (let i = 0; i < numChannels; i += 1) {
      channels.push(buffer.getChannelData(i))
    }
    for (let i = 0; i < buffer.length; i += 1) {
      for (let ch = 0; ch < numChannels; ch += 1) {
        const channel = channels[ch] || channels[0]
        let sample = channel?.[i] ?? 0
        sample = Math.max(-1, Math.min(1, sample))
        view.setInt16(offset, sample * 0x7fff, true)
        offset += 2
      }
    }
    return new Blob([view], { type: 'audio/wav' })
  }
  try {
    const [scriptBuffer, recordedBuffer] = await Promise.all([
      fetch(scriptUrl).then(res => res.arrayBuffer()),
      recordedBlob.arrayBuffer()
    ])
    const scriptAudio = await decode(scriptBuffer)
    const recordedAudio = await decode(recordedBuffer)
    const targetRate = scriptAudio.sampleRate
    const scriptResampled = await resample(scriptAudio, targetRate)
    const recordedResampled = await resample(recordedAudio, targetRate)
    const channels = Math.max(scriptResampled.numberOfChannels, recordedResampled.numberOfChannels)
    const combined = audioContext.createBuffer(
      channels,
      scriptResampled.length + recordedResampled.length,
      targetRate
    )
    for (let ch = 0; ch < channels; ch += 1) {
      const channelData = combined.getChannelData(ch)
      const scriptData = scriptResampled.getChannelData(Math.min(ch, scriptResampled.numberOfChannels - 1))
      const recordedData = recordedResampled.getChannelData(Math.min(ch, recordedResampled.numberOfChannels - 1))
      channelData.set(scriptData, 0)
      channelData.set(recordedData, scriptResampled.length)
    }
    return encodeWav(combined)
  } catch (_error: unknown) {
    return recordedBlob
  } finally {
    audioContext.close()
  }
}

const isPlayDisabled = (item: ScriptItem) => {
  if (!item.audioUrl) return true
  if (playingItemId.value && playingItemId.value !== item.id) return true
  return false
}

const isRecordingDisabled = (item: ScriptItem) => {
  if (playingItemId.value || scriptPlayingItemId.value) return true
  return !!activeItem.value && activeItem.value !== item && activeItem.value.recordStatus === 1
}

const showModal = (title: string, content: string) => {
  modalTitle.value = title
  modalContent.value = content
  modalOpen.value = true
}

const handleUpload = () => {
  const missingItems = scripts.filter(item => item.recordStatus !== 2 || !item.audioBlob)
  if (missingItems.length > 0) {
    const missingList = missingItems.map(item => `#${item.id} ${item.title}`).join('、')
    showModal('尚有錄音未完成', `以下項目尚未完成錄音：${missingList}\n請先完成錄音再上傳。`)
    return
  }
  const messageKey = 'uploadRecording'
  message.loading({ content: '錄音上傳中...', key: messageKey, duration: 0 })
  setTimeout(() => {
    message.success({ content: '上傳完成', key: messageKey, duration: 1 })
    router.push('/recordingList')
  }, 1200)
}

const beginRecording = async (item: ScriptItem) => {
  if (props.readonly) return
  const isReady = await checkMicrophoneAccess()
  if (!isReady) return
  stopListeningPlayback()
  stopScriptPlayback()
  if (activeItem.value && activeItem.value !== item && activeItem.value.recordStatus === 1) {
    try {
      await stopRecording(activeItem.value)
    } catch (_error: unknown) {
      activeItem.value.recordStatus = 0
    }
  }
  try {
    await startRecording(item)
  } catch (_error: unknown) {
    item.recordStatus = 0
    activeItem.value = null
  }
}

const playScriptThenRecord = async (item: ScriptItem) => {
  if (props.readonly || !item.scriptAudioUrl) return
  if (scriptPlayingItemId.value === item.id) return
  const isReady = await checkMicrophoneAccess()
  if (!isReady) return
  stopListeningPlayback()
  stopScriptPlayback()
  if (activeItem.value && activeItem.value !== item && activeItem.value.recordStatus === 1) {
    try {
      await stopRecording(activeItem.value)
    } catch (_error: unknown) {
      activeItem.value.recordStatus = 0
    }
  }
  scriptPlayingItemId.value = item.id
  const audio = new Audio(item.scriptAudioUrl)
  scriptAudio.value = audio
  audio.onended = async () => {
    if (scriptAudio.value === audio) {
      scriptAudio.value = null
    }
    scriptPlayingItemId.value = null
    await beginRecording(item)
  }
  audio.play()
}

const skipRecording = (item: ScriptItem) => {
  if (props.readonly) return
  item.recordStatus = 2
  if (!item.audioBlob) {
    item.audioBlob = new Blob([], { type: 'audio/mp3' })
  }
}

const confirmReRecord = async () => {
  const item = pendingReRecordItem.value
  reRecordModalOpen.value = false
  pendingReRecordItem.value = null
  if (!item) return
  await beginRecording(item)
}

const cancelReRecord = () => {
  reRecordModalOpen.value = false
  pendingReRecordItem.value = null
}

// 3. 切換狀態的邏輯
const recording = async (item: ScriptItem) => {
  if (props.readonly) return
  // TODO: 播稿並錄音需先播放既有稿件音檔，再開始錄音
  // 同一筆已在錄音中：這次點擊視為「停止」
  if (item.recordStatus === 1 && activeItem.value === item) {
    try {
      await stopRecording(item)
    } catch (_error: unknown) {
      item.recordStatus = 0
      activeItem.value = null
    }
    return
  }
  if (scriptPlayingItemId.value === item.id) return
  // 已錄音：提示是否重錄
  if (item.recordStatus === 2) {
    pendingReRecordItem.value = item
    reRecordModalOpen.value = true
    return
  }
  if (item.scriptAudioUrl) {
    await playScriptThenRecord(item)
    return
  }
  await beginRecording(item)
}

onMounted(() => {
  syncSnapshot()
  if (!caseId.value) return
  scripts.forEach(async item => {
    if (item.audioBlob) return
    try {
      const record = await loadAudio(caseId.value, item.id)
      if (!record?.blob) return
      item.audioBlob = record.blob
      item.audioUrl = URL.createObjectURL(record.blob)
      item.recordStatus = 2
    } catch (_error: unknown) {
      // ignore load failures
    }
  })
})
</script>

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
  border: 2px solid #818386; /* 強制加上灰色細邊線 */
}

/* 表格邊框微調 */
table {
  border-left: 2px solid #818386;
  border-right: 2px solid #818386;
}
</style>
