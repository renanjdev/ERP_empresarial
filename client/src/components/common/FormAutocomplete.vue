<template>
  <div class="flex flex-col gap-1">
    <label v-if="label" class="font-medium text-sm">{{ label }}</label>
    <AutoComplete
      :modelValue="modelValue"
      @update:modelValue="emit('update:modelValue', $event)"
      :suggestions="items"
      @complete="search"
      :optionLabel="optionLabel"
      :placeholder="placeholder"
      :loading="loading"
      class="w-full"
      forceSelection
    />
  </div>
</template>

<script setup lang="ts">
import AutoComplete from 'primevue/autocomplete'
import { useAutocomplete } from '@/composables/useAutocomplete'

const props = defineProps<{
  modelValue: any
  endpoint: string
  label?: string
  placeholder?: string
  optionLabel?: string
}>()

const emit = defineEmits<{ 'update:modelValue': [value: any] }>()

const { items, loading, search } = useAutocomplete(props.endpoint)
</script>
