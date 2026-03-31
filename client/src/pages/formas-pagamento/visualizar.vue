<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">Forma de Pagamento</h1>
    <div v-if="loading" class="flex justify-center p-8"><i class="pi pi-spin pi-spinner text-4xl"></i></div>
    <Card v-else-if="forma">
      <template #content>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><span class="font-semibold text-sm text-gray-500">Nome</span><p class="mt-1">{{ forma.nome }}</p></div>
          <div><span class="font-semibold text-sm text-gray-500">Tipo</span><p class="mt-1">{{ forma.tipo || '-' }}</p></div>
          <div><span class="font-semibold text-sm text-gray-500">Status</span><p class="mt-1"><StatusBadge :status="forma.ativo" /></p></div>
        </div>
      </template>
      <template #footer>
        <div class="flex gap-2">
          <Button label="Editar" icon="pi pi-pencil" @click="$router.push(`/formas-pagamento/${route.params.id}/editar`)" />
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
import { formasPagamentoService } from '@/services/formasPagamentoService'

const route = useRoute()
const forma = ref<any>(null)
const loading = ref(false)
onMounted(async () => {
  loading.value = true
  try { const { data: res } = await formasPagamentoService.buscar(route.params.id as string); forma.value = res.data }
  finally { loading.value = false }
})
</script>
