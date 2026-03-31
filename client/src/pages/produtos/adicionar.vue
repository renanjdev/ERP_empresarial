<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">Novo Produto</h1>
    <Card>
      <template #content>
        <form @submit.prevent="onSubmit" class="flex flex-col gap-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="flex flex-col gap-1">
              <label class="font-medium text-sm">Nome *</label>
              <InputText v-model="form.nome" placeholder="Nome do produto" />
              <small v-if="errors.nome" class="text-red-500">{{ errors.nome }}</small>
            </div>
            <div class="flex flex-col gap-1">
              <label class="font-medium text-sm">SKU</label>
              <InputText v-model="form.sku" placeholder="Codigo SKU" />
            </div>
            <div class="flex flex-col gap-1">
              <label class="font-medium text-sm">Valor de Venda</label>
              <MoneyInput v-model="form.valor_venda" />
            </div>
            <div class="flex flex-col gap-1">
              <label class="font-medium text-sm">Valor de Custo</label>
              <MoneyInput v-model="form.valor_custo" />
            </div>
            <div class="flex flex-col gap-1">
              <label class="font-medium text-sm">Unidade</label>
              <div class="flex gap-2">
                <FormAutocomplete v-model="form.unidade" endpoint="/unidades/buscaUnidades" optionLabel="nome" placeholder="Buscar unidade..." class="flex-1" />
                <Button type="button" icon="pi pi-cog" severity="secondary" @click="showUnidadesDialog = true" />
              </div>
            </div>
            <div class="flex flex-col gap-1">
              <label class="font-medium text-sm">Grupo</label>
              <div class="flex gap-2">
                <FormAutocomplete v-model="form.grupo" endpoint="/grupos_produtos/buscaGruposProdutos" optionLabel="nome" placeholder="Buscar grupo..." class="flex-1" />
                <Button type="button" icon="pi pi-cog" severity="secondary" @click="showGruposDialog = true" />
              </div>
            </div>
          </div>
          <div class="flex flex-col gap-1">
            <label class="font-medium text-sm">Descricao</label>
            <Textarea v-model="form.descricao" rows="3" placeholder="Descricao do produto" />
          </div>
          <div class="flex gap-2 justify-end">
            <Button label="Cancelar" severity="secondary" type="button" @click="$router.back()" />
            <Button label="Salvar" type="submit" :loading="loading" />
          </div>
        </form>
      </template>
    </Card>
    <Dialog v-model:visible="showGruposDialog" header="Gerenciar Grupos de Produtos" :style="{ width: '500px' }" modal>
      <div class="flex gap-2 mb-4">
        <InputText v-model="novoGrupo" placeholder="Nome do grupo" class="flex-1" @keyup.enter="adicionarGrupo" />
        <Button label="Adicionar" icon="pi pi-plus" @click="adicionarGrupo" :loading="loadingGrupo" />
      </div>
      <div v-if="loadingGruposList" class="flex justify-center p-4"><i class="pi pi-spin pi-spinner"></i></div>
      <ul v-else class="flex flex-col gap-2">
        <li v-for="g in grupos" :key="g.id" class="flex justify-between items-center border rounded p-2">
          <span>{{ g.nome }}</span>
          <Button icon="pi pi-trash" severity="danger" text size="small" @click="excluirGrupo(g.id)" />
        </li>
        <li v-if="!grupos.length" class="text-gray-400 text-center p-4">Nenhum grupo cadastrado</li>
      </ul>
    </Dialog>
    <Dialog v-model:visible="showUnidadesDialog" header="Gerenciar Unidades" :style="{ width: '500px' }" modal>
      <div class="flex gap-2 mb-4">
        <InputText v-model="novaUnidade" placeholder="Nome da unidade" class="flex-1" @keyup.enter="adicionarUnidade" />
        <Button label="Adicionar" icon="pi pi-plus" @click="adicionarUnidade" :loading="loadingUnidade" />
      </div>
      <div v-if="loadingUnidadesList" class="flex justify-center p-4"><i class="pi pi-spin pi-spinner"></i></div>
      <ul v-else class="flex flex-col gap-2">
        <li v-for="u in unidades" :key="u.id" class="flex justify-between items-center border rounded p-2">
          <span>{{ u.nome }} <span v-if="u.sigla" class="text-gray-500">({{ u.sigla }})</span></span>
          <Button icon="pi pi-trash" severity="danger" text size="small" @click="excluirUnidade(u.id)" />
        </li>
        <li v-if="!unidades.length" class="text-gray-400 text-center p-4">Nenhuma unidade cadastrada</li>
      </ul>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import MoneyInput from '@/components/common/MoneyInput.vue'
