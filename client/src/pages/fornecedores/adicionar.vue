<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">Novo Fornecedor</h1>
    <Card>
      <template #content>
        <form @submit.prevent="onSubmit" class="flex flex-col gap-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="flex flex-col gap-1">
              <label class="font-medium text-sm">Razao Social *</label>
              <InputText v-model="form.razao_social" placeholder="Razao social" />
              <small v-if="errors.razao_social" class="text-red-500">{{ errors.razao_social }}</small>
            </div>
            <div class="flex flex-col gap-1">
              <label class="font-medium text-sm">Nome Fantasia</label>
              <InputText v-model="form.nome_fantasia" placeholder="Nome fantasia" />
            </div>
            <div class="flex flex-col gap-1">
              <label class="font-medium text-sm">CNPJ</label>
              <InputText v-model="form.cnpj" placeholder="00.000.000/0000-00" />
            </div>
            <div class="flex flex-col gap-1">
              <label class="font-medium text-sm">Email</label>
              <InputText v-model="form.email" type="email" placeholder="email@exemplo.com" />
            </div>
            <div class="flex flex-col gap-1">
              <label class="font-medium text-sm">Telefone</label>
              <InputText v-model="form.telefone" placeholder="(00) 0000-0000" />
            </div>
          </div>
          <div class="flex flex-col gap-1">
            <label class="font-medium text-sm">Observacoes</label>
            <Textarea v-model="form.observacoes" rows="3" placeholder="Observacoes" />
          </div>
          <!-- Enderecos -->
          <div>
            <div class="flex justify-between items-center mb-2">
              <h2 class="text-lg font-semibold">Enderecos</h2>
              <Button type="button" label="Adicionar Endereco" icon="pi pi-plus" severity="secondary" size="small" @click="addEndereco" />
            </div>
            <div v-for="(endereco, idx) in form.enderecos" :key="idx" class="border rounded p-3 mb-2">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div class="flex flex-col gap-1"><label class="font-medium text-sm">CEP</label><InputText v-model="endereco.cep" placeholder="00000-000" /></div>
                <div class="flex flex-col gap-1 md:col-span-2"><label class="font-medium text-sm">Logradouro</label><InputText v-model="endereco.logradouro" placeholder="Rua, Avenida..." /></div>
                <div class="flex flex-col gap-1"><label class="font-medium text-sm">Numero</label><InputText v-model="endereco.numero" placeholder="Numero" /></div>
                <div class="flex flex-col gap-1"><label class="font-medium text-sm">Complemento</label><InputText v-model="endereco.complemento" placeholder="Apto, Sala..." /></div>
                <div class="flex flex-col gap-1"><label class="font-medium text-sm">Bairro</label><InputText v-model="endereco.bairro" placeholder="Bairro" /></div>
                <div class="flex flex-col gap-1"><label class="font-medium text-sm">Cidade</label><InputText v-model="endereco.cidade" placeholder="Cidade" /></div>
                <div class="flex flex-col gap-1"><label class="font-medium text-sm">UF</label><InputText v-model="endereco.uf" placeholder="UF" maxlength="2" /></div>
                <div class="flex items-end"><Button type="button" icon="pi pi-trash" severity="danger" text @click="removeEndereco(idx)" /></div>
              </div>
            </div>
          </div>
          <!-- Contatos -->
          <div>
            <div class="flex justify-between items-center mb-2">
              <h2 class="text-lg font-semibold">Contatos</h2>
              <Button type="button" label="Adicionar Contato" icon="pi pi-plus" severity="secondary" size="small" @click="addContato" />
            </div>
            <div v-for="(contato, idx) in form.contatos" :key="idx" class="border rounded p-3 mb-2">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div class="flex flex-col gap-1"><label class="font-medium text-sm">Nome</label><InputText v-model="contato.nome" placeholder="Nome do contato" /></div>
                <div class="flex flex-col gap-1"><label class="font-medium text-sm">Cargo</label><InputText v-model="contato.cargo" placeholder="Cargo" /></div>
                <div class="flex flex-col gap-1"><label class="font-medium text-sm">Telefone</label><InputText v-model="contato.telefone" placeholder="(00) 0000-0000" /></div>
                <div class="flex flex-col gap-1"><label class="font-medium text-sm">Email</label><InputText v-model="contato.email" type="email" placeholder="email@exemplo.com" /></div>
                <div class="flex items-end"><Button type="button" icon="pi pi-trash" severity="danger" text @click="removeContato(idx)" /></div>
              </div>
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
import Textarea from 'primevue/textarea'
import Button from 'primevue/button'
import { useForm } from '@/composables/useForm'
import { fornecedoresService } from '@/services/fornecedoresService'

const router = useRouter()
const form = reactive({
  razao_social: '', nome_fantasia: '', cnpj: '', email: '', telefone: '', observacoes: '',
  enderecos: [] as any[], contatos: [] as any[],
})
function addEndereco() { form.enderecos.push({ cep: '', logradouro: '', numero: '', complemento: '', bairro: '', cidade: '', uf: '' }) }
function removeEndereco(idx: number) { form.enderecos.splice(idx, 1) }
function addContato() { form.contatos.push({ nome: '', telefone: '', email: '', cargo: '' }) }
function removeContato(idx: number) { form.contatos.splice(idx, 1) }
const { loading, errors, submit } = useForm((data: any) => fornecedoresService.criar(data))
async function onSubmit() { try { await submit({ ...form }); router.push('/fornecedores') } catch {} }
</script>
