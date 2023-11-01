<script setup>
import { RouterLink, RouterView } from 'vue-router';
import HelloWorld from './components/HelloWorld.vue';
import { ref, onMounted, reactive } from 'vue';

const userData = reactive({
  name: '',
  users: [],
});

var exibir = false;

onMounted(async () => {
  console.log('onmounted ok');
  await getUsers();
  userData.nome = localStorage.name;
  userData.id = localStorage.id;
});

async function setUser(userId, userName) {
  console.log('usuario selecionado: ' + userId, userName);

  localStorage.name = userName;
  localStorage.id = userId;
  userData.id = localStorage.id;
  userData.nome = localStorage.name;
}

async function getUsers() {
  await fetch('http://localhost:3001/getUsers', {
    method: 'GET',
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('Resposta do backend:', data);
      userData.users = data;
      exibir = true;
    })
    .catch((error) => {
      console.error('Erro ao enviar dados:', error);
    });
}
</script>

<template v-if="exibir">
  <!-- <header>
    <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />
    <h1 class="text-center">E-commerce Store</h1>

    <div class="wrapper">
      <HelloWorld msg="You did it!" />
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div>
  </header> -->
  <nav
    class="navbar bg-dark border-bottom border-body navbar-expand-lg"
    data-bs-theme="dark"
  >
    <div class="container-fluid">
      <a class="navbar-brand" href="#">Navbar</a>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <template v-if="userData.id">
            <li class="nav-item">
              <a class="nav-link active" aria-current="page" href="#"
                >User: {{ userData.nome }}</a
              >
            </li>
          </template>
          <li class="nav-item">
            <RouterLink class="nav-link active" to="/about">About</RouterLink>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">Link</a>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/produtos">Produtos</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/checkout">Carrinho</RouterLink>
          </li>
          <li class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle"
              href="#"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Dropdown
            </a>
            <ul class="dropdown-menu">
              <li v-for="user in userData.users">
                <a
                  class="dropdown-item"
                  href="#"
                  v-on:click="setUser(user.id, user.nome)"
                  >{{ user.nome }}</a
                >
              </li>
              <li><hr class="dropdown-divider" /></li>
              <li><a class="dropdown-item" href="#">Something else here</a></li>
            </ul>
          </li>
          <li class="nav-item">
            <a class="nav-link disabled" aria-disabled="true">Disabled</a>
          </li>
        </ul>
        <form class="d-flex" role="search">
          <input
            class="form-control me-2"
            type="search"
            placeholder="Search"
            aria-label="Search"
          />
          <button class="btn btn-outline-success" type="submit">Search</button>
        </form>
      </div>
    </div>
  </nav>
  <br />

  <RouterView />

  <div class="fixed-bottom bg-dark" data-bs-theme="dark">
    <footer class="py-3 my-4">
      <ul class="nav justify-content-center border-bottom pb-3 mb-3">
        <li class="nav-item">
          <a href="#" class="nav-link px-2 text-body-secondary">Home</a>
        </li>
        <li class="nav-item">
          <a href="#" class="nav-link px-2 text-body-secondary">Features</a>
        </li>
        <li class="nav-item">
          <a href="#" class="nav-link px-2 text-body-secondary">Pricing</a>
        </li>
        <li class="nav-item">
          <a href="#" class="nav-link px-2 text-body-secondary">FAQs</a>
        </li>
        <li class="nav-item">
          <a href="#" class="nav-link px-2 text-body-secondary">About</a>
        </li>
      </ul>
      <p class="text-center text-body-secondary">© 2023 Company, Inc</p>
    </footer>
  </div>
</template>

<style scoped></style>
