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
      path: '/enderecos/cadastro',
      name: 'enderecosCadastro',
      component: () => import('../views/EnderecosCadastroView.vue'),
      props: true,
    },
  ],
});

export default router;