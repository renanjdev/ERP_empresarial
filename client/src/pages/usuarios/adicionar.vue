<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">Novo Usuario</h1>
    <Card>
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
              <label class="font-medium text-sm">Senha *</label>
              <Password v-model="form.senha" placeholder="Senha" :feedback="false" inputClass="w-full" />
              <small v-if="errors.senha" class="text-red-500">{{ errors.senha }}</small>
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
import { useRouter } from 'vue-router'
import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Select from 'primevue/select'
import Checkbox from 'primevue/checkbox'
import Button from 'primevue/button'
import { useForm } from '@/composables/useForm'
import { usuariosService } from '@/services/usuariosService'
import { api } from '@/composables/useApi'

const router = useRouter()
const grupos = ref<any[]>([])
const loadingGrupos = ref(false)
const form = reactive({ nome: '', email: '', senha: '', grupo_usuario_id: null as string | null, ativo: true })
const { loading, errors, submit } = useForm((data: any) => usuariosService.criar(data))

onMounted(async () => {
  loadingGrupos.value = true
  try { const { data: res } = await api.get('/grupos_usuarios/index', { params: { per_page: 100 } }); grupos.value = res.data?.items || [] }
  catch {} finally { loadingGrupos.value = false }
})
async function onSubmit() { try { await submit({ ...form }); router.push('/usuarios') } catch {} }
</script>
