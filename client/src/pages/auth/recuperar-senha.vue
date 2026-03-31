<template>
  <Card class="shadow-lg">
    <template #content>
      <div class="flex flex-col items-center mb-6">
        <h1 class="text-xl font-bold text-gray-800">Recuperar Senha</h1>
        <p class="text-gray-500 mt-1 text-sm text-center">
          Informe seu e-mail para receber o link de recuperacao
        </p>
      </div>

      <form @submit.prevent="handleSubmit" class="flex flex-col gap-4">
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

        <Button
          type="submit"
          label="Enviar link de recuperacao"
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
import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import { useToast } from 'primevue/usetoast'
import { RouterLink } from 'vue-router'
import axios from 'axios'

const toast = useToast()

const email = ref('')
const loading = ref(false)

async function handleSubmit() {
  loading.value = true
  try {
    await axios.post('/api/auth/recuperar-senha', { email: email.value })
    toast.add({
      severity: 'success',
      summary: 'E-mail enviado',
      detail: 'Se o e-mail estiver cadastrado, voce receberá o link de recuperacao.',
      life: 6000
    })
    email.value = ''
  } catch (err: any) {
    const msg = err.response?.data?.message || 'Erro ao enviar e-mail. Tente novamente.'
    toast.add({ severity: 'error', summary: 'Erro', detail: msg, life: 5000 })
  } finally {
    loading.value = false
  }
}
</script>
