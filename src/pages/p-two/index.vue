<template>
  <p-two :key="key" />
</template>

<script lang="ts">
export default {
  name: 'PTwoIndex'
}
</script>

<script lang="ts" setup>
import { useRoute } from 'vue-router';
import PTwo from './PTwo.vue'
import useControlComponent from '../../useControlComponent';

const route = useRoute()
const comKey = route.fullPath
const { key } = useControlComponent(comKey)

</script>