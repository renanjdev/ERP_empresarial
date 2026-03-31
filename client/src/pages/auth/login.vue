<template>
  <Card class="shadow-lg">
    <template #content>
      <div class="flex flex-col items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-800">ERP Empresarial</h1>
        <p class="text-gray-500 mt-1">Acesse sua conta</p>
      </div>

      <form @submit.prevent="handleLogin" class="flex flex-col gap-4">
        <div class="flex flex-col gap-1">
          <label for="email" class="text-sm font-medium text-gray-700">E-mail</label>
          <InputText
            id="email"
            v-model="email"
            type="email"
            placeholder="seu@email.com"
            class="w-full"
            :disabled="loading"
            required
          />
        </div>

        <div class="flex flex-col gap-1">
          <label for="senha" class="text-sm font-medium text-gray-700">Senha</label>
          <Password
            id="senha"
            v-model="senha"
            placeholder="Sua senha"
            class="w-full"
            :feedback="false"
            toggleMask
            :disabled="loading"
            required
          />
        </div>

        <Button
          type="submit"
          label="Entrar"
          class="w-full mt-2"
          :loading="loading"
        />
      </form>

      <div class="mt-4 text-center">
        <RouterLink to="/recuperar-senha" class="text-sm text-blue-600 hover:underline">
          Esqueci minha senha
        </RouterLink>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'
import { useToast } from 'primevue/usetoast'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()

const email = ref('')
const senha = ref('')
const loading = ref(false)

async function handleLogin() {
  loading.value = true
  try {
    await authStore.login(email.value, senha.value)
    router.push('/')
  } catch (err: any) {
    const msg = err.response?.data?.message || 'Credenciais invalidas. Tente novamente.'
    toast.add({ severity: 'error', summary: 'Erro ao entrar', detail: msg, life: 5000 })
  } finally {
    loading.value = false
  }
}
</script>
