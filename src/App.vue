<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import MainCom from './components/Main.vue'
import { commonStore } from './store'

const store = commonStore()
const route = useRoute()
const router = useRouter()

router.beforeEach(() => {
  console.log(store.getKeepAliveIncludes);
})
</script>

<template>
  <MainCom>
    <router-view v-slot="{ Component }">
      <keep-alive :include="store.getKeepAliveIncludes">
        <component :is="Component" :key="route.fullPath" />
      </keep-alive>
    </router-view>
  </MainCom>
</template>
