<template>
  <Breadcrumb :home="home" :model="breadcrumbItems" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Breadcrumb from 'primevue/breadcrumb'

const route = useRoute()

const home = { icon: 'pi pi-home', route: '/' }

const breadcrumbItems = computed(() => {
  return route.matched
    .filter((r) => r.meta?.breadcrumb)
    .map((r) => ({
      label: r.meta.breadcrumb as string,
    }))
})
</script>
