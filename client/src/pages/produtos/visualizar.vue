<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">Produto</h1>
    <div v-if="loading" class="flex justify-center p-8"><i class="pi pi-spin pi-spinner text-4xl"></i></div>
    <Card v-else-if="produto">
      <template #content>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><span class="font-semibold text-sm text-gray-500">Nome</span><p class="mt-1">{{ produto.nome }}</p></div>
          <div><span class="font-semibold text-sm text-gray-500">SKU</span><p class="mt-1">{{ produto.sku || '-' }}</p></div>
          <div><span class="font-semibold text-sm text-gray-500">Valor de Venda</span><p class="mt-1">{{ produto.valor_venda ? Number(produto.valor_venda).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '-' }}</p></div>
          <div><span class="font-semibold text-sm text-gray-500">Valor de Custo</span><p class="mt-1">{{ produto.valor_custo ? Number(produto.valor_custo).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '-' }}</p></div>
          <div><span class="font-semibold text-sm text-gray-500">Unidade</span><p class="mt-1">{{ produto.unidade?.nome || '-' }}</p></div>
          <div><span class="font-semibold text-sm text-gray-500">Grupo</span><p class="mt-1">{{ produto.grupo?.nome || '-' }}</p></div>
          <div><span class="font-semibold text-sm text-gray-500">Status</span><p class="mt-1"><StatusBadge :status="produto.ativo" /></p></div>
          <div class="md:col-span-2"><span class="font-semibold text-sm text-gray-500">Descricao</span><p class="mt-1">{{ produto.descricao || '-' }}</p></div>
        </div>
      </template>
      <template #footer>
        <div class="flex gap-2">
          <Button label="Editar" icon="pi pi-pencil" @click="$router.push(`/produtos/${route.params.id}/editar`)" />
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
import { produtosService } from '@/services/produtosService'

const route = useRoute()
const produto = ref<any>(null)
const loading = ref(false)
onMounted(async () => {
  loading.value = true
  try { const { data: res } = await produtosService.buscar(route.params.id as string); produto.value = res.data }
  finally { loading.value = false }
})
</script>
