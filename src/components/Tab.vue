<template>
  <div class="c-tabs">
    <div :class="['c-tabs-item', v.value === activeValue ? 'on' : '']"
      @click="choose(v)"
      v-for="v in state.tabs" :key="v.value">
      <span>{{ v.label }}</span>>
      <button @click.stop="remove(v)">移除</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { commonStore } from '../store';
import { ItemType, TabType } from '../types';
import eventBus from '../eventbus'
import { getMenu } from '../config';

const router = useRouter()
const store = commonStore()
const state = reactive<{
  tabs: TabType[]
}>({
  tabs: []
})
const activeValue = ref('')
const add = (obj: ItemType) => {
  if (state.tabs.find(v => v.value === obj.value)) {
    if (activeValue.value !== obj.value) {
      activeValue.value = obj.value
    }
    return
  }
  if (!obj.noCache) {
    store.addRouteView(obj)
  }
  state.tabs.push(obj)
  activeValue.value = obj.value
}

const choose = (v: TabType) => {
  if (v.value === activeValue.value) return
  activeValue.value = v.value
}

const remove = (tab: TabType) => {
  const index = state.tabs.findIndex(v => v.value === tab.value)
  state.tabs = state.tabs.filter(v => v.value !== tab.value)
  store.removeRouteView(tab)
  eventBus.emit('remove', tab.value)
  // store.checkAndRemoveByComName(tab.comName)
  if (tab.value === activeValue.value) {
    if (index === 0) {
      if (state.tabs.length === 0) {
        add(getMenu()[0])
      } else {
        activeValue.value = state.tabs[0].value ?? ''
      }
    } else {
      activeValue.value = (state.tabs.find((_, i) => i === (index - 1))?.value) ?? ''
      console.log(state.tabs.find((_, i) => i === (index - 1))?.value, index, activeValue.value);
    }
  }
}

watch(activeValue, (val) => {
  store.updateVal(val)
  if (val) {
    const obj = state.tabs.find(v => v.value === val)
    if (!obj) return
    router.push(obj.route)
  }
})

defineExpose({
  add
})

</script>

<style lang="scss" scoped>
.c-tabs {
  display: flex;
  width: 100%;
  overflow-x: auto;
  $p-color: rgb(15, 134, 114);
  padding: 12px 0;
  border-bottom: solid 1px #333;
  margin-bottom: 12px;
  &-item {
    min-width: 100px;
    display: flex;
    align-content: center;
    justify-content: center;
    cursor: default;
    &:hover {
      color: lighten($p-color, 20%);
    }
    &.on {
      color: $p-color;
    }
  }
}
</style>
