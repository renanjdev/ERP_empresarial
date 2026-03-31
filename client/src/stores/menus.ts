import { defineStore } from 'pinia'
import { computed } from 'vue'
import { useAuthStore } from './auth'

export const useMenusStore = defineStore('menus', () => {
  const auth = useAuthStore()
  const itens = computed(() => [
    { label: 'Inicio', icon: 'pi pi-home', to: '/' },
    {
      label: 'Cadastros', icon: 'pi pi-users',
      items: [
        { label: 'Clientes', icon: 'pi pi-user', to: '/clientes', visible: auth.can('clientes', 'visualizar') },
        { label: 'Fornecedores', icon: 'pi pi-truck', to: '/fornecedores', visible: auth.can('fornecedores', 'visualizar') },
      ],
    },
    {
      label: 'Produtos', icon: 'pi pi-box',
      items: [
        { label: 'Gerenciar Produtos', icon: 'pi pi-list', to: '/produtos', visible: auth.can('produtos', 'visualizar') },
        { label: 'Servicos', icon: 'pi pi-wrench', to: '/servicos', visible: auth.can('servicos', 'visualizar') },
      ],
    },
    {
      label: 'Financeiro', icon: 'pi pi-wallet',
      items: [
        { label: 'Formas de Pagamento', icon: 'pi pi-credit-card', to: '/formas-pagamento', visible: auth.can('formas_pagamentos', 'visualizar') },
        { label: 'Plano de Contas', icon: 'pi pi-sitemap', to: '/categorias', visible: auth.can('categorias', 'visualizar') },
        { label: 'Centros de Custo', icon: 'pi pi-building', to: '/centros-custo', visible: auth.can('centros_custos', 'visualizar') },
      ],
    },
    {
      label: 'Configuracoes', icon: 'pi pi-cog',
      items: [
        { label: 'Usuarios', icon: 'pi pi-users', to: '/usuarios', visible: auth.can('usuarios', 'visualizar') },
        { label: 'Empresa', icon: 'pi pi-building', to: '/empresa' },
      ],
    },
  ])
  return { itens }
})