import FormAutocomplete from '@/components/common/FormAutocomplete.vue'
import { useForm } from '@/composables/useForm'
import { produtosService } from '@/services/produtosService'
import { gruposProdutosService } from '@/services/gruposProdutosService'
import { unidadesService } from '@/services/unidadesService'
import { useToast } from 'primevue/usetoast'

const router = useRouter()
const toast = useToast()
const form = reactive({ nome: '', sku: '', descricao: '', valor_venda: null as any, valor_custo: null as any, unidade: null as any, grupo: null as any })
const showGruposDialog = ref(false)
const showUnidadesDialog = ref(false)
const novoGrupo = ref('')
const novaUnidade = ref('')
const grupos = ref<any[]>([])
const unidades = ref<any[]>([])
const loadingGrupo = ref(false)
const loadingUnidade = ref(false)
const loadingGruposList = ref(false)
const loadingUnidadesList = ref(false)

async function carregarGrupos() {
  loadingGruposList.value = true
  try { const { data: res } = await gruposProdutosService.listar({ per_page: 100 }); grupos.value = res.data?.items || [] }
  finally { loadingGruposList.value = false }
}
async function carregarUnidades() {
  loadingUnidadesList.value = true
  try { const { data: res } = await unidadesService.listar({ per_page: 100 }); unidades.value = res.data?.items || [] }
  finally { loadingUnidadesList.value = false }
}
watch(showGruposDialog, (v) => { if (v) carregarGrupos() })
watch(showUnidadesDialog, (v) => { if (v) carregarUnidades() })
async function adicionarGrupo() {
  if (!novoGrupo.value.trim()) return
  loadingGrupo.value = true
  try { await gruposProdutosService.criar({ nome: novoGrupo.value.trim() }); novoGrupo.value = ''; await carregarGrupos(); toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Grupo adicionado', life: 3000 }) }
  catch { toast.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao adicionar grupo', life: 5000 }) }
  finally { loadingGrupo.value = false }
}
async function excluirGrupo(id: string) {
  try { await gruposProdutosService.excluir(id); await carregarGrupos(); toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Grupo excluido', life: 3000 }) }
  catch { toast.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao excluir', life: 5000 }) }
}
async function adicionarUnidade() {
  if (!novaUnidade.value.trim()) return
  loadingUnidade.value = true
  try { await unidadesService.criar({ nome: novaUnidade.value.trim() }); novaUnidade.value = ''; await carregarUnidades(); toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Unidade adicionada', life: 3000 }) }
  catch { toast.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao adicionar unidade', life: 5000 }) }
  finally { loadingUnidade.value = false }
}
async function excluirUnidade(id: string) {
  try { await unidadesService.excluir(id); await carregarUnidades(); toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Unidade excluida', life: 3000 }) }
  catch { toast.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao excluir', life: 5000 }) }
}
const { loading, errors, submit } = useForm((data: any) => produtosService.criar(data))
async function onSubmit() {
  try {
    const payload = { ...form, unidade_id: form.unidade?.id || null, grupo_id: form.grupo?.id || null }
    await submit(payload)
    router.push('/produtos')
  } catch {}
}
</script>
