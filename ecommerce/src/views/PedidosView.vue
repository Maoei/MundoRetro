<script setup>
import { ref, onMounted, reactive } from 'vue';

const checkoutProdutosData = reactive({
  name: '',
  produtos: [],
  statusPedidos: 'TODOS',
});

let id = '';
let exibir = false;

onMounted(async () => {
  id = localStorage.id; // Captura o ID do Local Storage
  console.log('id ', id);

  await getCheckoutProdutosId();
});

async function getCheckoutProdutosId() {
  let status = checkoutProdutosData.statusPedidos;
  fetch('http://localhost:3001/getPedidos/' + id + '/' + status, {
    method: 'GET',
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('Resposta do backend:', data);
      checkoutProdutosData.produtos = data;
      exibir = true;
    })
    .catch((error) => {
      console.error('Erro ao enviar dados:', error);
    });
}
</script>

<template v-if="exibir">
  <main>
    <div class="container">
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><a :href="'/conta/' + id">Conta</a></li>
          <li class="breadcrumb-item active" aria-current="page">
            Lista de Pedidos
          </li>
        </ol>
      </nav>

      <div class="row">
        <div class="col">
          <h2 class="text-center">Lista de Pedidos</h2>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <form class="d-flex" role="search">
            <select
              class="form-control me-2"
              type="search"
              placeholder="Search"
              aria-label="Search"
              v-model="checkoutProdutosData.statusPedidos"
              v-on:change="getCheckoutProdutosId()"
            >
              <option value="TODOS">TODOS</option>
              <option value="EM PROCESSAMENTO">EM PROCESSAMENTO</option>
              <option value="PEDIDO APROVADO">PEDIDO APROVADO</option>
              <option value="PAGAMENTO RECUSADO">PAGAMENTO RECUSADO</option>
              <option value="EM TRÂNSITO">EM TRÂNSITO</option>
              <option value="ENTREGUE">ENTREGUE</option>
              <option value="TROCA SOLICITADA">TROCA SOLICITADA</option>
              <option value="TROCA APROVADA">TROCA APROVADA</option>
              <option value="TROCA REALIZADA">TROCA REALIZADA</option>
              <option value="TROCA RECUSADA">TROCA RECUSADA</option>
            </select>
          </form>
        </div>
      </div>

      <div class="row">
        <div class="col mt-2">
          <div
            class="card mt-2"
            v-for="produto in checkoutProdutosData.produtos"
          >
            <div
              class="card-body d-flex align-items-center"
              style="white-space: pre-line"
            >
              {{
                'ID Pedido: ' +
                produto.id +
                '\n' +
                `Valor: ` +
                produto.valorFinal
              }}
              <div class="col">
                <a
                  href="#"
                  class="btn btn-secondary ms-5"
                  style="margin-right: 2px"
                  >{{ produto.status }}</a
                >
              </div>
              <div class="col">
                <RouterLink
                  class="btn btn-secondary float-end"
                  :to="'/pedidos/detalhe/' + produto.id"
                  >Detalhes do Pedido</RouterLink
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style></style>
