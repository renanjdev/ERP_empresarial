<template>
  <div class="flex flex-col gap-1">
    <label v-if="label" :for="id" class="font-medium text-sm">{{ label }}</label>
    <DatePicker
      :id="id"
      :modelValue="dateValue"
      @update:modelValue="onUpdate"
      dateFormat="dd/mm/yy"
      showIcon
      class="w-full"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import DatePicker from 'primevue/datepicker'

const props = defineProps<{
  modelValue: string | Date | null
  label?: string
  id?: string
}>()

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const dateValue = computed(() => {
  if (!props.modelValue) return null
  if (props.modelValue instanceof Date) return props.modelValue
  const parts = String(props.modelValue).split('/')
  if (parts.length === 3) return new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]))
  return null
})

function onUpdate(value: Date | null) {
  if (!value) { emit('update:modelValue', ''); return }
  const dd = String(value.getDate()).padStart(2, '0')
  const mm = String(value.getMonth() + 1).padStart(2, '0')
  const yyyy = value.getFullYear()
  emit('update:modelValue', `${dd}/${mm}/${yyyy}`)
}
</script>
