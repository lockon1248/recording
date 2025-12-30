<template>
  <a-modal
    :open="openModel"
    :centered="true"
    :closable="false"
    wrap-class-name="common-modal"
    @cancel="handleCancel"
  >
    <template #title>
      <div class="w-full text-center font-semibold text-lg">{{ title }}</div>
    </template>
    <p class="text-gray-600 whitespace-pre-wrap text-center py-4">{{ content }}</p>
    <template #footer>
      <div class="flex justify-center gap-4 w-full pb-4">
        <a-button v-if="showCancel" @click="handleCancel" class="!px-8 !rounded-md border-gray-300">
          {{ cancelText }}
        </a-button>
        <a-button
          type="primary"
          @click="handleOk"
          class="!bg-[#F58220] !border-[#F58220] !px-8 !rounded-md"
        >
          {{ okText }}
        </a-button>
      </div>
    </template>
  </a-modal>
</template>

<script setup lang="ts">
type Props = {
  title: string
  content: string
  okText?: string
  cancelText?: string
  showCancel?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  okText: '確定',
  cancelText: '取消',
  showCancel: false
})

const openModel = defineModel<boolean>('open', { default: false })

const emit = defineEmits<{
  (event: 'ok'): void
  (event: 'cancel'): void
}>()

const handleOk = () => {
  emit('ok')
  openModel.value = false
}

const handleCancel = () => {
  emit('cancel')
  openModel.value = false
}
</script>
