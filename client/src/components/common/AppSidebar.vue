<template>
  <aside
    v-show="uiStore.sidebarAberta"
    class="sidebar"
    style="width: 250px; min-width: 250px; flex-shrink: 0;"
  >
    <PanelMenu :model="menuItems" class="border-none" />
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import PanelMenu from 'primevue/panelmenu'
import { useUiStore } from '@/stores/ui'
import { useMenusStore } from '@/stores/menus'

const router = useRouter()
const uiStore = useUiStore()
const menusStore = useMenusStore()

type MenuItemRaw = {
  label: string
  icon?: string
  to?: string
  visible?: boolean
  items?: MenuItemRaw[]
}

type MenuItem = {
  label: string
  icon?: string
  visible?: boolean
  command?: () => void
  items?: MenuItem[]
}

function mapItems(items: MenuItemRaw[]): MenuItem[] {
  return items.map((item) => {
    const mapped: MenuItem = {
      label: item.label,
      icon: item.icon,
      visible: item.visible,
    }
    if (item.to) {
      mapped.command = () => router.push(item.to!)
    }
    if (item.items) {
      mapped.items = mapItems(item.items)
    }
    return mapped
  })
}

const menuItems = computed(() => mapItems(menusStore.itens))
</script>

<style scoped>
.sidebar {
  background: white;
  border-right: 1px solid #e5e7eb;
  overflow-y: auto;
  height: 100%;
}
</style>
