import { defineStore } from 'pinia'

export type RecordingCase = {
  caseId: string
  name: string
  idNumber: string
  type: string
  direction?: string
  remark?: string
  status: string
  date: string
}

type RecordingState = {
  cases: RecordingCase[]
  selectedCaseId: string | null
}

export const useRecordingStore = defineStore('recording', {
  state: (): RecordingState => ({
    cases: [
      {
        caseId: 'REC-20251229-001',
        name: '張○明',
        idNumber: 'A123****89',
        type: '投資型保險',
        remark: '客戶要求下午兩點後聯繫',
        direction: '初次投保，需詳加說明投資風險',
        status: '待錄音',
        date: '2025-12-29'
      },
      {
        caseId: 'REC-20251229-002',
        name: '李○玲',
        idNumber: 'F224****56',
        type: '終身壽險',
        remark: '件急，已完成審核',
        direction: '續保客戶，流程簡化',
        status: '已完成',
        date: '2025-12-28'
      },
      {
        caseId: 'REC-20251230-015',
        name: '王○傑',
        idNumber: 'B121****12',
        type: '重大疾病險',
        status: '審核中',
        date: '2025-12-30',
        remark: '需補件：健檢報告',
        direction: '保額較高，需強化健康告知確認'
      },
      {
        caseId: 'REC-20251230-022',
        name: '陳○芳',
        idNumber: 'H225****44',
        type: '年金保險',
        status: '錄音中',
        date: '2025-12-30',
        remark: '',
        direction: '網路投保轉人工錄音'
      },
      {
        caseId: 'REC-20251227-009',
        name: '林○宏',
        idNumber: 'E122****33',
        type: '長照險',
        status: '待補件',
        date: '2025-12-27',
        remark: '身分證影本模糊',
        direction: '客戶高齡，建議語速放慢'
      },
      {
        caseId: 'REC-20251231-001',
        name: '趙○雲',
        idNumber: 'P123****77',
        type: '小額終老保險',
        status: '待錄音',
        date: '2025-12-31',
        remark: '偏遠地區客戶，訊號可能不佳',
        direction: '政策性保險，注意法規宣導'
      },
      {
        caseId: 'REC-20251231-005',
        name: '孫○美',
        idNumber: 'G221****90',
        type: '防癌險',
        status: '已撤銷',
        date: '2025-12-31',
        remark: '客戶意願變更',
        direction: '電訪後決定取消'
      },
      {
        caseId: 'REC-20251226-041',
        name: '周○宇',
        idNumber: 'K121****21',
        type: '傷害保險',
        status: '已完成',
        date: '2025-12-26',
        remark: '',
        direction: '外勤職業，加強意外定義說明'
      },
      {
        caseId: 'REC-20251229-088',
        name: '郭○伶',
        idNumber: 'L222****11',
        type: '定期壽險',
        status: '待錄音',
        date: '2025-12-29',
        remark: '需確認受益人資訊',
        direction: '單純定期險，預計錄音耗時短'
      },
      {
        caseId: 'REC-20251230-050',
        name: '楊○恩',
        idNumber: 'D124****66',
        type: '醫療保險',
        status: '錄音失敗',
        date: '2025-12-30',
        remark: '斷線，需重新預約',
        direction: '實支實付型，需核對正本收據規範'
      }
    ],
    selectedCaseId: null
  }),
  getters: {
    getCaseById: state => {
      return (caseId?: string | null) => {
        if (!caseId) return undefined
        return state.cases.find(item => item.caseId === caseId)
      }
    }
  },
  actions: {
    setSelectedCaseId(caseId: string | null) {
      this.selectedCaseId = caseId
    },
    saveCase(updated: RecordingCase) {
      const index = this.cases.findIndex(item => item.caseId === updated.caseId)
      if (index >= 0) {
        this.cases[index] = { ...updated }
        return
      }
      this.cases.push(updated)
    }
  }
})
