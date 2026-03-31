<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">Clientes</h1>
      <Button label="Novo" icon="pi pi-plus" @click="$router.push('/clientes/adicionar')" />
    </div>
    <AppDataTable :service="clientesService" routePrefix="/clientes" :showActions="true">
      <Column field="nome" header="Nome" sortable />
      <Column field="cpf_cnpj" header="CPF/CNPJ" sortable />
      <Column field="tipo_pessoa" header="Tipo" sortable>
        <template #body="{ data }">
          {{ data.tipo_pessoa === 'F' ? 'Pessoa Fisica' : data.tipo_pessoa === 'J' ? 'Pessoa Juridica' : data.tipo_pessoa }}
        </template>
      </Column>
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
import { clientesService } from '@/services/clientesService'
</script>
