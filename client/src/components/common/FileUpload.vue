<template>
  <div class="flex flex-col gap-1">
    <label v-if="label" class="font-medium text-sm">{{ label }}</label>
    <FileUploadPrime
      mode="basic"
      :accept="accept"
      :maxFileSize="maxFileSize"
      @select="onSelect"
      chooseLabel="Selecionar arquivo"
    />
  </div>
</template>

<script setup lang="ts">
import FileUploadPrime from 'primevue/fileupload'

defineProps<{ label?: string; accept?: string; maxFileSize?: number }>()
const emit = defineEmits<{ 'update:modelValue': [value: File | null] }>()

function onSelect(event: any) {
  emit('update:modelValue', event.files?.[0] || null)
}
</script>
