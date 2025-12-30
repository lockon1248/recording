import { defineStore } from 'pinia'

export type Member = {
  empId: string
  name: string
  dept: string
  role: string
  status: '啟用' | '停用'
}

type MemberState = {
  members: Member[]
  selectedMemberId: string | null
}

export const useMemberStore = defineStore('member', {
  state: (): MemberState => ({
    members: [
      {
        empId: 'MLI00123',
        name: '林O芬',
        dept: '壽險業務部',
        role: '業務員',
        status: '啟用'
      },
      {
        empId: 'MLI00456',
        name: '陳O志',
        dept: '資訊開發部',
        role: '系統管理員',
        status: '啟用'
      },
      {
        empId: 'MLI00789',
        name: '王O明',
        dept: '客戶服務部',
        role: '審核主管',
        status: '停用'
      }
    ],
    selectedMemberId: null
  }),
  getters: {
    getMemberById: (state) => {
      return (empId?: string | null) => {
        if (!empId) return undefined
        return state.members.find((member) => member.empId === empId)
      }
    }
  },
  actions: {
    setSelectedMemberId(empId: string | null) {
      this.selectedMemberId = empId
    },
    saveMember(member: Member) {
      const index = this.members.findIndex((item) => item.empId === member.empId)
      if (index >= 0) {
        this.members[index] = { ...member }
        return
      }
      this.members.push(member)
    }
  }
})
