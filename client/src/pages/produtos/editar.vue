<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">Editar Produto</h1>
    <div v-if="fetching" class="flex justify-center p-8"><i class="pi pi-spin pi-spinner text-4xl"></i></div>
    <Card v-else>
      <template #content>
        <form @submit.prevent="onSubmit" class="flex flex-col gap-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="flex flex-col gap-1">
              <label class="font-medium text-sm">Nome *</label>
              <InputText v-model="form.nome" placeholder="Nome do produto" />
              <small v-if="errors.nome" class="text-red-500">{{ errors.nome }}</small>
            </div>
            <div class="flex flex-col gap-1"><label class="font-medium text-sm">SKU</label><InputText v-model="form.sku" placeholder="Codigo SKU" /></div>
            <div class="flex flex-col gap-1"><label class="font-medium text-sm">Valor de Venda</label><MoneyInput v-model="form.valor_venda" /></div>
            <div class="flex flex-col gap-1"><label class="font-medium text-sm">Valor de Custo</label><MoneyInput v-model="form.valor_custo" /></div>
            <div class="flex flex-col gap-1">
              <label class="font-medium text-sm">Unidade</label>
              <FormAutocomplete v-model="form.unidade" endpoint="/unidades/buscaUnidades" optionLabel="nome" placeholder="Buscar unidade..." />
            </div>
            <div class="flex flex-col gap-1">
              <label class="font-medium text-sm">Grupo</label>
              <FormAutocomplete v-model="form.grupo" endpoint="/grupos_produtos/buscaGruposProdutos" optionLabel="nome" placeholder="Buscar grupo..." />
            </div>
          </div>
          <div class="flex flex-col gap-1"><label class="font-medium text-sm">Descricao</label><Textarea v-model="form.descricao" rows="3" /></div>
          <div class="flex gap-2 justify-end">
            <Button label="Cancelar" severity="secondary" type="button" @click="$router.back()" />
            <Button label="Salvar" type="submit" :loading="loading" />
          </div>
        </form>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Button from 'primevue/button'
import MoneyInput from '@/components/common/MoneyInput.vue'
import FormAutocomplete from '@/components/common/FormAutocomplete.vue'
import { useForm } from '@/composables/useForm'
import { produtosService } from '@/services/produtosService'

const route = useRoute()
const router = useRouter()
const fetching = ref(false)
const form = reactive({ nome: '', sku: '', descricao: '', valor_venda: null as any, valor_custo: null as any, unidade: null as any, grupo: null as any })
const { loading, errors, submit } = useForm((data: any) => produtosService.editar(route.params.id as string, data))
onMounted(async () => {
  fetching.value = true
  try {
    const { data: res } = await produtosService.buscar(route.params.id as string)
    const d = res.data
    form.nome = d.nome || ''; form.sku = d.sku || ''; form.descricao = d.descricao || ''
    form.valor_venda = d.valor_venda || null; form.valor_custo = d.valor_custo || null
    form.unidade = d.unidade || null; form.grupo = d.grupo || null
  } finally { fetching.value = false }
})
async function onSubmit() {
  try {
    const payload = { ...form, unidade_id: form.unidade?.id || null, grupo_id: form.grupo?.id || null }
    await submit(payload); router.push('/produtos')
  } catch {}
}
</script>
