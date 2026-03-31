<template>
  <Tag :value="label" :severity="severity" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Tag from 'primevue/tag'

const props = defineProps<{ status: boolean | string }>()

const severity = computed(() => {
  if (typeof props.status === 'boolean') return props.status ? 'success' : 'danger'
  const map: Record<string, string> = {
    ativo: 'success', inativo: 'danger', aberto: 'warn',
    baixado: 'success', vencido: 'danger', cancelado: 'danger',
  }
  return map[props.status] || 'info'
})

const label = computed(() => {
  if (typeof props.status === 'boolean') return props.status ? 'Ativo' : 'Inativo'
  return String(props.status).charAt(0).toUpperCase() + String(props.status).slice(1)
})
</script>
