<script setup>
import { ref, onMounted, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const enderecoData = reactive({
  name: '',
  enderecos: [],
});

let id = '';
let exibir = false;
const route = useRoute();

onMounted(async () => {
  console.log(route.params.id);
  id = route.params.id;

  await getEnderecosId();
});

async function getEnderecosId() {
  let idEndereco = id;
  console.log('idEndereco ' + idEndereco);

  fetch('http://localhost:3001/getEnderecosId/' + idEndereco, {
    method: 'GET',
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('Resposta do backend:', data);
      enderecoData.enderecos = data;
      console.log('endereco ' + enderecoData.enderecos.endereco);
      console.log('cidade ' + enderecoData.enderecos.cidade);
      exibir = true;
    })
    .catch((error) => {
      console.error('Erro ao enviar dados:', error);
    });
}

function submitForm() {
  console.log('submitForm');
  //updateEndereco({ ...enderecoData }); // Envia os dados do formulário para a função addEndereco
}

async function updateEndereco(data) {
  console.log('updateEndereco');
  return 0;
  try {
    const response = await fetch(`http://localhost:3001/updateUser/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const responseData = await response.json();
      console.log('Resposta do backend:', responseData);
      clienteData.clientes = responseData;
      getEnderecosId();
      router.push('/dados-pessoais');
    } else {
      throw new Error('Erro ao enviar dados');
    }
  } catch (error) {
    console.error('Erro ao enviar dados:', error);
  }
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
        <div class="col">
          <form class="row g-3" @submit.prevent="submitForm">
            <div class="col-md-6">
              <label for="endereco">Endereço: </label>
              <input
                type="text"
                id="endereco"
                class="form-control"
                v-model="enderecoData.enderecos.endereco"
              />
            </div>
            <div class="col-md-6">
              <label for="complemento">Complemento: </label>
              <input
                type="text"
                id="complemento"
                class="form-control"
                v-model="enderecoData.enderecos.complemento"
              />
            </div>
            <div class="col-md-6">
              <label for="bairro">Bairro: </label>
              <input
                type="text"
                id="bairro"
                class="form-control"
                v-model="enderecoData.enderecos.bairro"
              />
            </div>
            <div class="col-md-6">
              <label for="numero">Número: </label>
              <input
                type="text"
                id="numero"
                class="form-control"
                v-model="enderecoData.enderecos.numero"
              />
            </div>
            <div class="col-md-6">
              <label for="cidade">Cidade: </label>
              <input
                type="text"
                id="cidade"
                class="form-control"
                v-model="enderecoData.enderecos.cidade"
              />
            </div>
            <div class="col-md-6">
              <label for="cep">CEP: </label>
              <input
                type="text"
                id="cep"
                class="form-control"
                v-model="enderecoData.enderecos.cep"
              />
            </div>
            <div class="col-md-6">
              <label for="estado">Estado: </label>
              <input
                type="text"
                id="estado"
                class="form-control"
                v-model="enderecoData.enderecos.estado"
              />
            </div>

            <div class="col-12">
              <button class="btn btn-secondary" type="submit">
                <RouterLink :to="'/enderecos'">Cancelar</RouterLink>
              </button>
              <button type="submit" class="btn btn-secondary">Salvar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </main>
</template>

<style></style>
