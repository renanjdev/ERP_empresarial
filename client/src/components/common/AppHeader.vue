<template>
  <Toolbar class="border-b border-gray-200 shadow-sm">
    <template #start>
      <Button
        icon="pi pi-bars"
        text
        rounded
        class="mr-2"
        @click="uiStore.toggleSidebar()"
        aria-label="Toggle Sidebar"
      />
      <span class="text-xl font-semibold text-gray-800">ERP Empresarial</span>
    </template>
    <template #end>
      <div class="flex items-center gap-3">
        <div class="relative">
          <Button
            icon="pi pi-bell"
            text
            rounded
            aria-label="Notificacoes"
          />
          <Badge
            v-if="notificacoesStore.contadorNovas > 0"
            :value="notificacoesStore.contadorNovas"
            severity="danger"
            class="absolute -top-1 -right-1"
          />
        </div>

        <div class="flex items-center gap-2 cursor-pointer" @click="toggleUserMenu">
          <Avatar
            :label="userInitials"
            shape="circle"
            class="bg-blue-500 text-white"
          />
          <span class="text-sm font-medium text-gray-700 hidden md:block">
            {{ authStore.usuario?.nome || 'Usuario' }}
          </span>
          <i class="pi pi-chevron-down text-xs text-gray-500" />
        </div>

        <Menu ref="userMenu" :model="userMenuItems" :popup="true" />
      </div>
    </template>
  </Toolbar>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import Toolbar from 'primevue/toolbar'
import Button from 'primevue/button'
import Badge from 'primevue/badge'
import Avatar from 'primevue/avatar'
import Menu from 'primevue/menu'
import { useAuthStore } from '@/stores/auth'
import { useUiStore } from '@/stores/ui'
import { useNotificacoesStore } from '@/stores/notificacoes'

const router = useRouter()
const authStore = useAuthStore()
const uiStore = useUiStore()
const notificacoesStore = useNotificacoesStore()

const userMenu = ref()

const userInitials = computed(() => {
  const nome = authStore.usuario?.nome || ''
  return nome.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase() || 'U'
})

const userMenuItems = computed(() => [
  {
    label: authStore.usuario?.nome || 'Usuario',
    items: [
      {
        label: 'Sair',
        icon: 'pi pi-sign-out',
        command: async () => {
          await authStore.logout()
          router.push('/login')
        }
      }
    ]
  }
])

function toggleUserMenu(event: Event) {
  userMenu.value.toggle(event)
}
</script>
