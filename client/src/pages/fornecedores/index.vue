<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">Fornecedores</h1>
      <Button label="Novo" icon="pi pi-plus" @click="$router.push('/fornecedores/adicionar')" />
    </div>
    <AppDataTable :service="fornecedoresService" routePrefix="/fornecedores" :showActions="true">
      <Column field="razao_social" header="Razao Social" sortable />
      <Column field="nome_fantasia" header="Nome Fantasia" sortable />
      <Column field="cnpj" header="CNPJ" sortable />
      <Column field="email" header="Email" sortable />
      <Column field="telefone" header="Telefone" sortable />
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
import { fornecedoresService } from '@/services/fornecedoresService'
</script>
