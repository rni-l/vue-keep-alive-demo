<template>
  <div class="p-pThree">
    three
    <input v-model="val" />
  </div>
</template>

<script lang="ts">
export default {
  name: 'PThree'
}
</script>
<script lang="ts" setup>
import { ref } from 'vue'
const val = ref('')
</script>

<style lang="scss" scoped>
.p-pThree {}
</style>