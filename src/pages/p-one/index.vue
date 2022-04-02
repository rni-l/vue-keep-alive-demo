<template>
  <p-one :key="key" />
</template>

<script lang="ts">
export default {
  name: 'POneIndex'
}
</script>

<script lang="ts" setup>
import { useRoute } from 'vue-router';
import POne from './POne.vue'
import useControlComponent from '../../useControlComponent';
import { onActivated, onBeforeUnmount, onDeactivated, onMounted, onUnmounted } from 'vue';

const route = useRoute()
const comKey = route.fullPath
const { key } = useControlComponent(comKey)
let timer: any
onActivated(() => {
  clearInterval(timer)
  timer = setInterval(() => {
    console.log('lock', comKey);
  },1000)
})
// onDeactivated(() => {
//   clearInterval(timer)
//   console.log('onUnmounted - main', comKey);
// })
onUnmounted(() => {
  clearInterval(timer)
  console.log('onUnmounted - main', comKey);
})
</script>