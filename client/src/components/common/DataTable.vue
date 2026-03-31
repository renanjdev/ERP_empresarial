<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <IconField>
        <InputIcon class="pi pi-search" />
        <InputText v-model="searchText" placeholder="Buscar..." @input="onSearch" />
      </IconField>
      <slot name="header-actions" />
    </div>

    <DataTablePrime
      :value="items"
      :loading="loading"
      :lazy="true"
      :totalRecords="totalRecords"
      :rows="perPage"
      :first="first"
      @page="onPage"
      @sort="onSort"
      paginator
      :rowsPerPageOptions="[10, 20, 50]"
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
      stripedRows
    >
      <slot />
      <Column v-if="showActions" header="Acoes" style="width: 150px">
        <template #body="{ data }">
          <div class="flex gap-2">
            <Button v-if="routePrefix" icon="pi pi-eye" severity="info" text rounded @click="$router.push(`${routePrefix}/${data.id}/visualizar`)" />
            <Button v-if="routePrefix" icon="pi pi-pencil" severity="warn" text rounded @click="$router.push(`${routePrefix}/${data.id}/editar`)" />
            <Button icon="pi pi-trash" severity="danger" text rounded @click="onDelete(data)" />
          </div>
        </template>
      </Column>
    </DataTablePrime>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import DataTablePrime from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'

const props = defineProps<{
  service: { listar: (params: any) => Promise<any>; excluir?: (id: string) => Promise<any> }
  routePrefix?: string
  showActions?: boolean
  searchFields?: string[]
}>()

const confirm = useConfirm()
const toast = useToast()

const items = ref<any[]>([])
const loading = ref(false)
const totalRecords = ref(0)
const perPage = ref(20)
const currentPage = ref(1)
const first = ref(0)
const sortField = ref<string>()
const sortOrder = ref<string>('desc')
const searchText = ref('')
let searchTimeout: ReturnType<typeof setTimeout>

async function fetchData() {
  loading.value = true
  try {
    const { data: res } = await props.service.listar({
      page: currentPage.value,
      per_page: perPage.value,
      sort_by: sortField.value,
      sort_order: sortOrder.value,
      q: searchText.value || undefined,
    })
    items.value = res.data?.items || []
    totalRecords.value = res.data?.total || 0
  } catch { items.value = [] }
  finally { loading.value = false }
}

function onPage(event: any) {
  currentPage.value = Math.floor(event.first / event.rows) + 1
  perPage.value = event.rows
  first.value = event.first
  fetchData()
}

function onSort(event: any) {
  sortField.value = event.sortField
  sortOrder.value = event.sortOrder === 1 ? 'asc' : 'desc'
  fetchData()
}

function onSearch() {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    currentPage.value = 1
    first.value = 0
    fetchData()
  }, 500)
}

function onDelete(data: any) {
  confirm.require({
    message: 'Tem certeza que deseja excluir este registro?',
    header: 'Confirmar exclusao',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'Sim, excluir',
    rejectLabel: 'Cancelar',
    accept: async () => {
      try {
        if (props.service.excluir) {
          await props.service.excluir(data.id)
          toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Registro excluido', life: 3000 })
          fetchData()
        }
      } catch {
        toast.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao excluir', life: 5000 })
      }
    },
  })
}

onMounted(fetchData)

defineExpose({ fetchData })
</script>
