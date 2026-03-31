import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      component: () => import('@/layouts/AuthLayout.vue'),
      children: [
        { path: '', name: 'login', component: () => import('@/pages/auth/login.vue') },
        { path: '/recuperar-senha', name: 'recuperar-senha', component: () => import('@/pages/auth/recuperar-senha.vue') },
        { path: '/redefinir-senha', name: 'redefinir-senha', component: () => import('@/pages/auth/redefinir-senha.vue') },
      ],
      meta: { public: true },
    },
    {
      path: '/',
      component: () => import('@/layouts/DefaultLayout.vue'),
      children: [
        { path: '', name: 'dashboard', component: () => import('@/pages/dashboard/index.vue'), meta: { breadcrumb: 'Inicio' } },
        { path: 'clientes', name: 'clientes', component: () => import('@/pages/clientes/index.vue'), meta: { breadcrumb: 'Clientes' } },
        { path: 'clientes/adicionar', name: 'clientes-adicionar', component: () => import('@/pages/clientes/adicionar.vue'), meta: { breadcrumb: 'Novo Cliente' } },
        { path: 'clientes/:id/visualizar', name: 'clientes-visualizar', component: () => import('@/pages/clientes/visualizar.vue'), meta: { breadcrumb: 'Visualizar Cliente' } },
        { path: 'clientes/:id/editar', name: 'clientes-editar', component: () => import('@/pages/clientes/editar.vue'), meta: { breadcrumb: 'Editar Cliente' } },
        { path: 'fornecedores', name: 'fornecedores', component: () => import('@/pages/fornecedores/index.vue'), meta: { breadcrumb: 'Fornecedores' } },
        { path: 'fornecedores/adicionar', name: 'fornecedores-adicionar', component: () => import('@/pages/fornecedores/adicionar.vue'), meta: { breadcrumb: 'Novo Fornecedor' } },
        { path: 'fornecedores/:id/visualizar', name: 'fornecedores-visualizar', component: () => import('@/pages/fornecedores/visualizar.vue'), meta: { breadcrumb: 'Visualizar Fornecedor' } },
        { path: 'fornecedores/:id/editar', name: 'fornecedores-editar', component: () => import('@/pages/fornecedores/editar.vue'), meta: { breadcrumb: 'Editar Fornecedor' } },
        { path: 'produtos', name: 'produtos', component: () => import('@/pages/produtos/index.vue'), meta: { breadcrumb: 'Produtos' } },
        { path: 'produtos/adicionar', name: 'produtos-adicionar', component: () => import('@/pages/produtos/adicionar.vue'), meta: { breadcrumb: 'Novo Produto' } },
        { path: 'produtos/:id/visualizar', name: 'produtos-visualizar', component: () => import('@/pages/produtos/visualizar.vue'), meta: { breadcrumb: 'Visualizar Produto' } },
        { path: 'produtos/:id/editar', name: 'produtos-editar', component: () => import('@/pages/produtos/editar.vue'), meta: { breadcrumb: 'Editar Produto' } },
        { path: 'servicos', name: 'servicos', component: () => import('@/pages/servicos/index.vue'), meta: { breadcrumb: 'Servicos' } },
        { path: 'servicos/adicionar', name: 'servicos-adicionar', component: () => import('@/pages/servicos/adicionar.vue'), meta: { breadcrumb: 'Novo Servico' } },
        { path: 'servicos/:id/visualizar', name: 'servicos-visualizar', component: () => import('@/pages/servicos/visualizar.vue'), meta: { breadcrumb: 'Visualizar Servico' } },
        { path: 'servicos/:id/editar', name: 'servicos-editar', component: () => import('@/pages/servicos/editar.vue'), meta: { breadcrumb: 'Editar Servico' } },
        { path: 'formas-pagamento', name: 'formas-pagamento', component: () => import('@/pages/formas-pagamento/index.vue'), meta: { breadcrumb: 'Formas de Pagamento' } },
        { path: 'formas-pagamento/adicionar', name: 'formas-pagamento-adicionar', component: () => import('@/pages/formas-pagamento/adicionar.vue'), meta: { breadcrumb: 'Nova Forma' } },
        { path: 'formas-pagamento/:id/visualizar', name: 'formas-pagamento-visualizar', component: () => import('@/pages/formas-pagamento/visualizar.vue'), meta: { breadcrumb: 'Visualizar Forma' } },
        { path: 'formas-pagamento/:id/editar', name: 'formas-pagamento-editar', component: () => import('@/pages/formas-pagamento/editar.vue'), meta: { breadcrumb: 'Editar Forma' } },
        { path: 'categorias', name: 'categorias', component: () => import('@/pages/categorias/index.vue'), meta: { breadcrumb: 'Plano de Contas' } },
        { path: 'centros-custo', name: 'centros-custo', component: () => import('@/pages/centros-custo/index.vue'), meta: { breadcrumb: 'Centros de Custo' } },
        { path: 'centros-custo/adicionar', name: 'centros-custo-adicionar', component: () => import('@/pages/centros-custo/adicionar.vue'), meta: { breadcrumb: 'Novo Centro' } },
        { path: 'centros-custo/:id/editar', name: 'centros-custo-editar', component: () => import('@/pages/centros-custo/editar.vue'), meta: { breadcrumb: 'Editar Centro' } },
        { path: 'usuarios', name: 'usuarios', component: () => import('@/pages/usuarios/index.vue'), meta: { breadcrumb: 'Usuarios' } },
        { path: 'usuarios/adicionar', name: 'usuarios-adicionar', component: () => import('@/pages/usuarios/adicionar.vue'), meta: { breadcrumb: 'Novo Usuario' } },
        { path: 'usuarios/:id/editar', name: 'usuarios-editar', component: () => import('@/pages/usuarios/editar.vue'), meta: { breadcrumb: 'Editar Usuario' } },
        { path: 'empresa', name: 'empresa', component: () => import('@/pages/empresa/index.vue'), meta: { breadcrumb: 'Empresa' } },
      ],
    },
  ],
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (!to.meta.public && !auth.isAuthenticated) return { name: 'login' }
})

export default router
