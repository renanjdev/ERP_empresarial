<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">Servico</h1>
    <div v-if="loading" class="flex justify-center p-8"><i class="pi pi-spin pi-spinner text-4xl"></i></div>
    <Card v-else-if="servico">
      <template #content>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><span class="font-semibold text-sm text-gray-500">Nome</span><p class="mt-1">{{ servico.nome }}</p></div>
          <div><span class="font-semibold text-sm text-gray-500">Valor</span><p class="mt-1">{{ servico.valor ? Number(servico.valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '-' }}</p></div>
          <div><span class="font-semibold text-sm text-gray-500">Status</span><p class="mt-1"><StatusBadge :status="servico.ativo" /></p></div>
          <div class="md:col-span-2"><span class="font-semibold text-sm text-gray-500">Descricao</span><p class="mt-1">{{ servico.descricao || '-' }}</p></div>
        </div>
      </template>
      <template #footer>
        <div class="flex gap-2">
          <Button label="Editar" icon="pi pi-pencil" @click="$router.push(`/servicos/${route.params.id}/editar`)" />
          <Button label="Voltar" severity="secondary" @click="$router.back()" />
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Card from 'primevue/card'
import Button from 'primevue/button'
import StatusBadge from '@/components/common/StatusBadge.vue'
import { servicosService } from '@/services/servicosService'

const route = useRoute()
const servico = ref<any>(null)
const loading = ref(false)
onMounted(async () => {
  loading.value = true
  try { const { data: res } = await servicosService.buscar(route.params.id as string); servico.value = res.data }
  finally { loading.value = false }
})
</script>
