<template>
  <div class="min-h-screen flex flex-col">
    <AppHeader />
    <div class="flex flex-1">
      <AppSidebar />
      <main class="flex-1 p-6 bg-gray-50" :class="{ 'ml-0': !uiStore.sidebarAberta }">
        <AppBreadcrumb class="mb-4" />
        <RouterView />
      </main>
    </div>
    <Toast />
    <ConfirmDialog />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import Toast from 'primevue/toast'
import ConfirmDialog from 'primevue/confirmdialog'
import AppHeader from '@/components/common/AppHeader.vue'
import AppSidebar from '@/components/common/AppSidebar.vue'
import AppBreadcrumb from '@/components/common/AppBreadcrumb.vue'
import { useUiStore } from '@/stores/ui'

const uiStore = useUiStore()
</script>
