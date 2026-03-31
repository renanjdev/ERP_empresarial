<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">Dados da Empresa</h1>
    <div v-if="fetching" class="flex justify-center p-8"><i class="pi pi-spin pi-spinner text-4xl"></i></div>
    <Card v-else>
      <template #content>
        <form @submit.prevent="onSubmit" class="flex flex-col gap-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="flex flex-col gap-1">
              <label class="font-medium text-sm">CNPJ (somente leitura)</label>
              <InputText :value="form.cnpj" disabled />
            </div>
            <div class="flex flex-col gap-1">
              <label class="font-medium text-sm">Razao Social</label>
              <InputText v-model="form.razao_social" placeholder="Razao social" />
            </div>
            <div class="flex flex-col gap-1">
              <label class="font-medium text-sm">Nome Fantasia</label>
              <InputText v-model="form.nome_fantasia" placeholder="Nome fantasia" />
            </div>
            <div class="flex flex-col gap-1">
              <label class="font-medium text-sm">Email</label>
              <InputText v-model="form.email" type="email" placeholder="email@empresa.com" />
            </div>
            <div class="flex flex-col gap-1">
              <label class="font-medium text-sm">Telefone</label>
              <InputText v-model="form.telefone" placeholder="(00) 0000-0000" />
            </div>
          </div>
          <div class="flex gap-2 justify-end">
            <Button label="Salvar" type="submit" icon="pi pi-save" :loading="loading" />
          </div>
        </form>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import { useForm } from '@/composables/useForm'
import { empresasService } from '@/services/empresasService'

const fetching = ref(false)
const form = reactive({ cnpj: '', razao_social: '', nome_fantasia: '', email: '', telefone: '' })
const { loading, submit } = useForm((data: any) => empresasService.editar(data))

onMounted(async () => {
  fetching.value = true
  try {
    const { data: res } = await empresasService.visualizar()
    const d = res.data
    form.cnpj = d.cnpj || ''; form.razao_social = d.razao_social || ''
    form.nome_fantasia = d.nome_fantasia || ''; form.email = d.email || ''; form.telefone = d.telefone || ''
  } finally { fetching.value = false }
})
async function onSubmit() {
  try { await submit({ razao_social: form.razao_social, nome_fantasia: form.nome_fantasia, email: form.email, telefone: form.telefone }) }
  catch {}
}
</script>
