<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">Nova Forma de Pagamento</h1>
    <Card>
      <template #content>
        <form @submit.prevent="onSubmit" class="flex flex-col gap-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="flex flex-col gap-1">
              <label class="font-medium text-sm">Nome *</label>
              <InputText v-model="form.nome" placeholder="Nome da forma de pagamento" />
              <small v-if="errors.nome" class="text-red-500">{{ errors.nome }}</small>
            </div>
            <div class="flex flex-col gap-1">
              <label class="font-medium text-sm">Tipo</label>
              <Select v-model="form.tipo" :options="tiposOpcoes" optionLabel="label" optionValue="value" placeholder="Selecione o tipo" class="w-full" />
            </div>
          </div>
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
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import Button from 'primevue/button'
import { useForm } from '@/composables/useForm'
import { formasPagamentoService } from '@/services/formasPagamentoService'

const router = useRouter()
const tiposOpcoes = [
  { label: 'Dinheiro', value: 'dinheiro' },
  { label: 'PIX', value: 'pix' },
  { label: 'Cartao de Credito', value: 'cartao_credito' },
  { label: 'Cartao de Debito', value: 'cartao_debito' },
  { label: 'Boleto', value: 'boleto' },
  { label: 'Cheque', value: 'cheque' },
  { label: 'Outros', value: 'outros' },
]
const form = reactive({ nome: '', tipo: null as string | null })
const { loading, errors, submit } = useForm((data: any) => formasPagamentoService.criar(data))
async function onSubmit() { try { await submit({ ...form }); router.push('/formas-pagamento') } catch {} }
</script>
