<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">Produtos</h1>
      <Button label="Novo" icon="pi pi-plus" @click="$router.push('/produtos/adicionar')" />
    </div>
    <AppDataTable :service="produtosService" routePrefix="/produtos" :showActions="true">
      <Column field="nome" header="Nome" sortable />
      <Column field="sku" header="SKU" sortable />
      <Column field="valor_venda" header="Valor Venda" sortable>
        <template #body="{ data }">
          {{ data.valor_venda ? Number(data.valor_venda).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '-' }}
        </template>
      </Column>
      <Column field="grupo.nome" header="Grupo" sortable />
      <Column field="unidade.sigla" header="Unidade" sortable />
      <Column field="ativo" header="Status" sortable>
        <template #body="{ data }">
          <StatusBadge :status="data.ativo" />
        </template>
      </Column>
    </AppDataTable>
  </div>
</template>

<script setup lang="ts">
import Column from 'primevue/column'
import Button from 'primevue/button'
import AppDataTable from '@/components/common/DataTable.vue'
import StatusBadge from '@/components/common/StatusBadge.vue'
import { produtosService } from '@/services/produtosService'
</script>
