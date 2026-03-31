<template>
  <div class="flex flex-col gap-1">
    <label v-if="label" :for="id" class="font-medium text-sm">{{ label }}</label>
    <InputNumber
      :id="id"
      :modelValue="numericValue"
      @update:modelValue="onUpdate"
      mode="currency"
      currency="BRL"
      locale="pt-BR"
      :minFractionDigits="2"
      :maxFractionDigits="2"
      class="w-full"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import InputNumber from 'primevue/inputnumber'

const props = defineProps<{
  modelValue: string | number | null
  label?: string
  id?: string
}>()

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const numericValue = computed(() => {
  if (props.modelValue === null || props.modelValue === undefined) return 0
  if (typeof props.modelValue === 'number') return props.modelValue
  const cleaned = String(props.modelValue).replace(/\./g, '').replace(',', '.')
  return parseFloat(cleaned) || 0
})

function onUpdate(value: number | null) {
  const num = value ?? 0
  const formatted = num.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  emit('update:modelValue', formatted)
}
</script>
