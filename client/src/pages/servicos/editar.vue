<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">Editar Servico</h1>
    <div v-if="fetching" class="flex justify-center p-8"><i class="pi pi-spin pi-spinner text-4xl"></i></div>
    <Card v-else>
      <template #content>
        <form @submit.prevent="onSubmit" class="flex flex-col gap-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="flex flex-col gap-1">
              <label class="font-medium text-sm">Nome *</label>
              <InputText v-model="form.nome" placeholder="Nome do servico" />
              <small v-if="errors.nome" class="text-red-500">{{ errors.nome }}</small>
            </div>
            <div class="flex flex-col gap-1"><label class="font-medium text-sm">Valor</label><MoneyInput v-model="form.valor" /></div>
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
import { useForm } from '@/composables/useForm'
import { servicosService } from '@/services/servicosService'

const route = useRoute()
const router = useRouter()
const fetching = ref(false)
const form = reactive({ nome: '', valor: null as any, descricao: '' })
const { loading, errors, submit } = useForm((data: any) => servicosService.editar(route.params.id as string, data))
onMounted(async () => {
  fetching.value = true
  try {
    const { data: res } = await servicosService.buscar(route.params.id as string)
    const d = res.data; form.nome = d.nome || ''; form.valor = d.valor || null; form.descricao = d.descricao || ''
  } finally { fetching.value = false }
})
async function onSubmit() { try { await submit({ ...form }); router.push('/servicos') } catch {} }
</script>
