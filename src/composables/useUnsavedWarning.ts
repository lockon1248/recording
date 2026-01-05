import { computed, ref, toValue } from 'vue'
import { onBeforeRouteLeave, useRouter, type RouteLocationRaw } from 'vue-router'
import { useCloned } from '@vueuse/core'

type Options = {
  title?: string
  content?: string
  enabled?: boolean
}

export const useUnsavedWarning = <T>(source: T | (() => T), options: Options = {}) => {
  const router = useRouter()
  const enabled = options.enabled ?? true
  const modalOpen = ref(false)
  const modalTitle = ref(options.title || '資料尚未儲存')
  const modalContent = ref(options.content || '你已修改資料，離開將不會保存。是否仍要離開？')
  const pendingRoute = ref<RouteLocationRaw | null>(null)
  const allowLeave = ref(false)
  const { cloned: snapshot, sync: syncSnapshot } = useCloned(source, { manual: true, deep: true })
  const isDirty = computed(() => {
    return JSON.stringify(toValue(source)) !== JSON.stringify(snapshot.value)
  })
  const requestLeave = (to?: RouteLocationRaw) => {
    if (!enabled) {
      if (to) router.push(to)
      return true
    }
    if (isDirty.value) {
      pendingRoute.value = to || null
      modalOpen.value = true
      return false
    }
    if (to) router.push(to)
    return true
  }

  const confirmLeave = () => {
    if (!enabled) {
      pendingRoute.value = null
      modalOpen.value = false
      return
    }
    if (pendingRoute.value) {
      allowLeave.value = true
      router.push(pendingRoute.value)
      pendingRoute.value = null
    }
    modalOpen.value = false
  }

  const cancelLeave = () => {
    pendingRoute.value = null
    modalOpen.value = false
  }
  if (enabled) {
    onBeforeRouteLeave(to => {
      if (allowLeave.value) {
        allowLeave.value = false
        return true
      }
      if (!isDirty.value) return true
      pendingRoute.value = to
      modalOpen.value = true
      return false
    })
  }
  
  return {
    modalOpen,
    modalTitle,
    modalContent,
    confirmLeave,
    cancelLeave,
    requestLeave,
    syncSnapshot,
    isDirty
  }
}
