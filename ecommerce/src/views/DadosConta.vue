<script setup>
import { ref, onMounted, reactive } from 'vue';

const cartoesData = reactive({
  name: '',
  cartoes: [],
});

let id = '';
let exibir = false;

onMounted(async () => {
  id = localStorage.id; // Captura o ID do Local Storage
  console.log('id ', id);
});
</script>

<template v-if="exibir">
  <main>
    <h>Dados da Conta</h>
    <div class="card-body">
      <router-link to="/dados-pessoais">
        <div>Dados Pessoais</div>
      </router-link>
      <router-link to="/enderecos">
        <div>Dados de Endereço</div>
      </router-link>
      <router-link to="/cartoes">
        <div>Dados de Cartões</div>
      </router-link>
    </div>

    <h>Meus Pedidos</h>
    <div class="card-body">
      <router-link to="/pedidos">
        <div>Entregues</div>
      </router-link>
      <router-link to="/pedidos-a-caminho">
        <div>A Caminho</div>
      </router-link>
      <router-link to="/trocas">
        <div>Trocas</div>
      </router-link>
    </div>

    <h>Meus Cupons</h>
    <div class="card-body">
      <router-link to="/cupons-disponiveis">
        <div>Disponíveis</div>
      </router-link>
      <router-link to="/cupons-expirados">
        <div>Expirados</div>
      </router-link>
    </div>
  </main>
</template>

<style></style>
