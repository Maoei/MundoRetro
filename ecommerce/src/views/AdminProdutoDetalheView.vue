<script setup>
import { ref, onMounted, reactive } from 'vue';
import { useRoute } from 'vue-router';

const checkoutProdutosData = reactive({
  name: '',
  produtos: [],
});

let id = '';
let exibir = false;
const route = useRoute();

onMounted(async () => {
  id = route.params.id;
  console.log('Id: ' + id);

  getCheckoutProdutosDetalhe();
});

function getCheckoutProdutosDetalhe() {
  fetch('http://localhost:3001/getCheckoutProdutosDetalhe/' + id, {
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

function trocarStatus(produto) {
  let status = produto.status;

  const requestBody = {
    idCheckOut: id,
    idCliente: localStorage.id,
    idProduto: produto.idProduto,
    status: status,
    observacao: produto.observacao,
    valorCupom: produto.valorProduto,
  };
  console.log('status ' + requestBody.status);
  console.log('idCheckOut ' + requestBody.idCheckOut);
  console.log('observacao ' + requestBody.observacao);
  console.log('idProduto ' + requestBody.idProduto);
  console.log('valorCupom ' + requestBody.valorCupom);
  console.log('idCliente ' + requestBody.idCliente);

  fetch(`http://localhost:3001/trocarStatus`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('Resposta do backend:', data);
    })
    .catch((error) => {
      console.error('Erro ao enviar dados:', error);
    });
}
</script>

<template v-if="exibir">
  <main>
    <div class="container">
      <div class="row">
        <div class="col">
          <h1 class="text-center">Admin</h1>
          <h2 class="text-center">Altere o Status</h2>
        </div>
      </div>

      <div class="row">
        <div
          class="col"
          v-for="produto in checkoutProdutosData.produtos"
          :key="produto.idCheckOut"
        >
          <div class="card" style="width: 18rem">
            <img
              :src="'../../src/assets/images/' + produto.idProduto + '.png'"
              class="card-img-top"
              alt="..."
            />
            <div class="card-body">
              <h5 class="card-title">
                {{ produto.titulo }}
              </h5>
              <p class="card-text">{{ produto.descrProduto }}</p>
              <p class="card-text">
                <strong>ID Checkout:</strong> {{ produto.idCheckOut }}
              </p>
              <p class="card-text">
                <strong>ID Produto:</strong> {{ produto.idProduto }}
              </p>
              <p class="card-text">
                <strong>Valor:</strong> {{ produto.valorProduto }}
              </p>
              <p class="card-text">
                <strong>Gênero:</strong> {{ produto.genero }}
              </p>
              <label for="statusSelect">Selecione o Status:</label>
              <select v-model="produto.status">
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
              <div class="row">
                <div class="col">
                  <div v-if="produto.status == 'TROCA RECUSADA'">
                    <label for="observacao"> Motivo da Recusa: </label>
                    <textarea
                      name="observacao"
                      v-bind:style="{ height: '200px', width: '250px' }"
                      v-model="produto.observacao"
                      placeholder="Informe o motivo da recusa..."
                    >
                    </textarea>
                  </div>
                  <div class="row mt-2">
                    <div class="col">
                      <button class="btn btn-secondary" type="submit">
                        <RouterLink :to="'/admin'">Cancelar</RouterLink>
                      </button>
                      <button
                        class="btn btn-secondary"
                        type="submit"
                        @click="trocarStatus(checkoutProdutosData.produtos[0])"
                      >
                        Salvar
                        <!--<RouterLink :to="'/admin'">Salvar</RouterLink> -->
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style></style>
