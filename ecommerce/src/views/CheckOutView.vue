<script setup>
import { ref, onMounted, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const carrinhoData = reactive({
  name: '',
  produtos: [],
  data: { qtd: 1 },
  valorTotal: 0.0,
});

const cartoesData = reactive({
  name: '',
  cartoes: [],
});

const enderecoData = reactive({
  name: '',
  enderecos: [],
});

const checkoutData = reactive({
  valorFinal: 0,
  idEndereco: '',
  idCliente: localStorage.id,
  idProduto: '',
  numeroCartao: '',
  valorProduto: 0,
  cartoes: [{}],
  qtdCartoes: 0,
  cupom: '',
  valorDesconto: 0,
  valorPago: 0,
  valorFrete: 0,
});

let id = '';
let exibir = false;
const router = useRouter();

onMounted(async () => {
  id = localStorage.id; // Captura o ID do Local Storage
  console.log('id ', id);

  await getCarrinho(); // Chama getCarrinho
  await getEnderecos();
  await getCartoes();
});

async function addCheckOut() {
  console.log('checkoutData.cartoes ' + checkoutData.cartoes);
  let checkTotal = 0;
  const pagamentosArray = []; // Create an array to hold the pagamentos objects
  console.log('cartoesData.cartoes: ' + cartoesData.cartoes);
  console.log('carrinhoData.produtos: ' + carrinhoData.produtos);

  checkoutData.cartoes.forEach((value, index) => {
    checkTotal += value.valor;
    console.log('value ' + value.id.numeroCartao);

    carrinhoData.produtos.forEach((item) => {
      console.log('item ' + item.produto_id);
      const pagamentoObj = {
        idProduto: item.produto_id,
        idCartao: value.id.id,
        valorCartao: value.valor,
        numeroCartao: value.id.numeroCartao,
        valorProduto: item.valor,
        qtd: item.qtd,
      };
      pagamentosArray.push(pagamentoObj);

      console.log(
        `checkoutData - Cartão ${index + 1}: ID Produto - ${
          pagamentoObj.idProduto
        }, ID Cartão - ${pagamentoObj.idCartao}, Valor - ${
          pagamentoObj.valorCartao
        }, Valor Produto - ${pagamentoObj.valorProduto}`
      );
    });
  });

  if (checkTotal != carrinhoData.valorTotal) {
    console.log('Valor não é igual ao total: ' + checkTotal);
  } else {
    console.log('Valor é igual ao total:  ' + checkTotal);
  }

  const requestBody = {
    idCliente: checkoutData.idCliente,
    valorFinal: carrinhoData.valorTotal,
    valorDesconto: checkoutData.valorDesconto,
    valorPago: checkoutData.valorPago,
    valorFrete: checkoutData.valorFrete,
    idEndereco: checkoutData.idEndereco,
    pagamentos: pagamentosArray, // Pass the array of pagamentos objects
  };
  console.log('requestBody ' + requestBody.pagamentos[0].idProduto);
  fetch(`http://localhost:3001/checkout/finalizar`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('Resposta do backend:', data);
      router.push('/');
    })
    .catch((error) => {
      console.error('Erro ao enviar dados:', error);
    });
}

async function getCarrinho() {
  fetch(`http://localhost:3001/getCarrinho/` + id, {
    method: 'GET',
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('Resposta do backend:', data);
      carrinhoData.produtos = data;
      carrinhoData.produtos.forEach((item) => {
        carrinhoData.valorTotal += Number(item.valor) * Number(item.qtd);
        //console.log(value);
        console.log(item.valor);
        console.log(item.qtd);
      });
      carrinhoData.valorTotal = Math.ceil(carrinhoData.valorTotal);
      checkoutData.valorPago = carrinhoData.valorTotal;

      exibir = true;
    })
    .catch((error) => {
      console.error('Erro ao enviar dados:', error);
    });
}

async function getEnderecos() {
  fetch('http://localhost:3001/getEnderecos/' + id, {
    method: 'GET',
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('Resposta do backend:', data);
      enderecoData.enderecos = data;
      exibir = true;
    })
    .catch((error) => {
      console.error('Erro ao enviar dados:', error);
    });
}
async function getCartoes() {
  fetch('http://localhost:3001/getCartoes/' + id, {
    method: 'GET',
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('Resposta do backend:', data);
      cartoesData.cartoes = data;
      exibir = true;
    })
    .catch((error) => {
      console.error('Erro ao enviar dados:', error);
    });
}

function addCartao() {
  checkoutData.qtdCartoes++;
  checkoutData.cartoes[checkoutData.qtdCartoes] = { id: '', valor: '' };

  console.log(checkoutData.qtdCartoes);
}

function removeCartao() {
  if (checkoutData.qtdCartoes > 0) {
    checkoutData.cartoes.splice(
      checkoutData.qtdCartoes,
      checkoutData.qtdCartoes
    );
    checkoutData.qtdCartoes--;
  }
}

function validarCupom() {
  console.log('cupom ' + checkoutData.cupom);
  console.log('idCliente ' + checkoutData.idCliente);

  const requestBody = {
    idCliente: checkoutData.idCliente,
    cupom: checkoutData.cupom,
  };
  console.log('cupom ' + requestBody.cupom);
  console.log('idCliente ' + requestBody.idCliente);

  fetch(`http://localhost:3001/validarCupom`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('data.valor ' + data.valor);
      console.log('valorPago ' + checkoutData.valorPago);
      console.log(
        'checkoutData.valorPago ' + checkoutData.valorPago - Number(data.valor)
      );
      if (data.valor > 0) {
        checkoutData.valorPago = checkoutData.valorPago - Number(data.valor);
      }

      console.log('Resposta do backend:', data);
    })
    .catch((error) => {
      console.error('Erro ao enviar dados:', error);
    });
}
function calcularFrete() {
  console.log('Funciona');
  checkoutData.valorFrete = Math.floor(Math.random() * 50);
}
function converterParaMaiusculas() {
  checkoutData.cupom = checkoutData.cupom.toUpperCase();
}
</script>

