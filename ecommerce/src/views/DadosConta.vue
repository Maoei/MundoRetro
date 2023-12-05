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

<template>
  <main>
    <div class="container">
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
          <li class="breadcrumb-item active" aria-current="page">Conta</li>
        </ol>
      </nav>

      <div class="accordion" id="accordionExample">
        <div class="accordion-item">
          <h2 class="accordion-header" id="headingOne">
            <button
              class="accordion-button"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseOne"
              aria-expanded="true"
              aria-controls="collapseOne"
            >
              Dados da Conta
            </button>
          </h2>
          <div
            id="collapseOne"
            class="accordion-collapse collapse show"
            aria-labelledby="headingOne"
            data-bs-parent="#accordionExample"
          >
            <div class="accordion-body">
              <router-link to="/dados-pessoais">
                <div>Dados Pessoais</div>
              </router-link>
            </div>
            <div class="accordion-body">
              <router-link to="/enderecos">
                <div>Dados de Endereço</div>
              </router-link>
            </div>
            <div class="accordion-body">
              <router-link to="/cartoes">
                <div>Dados de Cartões</div>
              </router-link>
            </div>
          </div>
        </div>
        <div class="accordion-item">
          <h2 class="accordion-header" id="headingTwo">
            <button
              class="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseTwo"
              aria-expanded="false"
              aria-controls="collapseTwo"
            >
              Meus Pedidos
            </button>
          </h2>
          <div
            id="collapseTwo"
            class="accordion-collapse collapse"
            aria-labelledby="headingTwo"
            data-bs-parent="#accordionExample"
          >
            <div class="accordion-body">
              <router-link to="/pedidos">
                <div>Lista de Pedidos</div>
              </router-link>
            </div>
            <div class="accordion-body">
              <router-link to="/grafico">
                <div>Gráfico de Vendas</div>
              </router-link>
            </div>
          </div>
        </div>
        <div class="accordion-item">
          <h2 class="accordion-header" id="headingThree">
            <button
              class="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseThree"
              aria-expanded="false"
              aria-controls="collapseThree"
            >
              Meus Cupons
            </button>
          </h2>
          <div
            id="collapseThree"
            class="accordion-collapse collapse"
            aria-labelledby="headingThree"
            data-bs-parent="#accordionExample"
          >
            <div class="accordion-body">
              <router-link to="/cupons-disponiveis"> Disponíveis</router-link>
            </div>
            <div class="accordion-body">
              <router-link to="/cupons-expirados"> Expirados </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style></style>
