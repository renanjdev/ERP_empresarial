<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">Formas de Pagamento</h1>
      <Button label="Nova" icon="pi pi-plus" @click="$router.push('/formas-pagamento/adicionar')" />
    </div>
    <AppDataTable :service="formasPagamentoService" routePrefix="/formas-pagamento" :showActions="true">
      <Column field="nome" header="Nome" sortable />
      <Column field="tipo" header="Tipo" sortable />
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
import { formasPagamentoService } from '@/services/formasPagamentoService'
</script>
