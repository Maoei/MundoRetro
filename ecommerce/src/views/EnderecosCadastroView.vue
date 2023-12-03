<script setup>
import { ref, onMounted, reactive } from 'vue';

const enderecoData = reactive({
  name: '',
  enderecos: [],
});

let id = '';
let exibir = false;
const enderecoDiferente = ref();

onMounted(async () => {
  id = localStorage.id; // Captura o ID do Local Storage
  console.log('id ', id);
  getEnderecos();
  console.log('enderecoDiferente ' + enderecoDiferente);
});

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
async function addEndereco(data) {
  try {
    const response = await fetch(`http://localhost:3001/addEndereco/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const responseData = await response.json();
      console.log('Resposta do backend:', responseData);
      enderecoData.enderecos = responseData;
      getEnderecos();
    } else {
      throw new Error('Erro ao enviar dados');
    }
  } catch (error) {
    console.error('Erro ao enviar dados:', error);
  }
}

function submitForm() {
  addEndereco({ ...enderecoData }); // Envia os dados do formulário para a função addEndereco
}

function logEnderecoDiferente() {
  console.log('enderecoDiferente ' + enderecoDiferente);
}
</script>

<template v-if="exibir">
  <main>
    <div class="container">
      <div class="row">
        <div class="col">
          <h1>Cadastro de Endereços</h1>
        </div>
      </div>
      <div class="row">
        <div class="col-md-6">
          <form class="row g-3" @submit.prevent="submitForm">
            <div class="col-md-6">
              <label for="endereco">Endereço: </label>
              <input
                type="text"
                id="endereco"
                class="form-control"
                v-model="enderecoData.endereco"
              />
            </div>
            <div class="col-md-6">
              <label for="complemento">Complemento: </label>
              <input
                type="text"
                id="complemento"
                class="form-control"
                v-model="enderecoData.complemento"
              />
            </div>
            <div class="col-md-6">
              <label for="bairro">Bairro: </label>
              <input
                type="text"
                id="bairro"
                class="form-control"
                v-model="enderecoData.bairro"
              />
            </div>
            <div class="col-md-6">
              <label for="numero">Número: </label>
              <input
                type="text"
                id="numero"
                class="form-control"
                v-model="enderecoData.numero"
              />
            </div>
            <div class="col-md-6">
              <label for="cidade">Cidade: </label>
              <input
                type="text"
                id="cidade"
                class="form-control"
                v-model="enderecoData.cidade"
              />
            </div>
            <div class="col-md-6">
              <label for="cep">CEP: </label>
              <input
                type="text"
                id="cep"
                class="form-control"
                v-model="enderecoData.cep"
              />
            </div>
            <div class="col-md-6">
              <label for="estado">Estado: </label>
              <input
                type="text"
                id="estado"
                class="form-control"
                v-model="enderecoData.estado"
              />
            </div>

            <div class="col-12">
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="checkbox"
                  id="flexCheckDefault"
                  v-model="enderecoDiferente"
                  @click="logEnderecoDiferente()"
                />
                <label class="form-check-label" for="flexCheckDefault">
                  Endereço de Entrega DIFERENTE do Endereço de Cobrança
                </label>
              </div>
            </div>

            <div class="row g-3" v-if="enderecoDiferente">
              <div class="col-md-6">
                <label for="endereco">Endereço: </label>
                <input
                  type="text"
                  id="endereco"
                  class="form-control"
                  v-model="enderecoData.endereco"
                />
              </div>
              <div class="col-md-6">
                <label for="complemento">Complemento: </label>
                <input
                  type="text"
                  id="complemento"
                  class="form-control"
                  v-model="enderecoData.complemento"
                />
              </div>
              <div class="col-md-6">
                <label for="bairro">Bairro: </label>
                <input
                  type="text"
                  id="bairro"
                  class="form-control"
                  v-model="enderecoData.bairro"
                />
              </div>
              <div class="col-md-6">
                <label for="numero">Número: </label>
                <input
                  type="text"
                  id="numero"
                  class="form-control"
                  v-model="enderecoData.numero"
                />
              </div>
              <div class="col-md-6">
                <label for="cidade">Cidade: </label>
                <input
                  type="text"
                  id="cidade"
                  class="form-control"
                  v-model="enderecoData.cidade"
                />
              </div>
              <div class="col-md-6">
                <label for="cep">CEP: </label>
                <input
                  type="text"
                  id="cep"
                  class="form-control"
                  v-model="enderecoData.cep"
                />
              </div>
              <div class="col-md-6">
                <label for="estado">Estado: </label>
                <input
                  type="text"
                  id="estado"
                  class="form-control"
                  v-model="enderecoData.estado"
                />
              </div>
            </div>

            <div class="col-12">
              <button type="submit" class="btn btn-secondary">
                Cadastrar Endereço
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </main>
</template>

<style></style>
