<template>
  <Card class="shadow-lg">
    <template #content>
      <div class="flex flex-col items-center mb-6">
        <h1 class="text-xl font-bold text-gray-800">Redefinir Senha</h1>
        <p class="text-gray-500 mt-1 text-sm text-center">
          Crie uma nova senha para sua conta
        </p>
      </div>

      <form @submit.prevent="handleSubmit" class="flex flex-col gap-4">
        <div class="flex flex-col gap-1">
          <label for="nova_senha" class="text-sm font-medium text-gray-700">Nova Senha</label>
          <Password
            id="nova_senha"
            v-model="nova_senha"
            placeholder="Nova senha"
            class="w-full"
            toggleMask
            :disabled="loading"
            required
          />
        </div>

        <div class="flex flex-col gap-1">
          <label for="confirmar_senha" class="text-sm font-medium text-gray-700">Confirmar Senha</label>
          <Password
            id="confirmar_senha"
            v-model="confirmar_senha"
            placeholder="Confirme a nova senha"
            class="w-full"
            :feedback="false"
            toggleMask
            :disabled="loading"
            required
          />
        </div>

        <Button
          type="submit"
          label="Redefinir senha"
          class="w-full mt-2"
          :loading="loading"
        />
      </form>

      <div class="mt-4 text-center">
        <RouterLink to="/login" class="text-sm text-blue-600 hover:underline">
          Voltar ao login
        </RouterLink>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute, RouterLink } from 'vue-router'
import Card from 'primevue/card'
import Password from 'primevue/password'
import Button from 'primevue/button'
import { useToast } from 'primevue/usetoast'
import axios from 'axios'

const router = useRouter()
const route = useRoute()
const toast = useToast()

const nova_senha = ref('')
const confirmar_senha = ref('')
const loading = ref(false)

async function handleSubmit() {
  if (nova_senha.value !== confirmar_senha.value) {
    toast.add({ severity: 'error', summary: 'Erro', detail: 'As senhas nao coincidem.', life: 5000 })
    return
  }

  const token = route.query.token as string
  if (!token) {
    toast.add({ severity: 'error', summary: 'Erro', detail: 'Token de redefinicao invalido ou expirado.', life: 5000 })
    return
  }

  loading.value = true
  try {
    await axios.post('/api/auth/redefinir-senha', { token, nova_senha: nova_senha.value })
    toast.add({
      severity: 'success',
      summary: 'Senha redefinida',
      detail: 'Sua senha foi alterada com sucesso. Faca login.',
      life: 4000
    })
    setTimeout(() => router.push('/login'), 2000)
  } catch (err: any) {
    const msg = err.response?.data?.message || 'Erro ao redefinir senha. O link pode ter expirado.'
    toast.add({ severity: 'error', summary: 'Erro', detail: msg, life: 5000 })
  } finally {
    loading.value = false
  }
}
</script>
