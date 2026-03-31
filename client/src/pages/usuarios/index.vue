<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">Usuarios</h1>
      <Button label="Novo" icon="pi pi-plus" @click="$router.push('/usuarios/adicionar')" />
    </div>
    <AppDataTable :service="usuariosService" routePrefix="/usuarios" :showActions="true">
      <Column field="nome" header="Nome" sortable />
      <Column field="email" header="Email" sortable />
      <Column header="Grupo" sortable>
        <template #body="{ data }">{{ data.grupo_usuario?.nome || '-' }}</template>
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
import { usuariosService } from '@/services/usuariosService'
</script>
