import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/produtos',
      name: 'produtos',
      component: () => import('../views/ProdutosView.vue'),
    },
    {
      path: '/carrinho',
      name: 'carrinho',
      component: () => import('../views/CarrinhoView.vue'),
    },
    {
      path: '/checkout',
      name: 'checkout',
      component: () => import('../views/CheckOutView.vue'),
    },
    {
      path: '/produtos/detalhe/:id',
      name: 'produtoDetalhe',
      component: () => import('../views/ProdutoDetalheView.vue'),
      props: true,
    },
    {
      path: '/enderecos',
      name: 'enderecos',
      component: () => import('../views/EnderecosView.vue'),
      props: true,
    },
    {
      path: '/enderecos/cadastro/:id',
      name: 'enderecosCadastro',
      component: () => import('../views/EnderecosCadastroView.vue'),
      props: true,
    },
    {
      path: '/enderecos/editar/:id',
      name: 'enderecosEditar',
      component: () => import('../views/EnderecosEditarView.vue'),
      props: true,
    },
    {
      path: '/cartoes',
      name: 'cartoes',
      component: () => import('../views/CartoesView.vue'),
      props: true,
    },
    {
      path: '/cartoes/editar/:id',
      name: 'cartoesEditar',
      component: () => import('../views/CartoesEditarView.vue'),
      props: true,
    },
    {
      path: '/cartoes/cadastro/:id',
      name: 'cartoesCadastro',
      component: () => import('../views/CartoesCadastroView.vue'),
      props: true,
    },
    {
      path: '/usuario/cadastro',
      name: 'usuarioCadastro',
      component: () => import('../views/UsuarioCadastroView.vue'),
      props: true,
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../views/AdminHomeView.vue'),
      props: true,
    },
    {
      path: '/admin/pedidos',
      name: 'adminPedidos',
      component: () => import('../views/AdminVendasView.vue'),
      props: true,
    },
    {
      path: '/admin/pedidos/:id',
      name: 'adminPedidoDetalhe',
      component: () => import('../views/AdminVendasDetalheView.vue'),
      props: true,
    },
    {
      path: '/admin/usuarios',
      name: 'adminUsuarios',
      component: () => import('../views/AdminUsuariosView.vue'),
      props: true,
    },
    {
      path: '/admin/produtos',
      name: 'adminProdutos',
      component: () => import('../views/AdminProdutosView.vue'),
      props: true,
    },
    {
      path: '/conta/:id',
      name: 'dadosConta',
      component: () => import('../views/DadosConta.vue'),
      props: true,
    },
    {
      path: '/cupons-disponiveis',
      name: 'cuponsDisponiveis',
      component: () => import('../views/CuponsDisponiveisView.vue'),
      props: true,
    },
    {
      path: '/cupons-expirados',
      name: 'cuponsExpirados',
      component: () => import('../views/CuponsExpiradosView.vue'),
      props: true,
    },
    {
      path: '/pedidos',
      name: 'pedidos',
      component: () => import('../views/PedidosView.vue'),
      props: true,
    },
    {
      path: '/pedidos/detalhe/:id',
      name: 'pedidosDetalhe',
      component: () => import('../views/PedidosDetalheView.vue'),
      props: true,
    },
    {
      path: '/grafico',
      name: 'grafico',
      component: () => import('../views/ChartView.vue'),
      props: true,
    },
    {
      path: '/dados-pessoais',
      name: 'dadosPessoais',
      component: () => import('../views/DadosPessoais.vue'),
      props: true,
    },
    {
      path: '/dados-pessoais/editar',
      name: 'dadosPessoaisEditar',
      component: () => import('../views/DadosPessoaisEditar.vue'),
      props: true,
    },
  ],
});

export default router;
