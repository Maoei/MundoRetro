<script setup>
import { ref, onMounted, reactive } from 'vue';
import Chart from 'chart.js/auto';
import { createStructuralDirectiveTransform } from '@vue/compiler-core';

const graficoData = reactive({
  name: '',
  dados: [],
});

let exibir = false;

onMounted(async () => {
  await getGrafico();

  // Certifique-se de que o elemento myChart existe no DOM
  const ctx = document.getElementById('myChart');

  if (!ctx) {
    console.error('Elemento myChart não encontrado no DOM.');
    return;
  }

  let rrObjects = [];
  let r = 255;
  let datas = [];
  let valores = [];

  graficoData.dados.forEach((item) => {
    valores[item.idProduto] = [];
    let count = valores[item.idProduto].push([item.valorProduto]);
    valores[item.idProduto].push([item.dtCompra]);
    console.log('valores ' + valores[item.idProduto]);
    console.log('count ' + count);
    console.log('item.valorProduto ' + item.valorProduto);
  });

  let arrayValores = [];

  graficoData.dados.forEach((item) => {
    datas.push(item.dtCompra);
    let count = 1;
    //console.log('item.somaVlrProduto ' + item.somaVlrProduto);
    valores.forEach((value, index) => {
      if (index == item.idProduto) {
        console.log('é igual');
        //let temp = value.split(',');
        console.log('value ' + typeof value);
        if (value[1] == item.dtCompra) {
          console.log('igual a dtCompra');
          arrayValores[count] = item.valorProduto;
        } else {
          arrayValores[count] = 0;
        }
      }
      count++;
    });
    console.log('arrayValores ' + arrayValores);
    rrObjects.push({
      data: arrayValores,
      backgroundColor: [
        `rgba(${r}, 99, 132, 0.2)`,
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
      ],
      borderColor: [
        `rgba(${r}, 99, 132, 0.2)`,
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
      ],
      borderWidth: 1,
    });
    arrayValores = [];
    r -= 10;
  });

  let datasExibir = [];

  graficoData.dados.forEach((item) => {
    datasExibir.push(item.dtCompra);
  });

  let labelsData = [...new Set(datasExibir)];

  const myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labelsData,
      datasets: rrObjects,
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
});

async function getGrafico() {
  try {
    const response = await fetch('http://localhost:3001/getGrafico', {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`Erro ao buscar dados. Código: ${response.status}`);
    }

    const data = await response.json();
    console.log('Resposta do backend:', data);
    graficoData.dados = data;
    exibir = true;
  } catch (error) {
    console.error('Erro ao enviar dados:', error);
  }
}
</script>

<template>
  <div class="container text-center">
    <div class="row">
      <div class="col">
        <h1>Gráfico de Vendas</h1>
      </div>
    </div>
  </div>
  <div class="container">
    <div class="row">
      <div class="col-md-6">
        <canvas id="myChart" width="100" height="100"></canvas>
      </div>
    </div>
  </div>
</template>

<style></style>
