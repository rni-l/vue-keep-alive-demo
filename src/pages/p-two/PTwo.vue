<template>
  <div class="p-pTwo">
    <div class="title">p2 - {{ type }}</div>
    <input v-model="val" />
  </div>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router'
import { ref } from 'vue'
const route = useRoute()
const type = route.query.type
const val = ref('')
</script>
