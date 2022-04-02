import { onActivated, onUnmounted, ref } from 'vue'
import eventBus from './eventbus'

export default (comKey: string) => {

  const key = ref(`${Date.now()}`)
  const isRefresh = ref(false)
  const cb =  ((tmpKey: string) => {
    // 如果当前组件不存在缓存时，刷新 key
    if (tmpKey === comKey) {
      isRefresh.value = true
    }
  })
  eventBus.on('remove', cb)

  onActivated(() => {
    if (isRefresh.value) {
      isRefresh.value = false
      key.value = `${Date.now()}`
    }
  })
  onUnmounted(() => {
    eventBus.off('remove', cb)
  })

  return {
    key,
    isRefresh
  }
}
