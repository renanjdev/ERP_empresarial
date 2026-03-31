<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Dashboard</h1>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card v-for="card in cards" :key="card.label" class="shadow-sm">
        <template #content>
          <div class="flex items-center gap-4">
            <div class="rounded-full p-3" :class="card.bgClass">
              <i :class="card.icon" class="text-2xl text-white"></i>
            </div>
            <div>
              <p class="text-sm text-gray-500">{{ card.label }}</p>
              <p class="text-3xl font-bold">{{ card.value }}</p>
            </div>
          </div>
        </template>
      </Card>
    </div>

    <!-- Financial placeholder -->
    <Card class="mb-6">
      <template #title>Resumo Financeiro</template>
      <template #content>
        <Message severity="info" :closable="false">
          Graficos financeiros (fluxo de caixa, vendas, contas bancarias) estarao disponiveis na Fase 3 — Modulo Financeiro.
        </Message>
      </template>
    </Card>

    <!-- Quick access links -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card class="shadow-sm cursor-pointer hover:shadow-md transition-shadow" @click="$router.push('/clientes')">
        <template #content>
          <div class="flex items-center gap-3">
            <i class="pi pi-users text-xl text-blue-500"></i>
            <span class="font-medium">Gerenciar Clientes</span>
          </div>
        </template>
      </Card>
      <Card class="shadow-sm cursor-pointer hover:shadow-md transition-shadow" @click="$router.push('/produtos')">
        <template #content>
          <div class="flex items-center gap-3">
            <i class="pi pi-box text-xl text-green-500"></i>
            <span class="font-medium">Gerenciar Produtos</span>
          </div>
        </template>
      </Card>
      <Card class="shadow-sm cursor-pointer hover:shadow-md transition-shadow" @click="$router.push('/fornecedores')">
        <template #content>
          <div class="flex items-center gap-3">
            <i class="pi pi-truck text-xl text-orange-500"></i>
            <span class="font-medium">Gerenciar Fornecedores</span>
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import Card from 'primevue/card'
import Message from 'primevue/message'
import { dashboardService } from '@/services/dashboardService'

const resumo = ref<any>(null)

const cards = computed(() => [
  { label: 'Clientes', value: resumo.value?.total_clientes ?? '—', icon: 'pi pi-users', bgClass: 'bg-blue-500' },
  { label: 'Fornecedores', value: resumo.value?.total_fornecedores ?? '—', icon: 'pi pi-truck', bgClass: 'bg-orange-500' },
  { label: 'Produtos', value: resumo.value?.total_produtos ?? '—', icon: 'pi pi-box', bgClass: 'bg-green-500' },
  { label: 'Servicos', value: resumo.value?.total_servicos ?? '—', icon: 'pi pi-wrench', bgClass: 'bg-purple-500' },
])

onMounted(async () => {
  try {
    const { data: res } = await dashboardService.resumo()
    resumo.value = res.data
  } catch {
    resumo.value = { total_clientes: 0, total_fornecedores: 0, total_produtos: 0, total_servicos: 0 }
  }
})
</script>
