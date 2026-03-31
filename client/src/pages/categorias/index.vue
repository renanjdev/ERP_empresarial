<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">Plano de Contas</h1>
      <Button label="Nova Categoria" icon="pi pi-plus" @click="openDialog(null)" />
    </div>
    <Card>
      <template #content>
        <div v-if="loading" class="flex justify-center p-8"><i class="pi pi-spin pi-spinner text-4xl"></i></div>
        <TreeTable v-else :value="nodes">
          <Column field="nome" header="Nome" expander style="width: 50%" />
          <Column header="Tipo" style="width: 20%">
            <template #body="{ node }">
              <Tag :value="node.data.tipo === 'receita' ? 'Receita' : 'Despesa'" :severity="node.data.tipo === 'receita' ? 'success' : 'danger'" />
            </template>
          </Column>
          <Column header="Acoes" style="width: 30%">
            <template #body="{ node }">
              <div class="flex gap-1">
                <Button icon="pi pi-plus" severity="info" text rounded size="small" title="Subcategoria" @click="openDialog(node.data)" />
                <Button icon="pi pi-pencil" severity="warn" text rounded size="small" @click="openEdit(node.data)" />
                <Button icon="pi pi-trash" severity="danger" text rounded size="small" @click="excluir(node.data.id)" />
              </div>
            </template>
          </Column>
        </TreeTable>
      </template>
    </Card>

    <Dialog v-model:visible="showDialog" :header="editId ? 'Editar Categoria' : 'Nova Categoria'" :style="{ width: '400px' }" modal>
      <form @submit.prevent="salvar" class="flex flex-col gap-3">
        <div class="flex flex-col gap-1">
          <label class="font-medium text-sm">Nome *</label>
          <InputText v-model="form.nome" placeholder="Nome da categoria" autofocus />
        </div>
        <div class="flex flex-col gap-1">
          <label class="font-medium text-sm">Tipo *</label>
          <Select v-model="form.tipo" :options="tiposOpcoes" optionLabel="label" optionValue="value" placeholder="Selecione o tipo" class="w-full" />
        </div>
        <div v-if="form.pai_id" class="text-sm text-gray-500">Subcategoria de: {{ form.pai_nome }}</div>
        <div class="flex gap-2 justify-end mt-2">
          <Button label="Cancelar" severity="secondary" type="button" @click="showDialog = false" />
          <Button label="Salvar" type="submit" :loading="saving" />
        </div>
      </form>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import TreeTable from 'primevue/treetable'
import Column from 'primevue/column'
import Card from 'primevue/card'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import Tag from 'primevue/tag'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import { categoriasService } from '@/services/categoriasService'

const toast = useToast()
const confirm = useConfirm()
const nodes = ref<any[]>([])
const loading = ref(false)
const showDialog = ref(false)
const saving = ref(false)
const editId = ref<string | null>(null)
const tiposOpcoes = [{ label: 'Receita', value: 'receita' }, { label: 'Despesa', value: 'despesa' }]
const form = reactive({ nome: '', tipo: null as string | null, pai_id: null as string | null, pai_nome: '' })

function mapToNodes(items: any[]): any[] {
  return items.map((item: any) => ({
    key: item.id,
    data: item,
    children: item.filhos ? mapToNodes(item.filhos) : [],
  }))
}

async function carregar() {
  loading.value = true
  try {
    const { data: res } = await categoriasService.listar()
    nodes.value = mapToNodes(res.data?.items || res.data || [])
  } finally { loading.value = false }
}
onMounted(carregar)

function openDialog(pai: any) {
  editId.value = null; form.nome = ''; form.tipo = null
  form.pai_id = pai?.id || null; form.pai_nome = pai?.nome || ''
  showDialog.value = true
}
function openEdit(item: any) {
  editId.value = item.id; form.nome = item.nome || ''; form.tipo = item.tipo || null
  form.pai_id = item.pai_id || null; form.pai_nome = ''
  showDialog.value = true
}
async function salvar() {
  if (!form.nome || !form.tipo) return
  saving.value = true
  try {
    const payload: any = { nome: form.nome, tipo: form.tipo }
    if (form.pai_id) payload.pai_id = form.pai_id
    if (editId.value) { await categoriasService.editar(editId.value, payload) }
    else { await categoriasService.criar(payload) }
    toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Categoria salva', life: 3000 })
    showDialog.value = false; await carregar()
  } catch { toast.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao salvar categoria', life: 5000 }) }
  finally { saving.value = false }
}
function excluir(id: string) {
  confirm.require({
    message: 'Tem certeza que deseja excluir esta categoria?',
    header: 'Confirmar exclusao', icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'Sim, excluir', rejectLabel: 'Cancelar',
    accept: async () => {
      try { await categoriasService.excluir(id); toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Categoria excluida', life: 3000 }); await carregar() }
      catch { toast.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao excluir', life: 5000 }) }
    },
  })
}
</script>