<template v-if="exibir">
  <main>
    <div class="container text-center">
      <div class="row">
        <h1>CheckOut</h1>
      </div>
      <div class="container">
        <div class="row">
          <div class="col">
            <h3>Valor dos Produtos</h3>
            <a href="#" class="btn btn-secondary" style="margin-right: 2px"
              >R$ {{ checkoutData.valorPago }}</a
            >
          </div>

          <div class="col">
            <h3>Valor do Frete</h3>
            <a href="#" class="btn btn-secondary" style="margin-right: 2px"
              >R$ {{ checkoutData.valorFrete }}</a
            >
          </div>
          <div class="col">
            <h3>Total a Pagar</h3>
            <a href="#" class="btn btn-secondary" style="margin-right: 2px"
              >R$
              {{
                Math.ceil(checkoutData.valorPago + checkoutData.valorFrete)
              }}</a
            >
          </div>
        </div>
      </div>
      <div class="row mt-2">
        <div class="col">
          <form>
            <div class="card-body">
              <div
                class="col"
                v-for="produto in carrinhoData.produtos"
                :key="produto.id"
              >
                <div class="card mb-3" style="max-width: 540px">
                  <div class="row g-0">
                    <div class="col-md-4">
                      <img
                        :src="
                          '../src/assets/images/' + produto.produto_id + '.png'
                        "
                        class="img-fluid rounded-start"
                        alt="..."
                      />
                    </div>
                    <div class="col-md-8">
                      <div class="card-body">
                        <h5 class="card-title">{{ produto.titulo }}</h5>
                        <p class="card-text">
                          {{ produto.descrProduto }}
                        </p>
                        <p class="card-text">
                          <input
                            type="number"
                            min="1"
                            :max="produto.produto_qtd"
                            v-model="produto.qtd"
                            v-on:change="
                              addCarrinho(produto.produto_id, produto.qtd)
                            "
                          />
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>

    <div class="row">
      <h1>Selecione o Endereço</h1>
      <div class="row">
        <div class="col">
          <select
            name=""
            id="cartao"
            v-model="checkoutData.idEndereco"
            v-on:change="calcularFrete()"
          >
            <option
              v-for="endereco in enderecoData.enderecos"
              :value="endereco.id"
            >
              {{ endereco.endereco }}
            </option>
          </select>
        </div>
        <div class="row mt-2">
          <div class="col">
            <RouterLink
              class="btn btn-secondary"
              :to="'/enderecos/cadastro/' + id"
              >Cadastrar Novo Endereço</RouterLink
            >
          </div>
        </div>
      </div>
      <div class="row">
        <h1>Selecione o Método de Pagamento</h1>
        <div class="row">
          <h2>Escolha o Cartão</h2>
        </div>
        <div class="row">
          <div class="col">
            <select name="" id="cartao_0" v-model="checkoutData.cartoes[0].id">
              <option v-for="cartao in cartoesData.cartoes" :value="cartao">
                {{ cartao.numeroCartao }}
              </option>
            </select>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <h2>Valor a Pagar no Cartão</h2>
            <input
              type="number"
              v-model="checkoutData.cartoes[0].valor"
              min="10"
              :max="carrinhoData.valorTotal + checkoutData.valorFrete"
            />
          </div>
        </div>

        <div class="row mt-2">
          <div class="col">
            <button class="btn btn-secondary" v-on:click="addCartao()">
              Adicionar Cartão
            </button>
            <button class="btn btn-secondary" v-on:click="removeCartao()">
              Remover Cartão
            </button>
          </div>
        </div>

        <div class="row mt-2">
          <div class="col">
            <RouterLink
              class="btn btn-secondary"
              :to="'/cartoes/cadastro/' + id"
              >Cadastrar Novo Cartão</RouterLink
            >
          </div>
        </div>

        <div class="row mt-2" v-for="(val, index) in checkoutData.qtdCartoes">
          <div class="col">
            <h2>Escolha o Cartão</h2>
            <select
              :name="'cartao_' + val"
              :id="'cartao_' + val"
              v-model="checkoutData.cartoes[val].id"
              :max="carrinhoData.valorTotal + checkoutData.valorFrete"
              :min="0"
            >
              <option v-for="cartao in cartoesData.cartoes" :value="cartao">
                {{ cartao.numeroCartao }}
              </option>
            </select>
            <h2>Valor a Pagar no Cartão</h2>
            <input
              type="number"
              v-model="checkoutData.cartoes[val].valor"
              min="10"
              :max="carrinhoData.valorTotal - checkoutData.cartoes[0].valor"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="row mt-2">
      <div class="col">
        <input
          type="text"
          v-model="checkoutData.cupom"
          @input="converterParaMaiusculas"
          placeholder="Insira o código do cupom"
        />
        <button class="btn btn-secondary" v-on:click="validarCupom()">
          Validar Cupom
        </button>
      </div>
    </div>
    <div class="row mt-2">
      <div class="col">
        <button class="btn btn-secondary" v-on:click="addCheckOut()">
          Finalizar
        </button>
      </div>
    </div>
  </main>
</template>
