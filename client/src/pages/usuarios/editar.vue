<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">Editar Usuario</h1>
    <div v-if="fetching" class="flex justify-center p-8"><i class="pi pi-spin pi-spinner text-4xl"></i></div>
    <Card v-else>
      <template #content>
        <form @submit.prevent="onSubmit" class="flex flex-col gap-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="flex flex-col gap-1">
              <label class="font-medium text-sm">Nome *</label>
              <InputText v-model="form.nome" placeholder="Nome completo" />
              <small v-if="errors.nome" class="text-red-500">{{ errors.nome }}</small>
            </div>
            <div class="flex flex-col gap-1">
              <label class="font-medium text-sm">Email *</label>
              <InputText v-model="form.email" type="email" placeholder="email@exemplo.com" />
              <small v-if="errors.email" class="text-red-500">{{ errors.email }}</small>
            </div>
            <div class="flex flex-col gap-1">
              <label class="font-medium text-sm">Nova Senha <span class="text-gray-400 font-normal">(opcional)</span></label>
              <Password v-model="form.senha" placeholder="Nova senha" :feedback="false" inputClass="w-full" />
            </div>
            <div class="flex flex-col gap-1">
              <label class="font-medium text-sm">Grupo de Usuario</label>
              <Select v-model="form.grupo_usuario_id" :options="grupos" optionLabel="nome" optionValue="id" placeholder="Selecione o grupo" class="w-full" :loading="loadingGrupos" />
            </div>
            <div class="flex items-center gap-2">
              <Checkbox v-model="form.ativo" :binary="true" inputId="ativo" />
              <label for="ativo" class="font-medium text-sm">Ativo</label>
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
import { reactive, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Select from 'primevue/select'
import Checkbox from 'primevue/checkbox'
import Button from 'primevue/button'
import { useForm } from '@/composables/useForm'
import { usuariosService } from '@/services/usuariosService'
import { api } from '@/composables/useApi'

const route = useRoute()
const router = useRouter()
const fetching = ref(false)
const grupos = ref<any[]>([])
const loadingGrupos = ref(false)
const form = reactive({ nome: '', email: '', senha: '', grupo_usuario_id: null as string | null, ativo: true })

const { loading, errors, submit } = useForm((data: any) => {
  const payload: any = { nome: data.nome, email: data.email, grupo_usuario_id: data.grupo_usuario_id, ativo: data.ativo }
  if (data.senha) payload.senha = data.senha
  return usuariosService.editar(route.params.id as string, payload)
})

onMounted(async () => {
  fetching.value = true; loadingGrupos.value = true
  try {
    const [userRes, gruposRes] = await Promise.all([
      usuariosService.buscar(route.params.id as string),
      api.get('/grupos_usuarios/index', { params: { per_page: 100 } }),
    ])
    const d = userRes.data.data
    form.nome = d.nome || ''; form.email = d.email || ''
    form.grupo_usuario_id = d.grupo_usuario_id || d.grupo_usuario?.id || null
    form.ativo = d.ativo ?? true
    grupos.value = gruposRes.data.data?.items || []
  } finally { fetching.value = false; loadingGrupos.value = false }
})
async function onSubmit() { try { await submit({ ...form }); router.push('/usuarios') } catch {} }
</script>
