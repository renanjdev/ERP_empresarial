<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">Servicos</h1>
      <Button label="Novo" icon="pi pi-plus" @click="$router.push('/servicos/adicionar')" />
    </div>
    <AppDataTable :service="servicosService" routePrefix="/servicos" :showActions="true">
      <Column field="nome" header="Nome" sortable />
      <Column field="valor" header="Valor" sortable>
        <template #body="{ data }">{{ data.valor ? Number(data.valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '-' }}</template>
      </Column>
      <Column field="ativo" header="Status" sortable>
        <template #body="{ data }"><StatusBadge :status="data.ativo" /></template>
      </Column>
    </AppDataTable>
  </div>
</template>

<script setup lang="ts">
import Column from 'primevue/column'
import Button from 'primevue/button'
import AppDataTable from '@/components/common/DataTable.vue'
import StatusBadge from '@/components/common/StatusBadge.vue'
import { servicosService } from '@/services/servicosService'
</script>
