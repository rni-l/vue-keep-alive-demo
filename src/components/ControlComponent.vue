<template>
  <slot :key="key" />
</template>

<script lang="ts" setup>
import { onActivated, ref } from 'vue'
import eventBus from '../eventbus'

const props = defineProps({
  comKey: String
})

const key = ref(Date.now())
const isRefresh = ref(false)
eventBus.on('remove', (comKey: string) => {
  // 如果当前组件不存在缓存时，刷新 key
  if (comKey === props.comKey) {
    console.log('refresh');
    isRefresh.value = true
  }
})

onActivated(() => {
  if (isRefresh.value) {
    isRefresh.value = false
    key.value = Date.now()
  }
})
</script>