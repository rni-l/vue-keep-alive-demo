<template>
  <div class="c-mainCom">
    <Sidebar @go="handleRoute" />
    <div class="c-mainCom-right">
      <Tab ref="TabIns" />
      <div class="c-mainCom-container">
        <slot />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Sidebar from './Sidebar.vue';
import Tab from './Tab.vue'
import { ItemType } from '../types'
import { ref } from 'vue';

const TabIns = ref<InstanceType<typeof Tab>>()

const handleRoute = (obj: ItemType) => {
  TabIns.value?.add(obj)
}

</script>

<style lang="scss" scoped>
.c-mainCom {
  display: flex;
  height: 100vh;
  &-right {
    width: calc(100% - 200px);
    box-shadow: -1px 0 0 0 #bcbcbc;
    padding: 0 12px;
    box-sizing: border-box;
  }
}
</style>
