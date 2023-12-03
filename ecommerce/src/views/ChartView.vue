<script setup>
import { ref, onMounted, reactive } from 'vue';
import Chart from 'chart.js/auto';
import { createStructuralDirectiveTransform } from '@vue/compiler-core';

const graficoData = reactive({
  name: '',
  dados: [],
  ini: '2023-11-01',
  fim: '2023-12-10',
});

let exibir = false;

onMounted(async () => {
  if (localStorage.dtInicio != null) {
    graficoData.ini = localStorage.dtInicio;
  }
  if (localStorage.dtFim != null) {
    graficoData.fim = localStorage.dtFim;
  }

  await getGrafico();

  // Certifique-se de que o elemento myChart existe no DOM
  const ctx = document.getElementById('myChart');

  if (!ctx) {
    console.error('Elemento myChart não encontrado no DOM.');
    return;
  }

  // Now you can use chartLabels as x-axis labels and chartDataset as your dataset in Chart.js
  //console.log(chartLabels); // Array of dtCompra values (x-axis labels)
  //console.log(chartDataset); // Array of datasets for Chart.js

  // Get all unique dates
  const allDates = graficoData.dados.labels.reduce((acc, curr) => {
    if (!acc.includes(curr)) {
      acc.push(curr);
    }
    return acc;
  }, []);

  // Sort dates in chronological order
  allDates.sort((a, b) => new Date(a) - new Date(b));

  // Generate datasets with empty values for dates without data
  const updatedDatasets = graficoData.dados.datasets.map((dataset) => {
    const newData = allDates.map((date) => {
      const index = graficoData.dados.labels.indexOf(date);
      return index !== -1 ? dataset.data[index] : null;
    });

    return { ...dataset, data: newData };
  });

  const myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: allDates,
      datasets: updatedDatasets,
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
});

async function getGrafico() {
  let ini = '';
  let fim = '';

  if (localStorage.dtInicio == null) {
    ini = '2023-12-01';
  } else {
    ini = localStorage.dtInicio;
  }

  if (localStorage.dtFim == null) {
    fim = '2023-12-03';
  } else {
    fim = localStorage.dtFim;
  }

  //ini = '2023-12-01';
  //fim = '2023-12-03';

  console.log('ini = ' + ini);
  console.log('fim = ' + fim);

  try {
    const response = await fetch(
      `http://localhost:3001/getGrafico?ini=${ini}&fim=${fim}`,
      {
        method: 'GET',
      }
    );

    if (!response.ok) {
      throw new Error(`Erro ao buscar dados. Código: ${response.status}`);
    }

    const data = await response.json();
    console.log('Resposta do backend grafico:', data);
    const { labels, datasets } = data;

    graficoData.dados.labels = labels;
    graficoData.dados.datasets = datasets;

    exibir = true;
  } catch (error) {
    console.error('Erro ao enviar dados:', error);
  }
}

function updateDates(inicio, fim) {
  localStorage.dtInicio = inicio;
  localStorage.dtFim = fim;
  window.location.reload();
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
  <div class="container">
    <div class="row">
      <div class="col">
        <label> Data Início </label
        ><input
          type="date"
          v-model="graficoData.ini"
          v-on:change="updateDates(graficoData.ini, graficoData.fim)"
        />
      </div>
      <div class="col">
        <div class="col">
          <label> Data Fim </label
          ><input
            type="date"
            v-model="graficoData.fim"
            v-on:change="updateDates(graficoData.ini, graficoData.fim)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style></style>
