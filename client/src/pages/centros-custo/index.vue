<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">Centros de Custo</h1>
      <Button label="Novo" icon="pi pi-plus" @click="$router.push('/centros-custo/adicionar')" />
    </div>
    <AppDataTable :service="centrosCustoService" routePrefix="/centros-custo" :showActions="true">
      <Column field="nome" header="Nome" sortable />
      <Column field="descricao" header="Descricao" sortable />
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
import { centrosCustoService } from '@/services/centrosCustoService'
</script>
