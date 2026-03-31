<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">Cliente</h1>
    <div v-if="loading" class="flex justify-center p-8">
      <i class="pi pi-spin pi-spinner text-4xl"></i>
    </div>
    <Card v-else-if="cliente">
      <template #content>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span class="font-semibold text-sm text-gray-500">Nome</span>
            <p class="mt-1">{{ cliente.nome }}</p>
          </div>
          <div>
            <span class="font-semibold text-sm text-gray-500">CPF/CNPJ</span>
            <p class="mt-1">{{ cliente.cpf_cnpj || '-' }}</p>
          </div>
          <div>
            <span class="font-semibold text-sm text-gray-500">Tipo de Pessoa</span>
            <p class="mt-1">{{ cliente.tipo_pessoa === 'F' ? 'Pessoa Fisica' : cliente.tipo_pessoa === 'J' ? 'Pessoa Juridica' : '-' }}</p>
          </div>
          <div>
            <span class="font-semibold text-sm text-gray-500">Email</span>
            <p class="mt-1">{{ cliente.email || '-' }}</p>
          </div>
          <div>
            <span class="font-semibold text-sm text-gray-500">Telefone</span>
            <p class="mt-1">{{ cliente.telefone || '-' }}</p>
          </div>
          <div>
            <span class="font-semibold text-sm text-gray-500">Celular</span>
            <p class="mt-1">{{ cliente.celular || '-' }}</p>
          </div>
          <div>
            <span class="font-semibold text-sm text-gray-500">Status</span>
            <p class="mt-1"><StatusBadge :status="cliente.ativo" /></p>
          </div>
          <div class="md:col-span-2">
            <span class="font-semibold text-sm text-gray-500">Observacoes</span>
            <p class="mt-1">{{ cliente.observacoes || '-' }}</p>
          </div>
        </div>

        <!-- Enderecos -->
        <div v-if="cliente.enderecos && cliente.enderecos.length" class="mt-6">
          <h2 class="text-lg font-semibold mb-2">Enderecos</h2>
          <div v-for="(end, idx) in cliente.enderecos" :key="idx" class="border rounded p-3 mb-2">
            <p>{{ end.logradouro }}, {{ end.numero }} {{ end.complemento ? '- ' + end.complemento : '' }}</p>
            <p>{{ end.bairro }} - {{ end.cidade }}/{{ end.uf }}</p>
            <p v-if="end.cep">CEP: {{ end.cep }}</p>
          </div>
        </div>

        <!-- Contatos -->
        <div v-if="cliente.contatos && cliente.contatos.length" class="mt-6">
          <h2 class="text-lg font-semibold mb-2">Contatos</h2>
          <div v-for="(cont, idx) in cliente.contatos" :key="idx" class="border rounded p-3 mb-2">
            <p class="font-medium">{{ cont.nome }} <span v-if="cont.cargo" class="text-gray-500 font-normal">- {{ cont.cargo }}</span></p>
            <p v-if="cont.telefone">Tel: {{ cont.telefone }}</p>
            <p v-if="cont.email">Email: {{ cont.email }}</p>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex gap-2">
          <Button label="Editar" icon="pi pi-pencil" @click="$router.push(`/clientes/${route.params.id}/editar`)" />
          <Button label="Voltar" severity="secondary" @click="$router.back()" />
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Card from 'primevue/card'
import Button from 'primevue/button'
import StatusBadge from '@/components/common/StatusBadge.vue'
import { clientesService } from '@/services/clientesService'

const route = useRoute()
const router = useRouter()
const cliente = ref<any>(null)
const loading = ref(false)

onMounted(async () => {
  loading.value = true
  try {
    const { data: res } = await clientesService.buscar(route.params.id as string)
    cliente.value = res.data
  } finally {
    loading.value = false
  }
})
</script>
