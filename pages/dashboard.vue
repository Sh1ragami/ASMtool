<template>
  <v-container fluid class="pa-5">
    <!-- 上段：円グラフと3つの四角形カード -->
    <v-row class="mb-2" align="center" justify="center" no-gutters>
      <!-- 円グラフ -->
      <v-col cols="12" md="3" class="d-flex justify-center">
        <div class="relative h-[200px] w-[200px] mx-auto">
          <canvas
            ref="doughnutChart"
            style="width: 100%; height: 100%"
          ></canvas>
        </div>
      </v-col>

      <!-- 四角形カード -->
      <v-col cols="12" md="3" v-for="(item, index) in squareData" :key="index">
        <v-card
          class="d-flex flex-column justify-center align-center text-center shadow-sm"
          :style="{
            backgroundColor: item.color,
            height: '20px',
            margin: '0 15px',
          }"
        >
        </v-card>
        <v-card
          class="d-flex flex-column justify-center align-center text-center shadow-sm"
          :style="{
            height: '160px',
            margin: '0 15px',
            font: '36px bold',
          }"
        >
          <div class="text-lg font-bold">{{ item.label }}</div>
          <div class="text-2xl font-bold">{{ item.value }}</div>
        </v-card>
      </v-col>
    </v-row>

    <!-- 下段：棒グラフ -->
    <v-row>
      <v-col cols="12">
        <v-card outlined>
          <v-card-title class="text-h6">月別データ</v-card-title>
          <v-card-text>
            <Bar :data="chartData" />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { Bar } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  DoughnutController,
  ArcElement,
} from "chart.js";

// Chart.js の登録
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  DoughnutController,
  ArcElement
);

// 円グラフデータとスコア
const doughnutChart = ref(null);
const score = ref("A"); // 中心に表示されるスコア

onMounted(() => {
  if (doughnutChart.value) {
    const ctx = doughnutChart.value.getContext("2d");
    new ChartJS(ctx, {
      type: "doughnut",
      data: {
        labels: ["high", "medium", "low"],
        datasets: [
          {
            backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
            data: [50, 30, 20],
          },
        ],
      },
      options: {
        cutout: "70%",
        plugins: {
          legend: {
            display: true,
            position: "bottom",
          },
        },
      },
      plugins: [
        {
          id: "customTextPlugin",
          beforeDraw(chart) {
            const { width, height, ctx } = chart;
            ctx.save();
            ctx.font = "bold 90px Arial";
            ctx.fillStyle = "red"; // テキストの色
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(score.value, width / 2, height / 2 - 10);
          },
        },
      ],
    });
  }
});

// 四角形カードデータ
const squareData = ref([
  { label: "High", value: 80, color: "#FF6384" },
  { label: "Medium", value: 50, color: "#36A2EB" },
  { label: "Low", value: 20, color: "#FFCE56" },
]);

// 棒グラフデータ
const chartData = {
  labels: [
    "1月",
    "2月",
    "3月",
    "4月",
    "5月",
    "6月",
    "7月",
    "8月",
    "9月",
    "10月",
    "11月",
    "12月",
    "1月",
    "2月",
    "3月",
    "4月",
    "5月",
    "6月",
    "7月",
    "8月",
    "9月",
    "10月",
    "11月",
    "12月",
  ],
  datasets: [
    {
      label: "IT資産の推移",
      backgroundColor: "#42A5F5",
      data: [
        219, 332, 321, 323, 225, 343, 332, 123, 445, 243, 342, 123, 219, 332,
        321, 323, 225, 443, 232, 123, 445, 443, 542, 123,
      ],
    },
  ],
};
</script>

<style>
/* 全体のスタイル */
.relative {
  position: relative;
}
.absolute {
  position: absolute;
}
.inset-0 {
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
</style>
