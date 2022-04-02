<template>
  <section class="sidebar">
    <ul>
      <li v-for="v in list" :key="v.value" @click="go(v)">
        <span>{{ v.label }}</span>
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router';
import { getMenu } from '../config';
import { ItemType } from '../types'

const router = useRouter()
const emit = defineEmits(['go'])

const list = ref<ItemType[]>(getMenu())

const go = (obj: ItemType) => {
  emit('go', obj)
  // router.push(obj.route)
}

</script>

<style lang="scss">
.sidebar {
  width: 200px;
  padding-right: 12px;
  box-sizing: border-box;
  li {
    margin-top: 12px;
    padding: 8px;
    &:hover {
      background: rgb(231, 231, 231);
      cursor: pointer;
    }
  }
}
</style>
