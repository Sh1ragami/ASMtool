<template>
  <v-container fluid class="pa-1">
    <v-col class="relative">
      <!-- "診断日" を自由に動かせるように absolute positioning を設定 -->
      <div class="diagnosis" ml="10" align="center" justify="center" no-gutters>診断日</div>
      <!-- 現在時刻と年月日を横一列に表示 -->
      <div class="current-datetime">
        <span class="current-date" v-text="currentDate"></span>
        <span class="current-time" v-text="currentTime"></span>
      </div>

      <v-row class="mb-2" align="center" justify="center" no-gutters>
        <!-- 円グラフ -->
        <v-col cols="12" md="3" class="circle">
          <div class="relative h-[40vh] w-[40vw] mx-auto">
            <canvas ref="doughnutChart" style="width: 90%; height: 90%"></canvas>
          </div>
        </v-col>

        <!-- 四角形カード -->
        <v-col v-for="(item, index) in squareData" :key="index" style="margin-top: 10vh;">
          <v-card
            class="d-flex flex-column justify-center align-center text-center shadow-sm"
            :style="{
              backgroundColor: item.color,
              height: '1.5vh',
              width: '8.5vw',
              borderRadius: '0',
            }"
          >
          </v-card>
          <v-card
            class="d-flex flex-column justify-center align-center text-center shadow-sm"
            :style="{
              backgroundColor: '#d1d5db',
              height: '20vh',
              width: '8.5vw',
              font: '1vw bold',
              borderRadius: '0',
            }"
          >
            <div class="text-lg font-bold">{{ item.label }}</div>
            <div class="text-2xl font-bold">{{ item.value }}</div>
          </v-card>
        </v-col>
      </v-row>

      <!-- 深刻度ラベル -->
      <v-row class="severity-row" align="start" justify="start" no-gutters>
        <div class="severity-text">
          <span>深刻度：</span>
        </div>
        <div v-for="(label, index) in severityLabels" :key="index" class="severity-label">
          <span :style="{ color: label.color }">{{ label.text }}</span>
        </div>
      </v-row>
    </v-col>

    <!-- 棒グラフ -->
    <v-row>
      <v-col cols="12">
        <v-card outlined>
          <v-card-title class="text-h6">月別データ</v-card-title>
          <v-card-text>
            <Bar :data="chartData" />
          </v-card-text>
          <!-- Firestoreデータの数を表示 -->
          <v-card-subtitle class="text-body1">
            Firestoreのデータ数: {{ dataCount }}
          </v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
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

// Firestoreデータを受け取るプロパティ
const { result } = defineProps();

// 円グラフデータとスコア
const doughnutChart = ref(null);
const score = ref("A"); // 初期スコア
const scoreColor = ref("#700D0D"); // 初期スコアの色

onMounted(() => {
  if (doughnutChart.value) {
    const ctx = doughnutChart.value.getContext("2d");
    new ChartJS(ctx, {
      type: "doughnut",
      data: {
        datasets: [
          {
            backgroundColor: [
              "#FFFFFF",
              "#E0E29D",
              "#749A7D",
              "#4C7C84",
              "rgba(112, 13, 13, 1)",
            ],
            data: [0, 40, 30, 20, 10],
            borderColor: "rgba(157, 137, 117, 1)", // 各セグメントを区切る線の色
            borderWidth: 2, // 線の太さ（適宜調整）
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

            // 中央テキスト1: LEVEL
            ctx.save();
            ctx.font = "italic bold 30px Arial"; // 斜体 + 太字
            ctx.fillStyle = "rgba(157, 137, 117, 1)"; // LEVELの色を固定
            ctx.fillStyle = "italic"; 
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText("LEVEL", width / 2, height / 2 - 60); // 上部に配置

            // 中央テキスト2: 動的なスコア (CVSSスコアに基づく)
            ctx.font = "bold 5vw Arial";
            ctx.fillStyle = scoreColor.value; // 動的に変わる色
            ctx.fillText(score.value, width / 2, height / 2 + 0); // 少し下に配置
            // スコアの輪郭（ボーダー）
            ctx.strokeStyle = "rgba(0, 0, 0, 0.8)"; // 黒色の輪郭
            ctx.lineWidth = 1; // ボーダーの太さ
            ctx.strokeText(score.value, width / 2, height / 2);

            // 深刻度ラベルの追加
            const severityTexts = ["緊急", "重要", "警告", "注意", "なし"];
            const severityColors = [
              "#700D0D", // 緊急
              "#4C7C84", // 重要
              "#749A7D", // 警告
              "#E0E29D", // 注意
              "#FFFFFF", // なし
            ];
            
            const severityIndex = {
              A: 0, // 緊急
              B: 1, // 重要
              C: 2, // 警告
              D: 3, // 注意
              E: 4, // なし
            };

            const index = severityIndex[score.value]; // スコアに基づくインデックス


            ctx.font = "bold 20px Arial";
            ctx.fillStyle = severityColors[index];
            ctx.fillText(severityTexts[index], width / 2, height / 2 + 50); // 下に配置
            // 深刻度ラベルの輪郭（ボーダー）
            ctx.strokeStyle = "rgba(0, 0, 0, 0.8)";
            ctx.lineWidth = 1;
            ctx.strokeText(severityTexts[index], width / 2, height / 2 + 50);


            ctx.restore();
          },
        },
      ],
    });
  }
});

// CVEデータを取得してCVSSスコアに基づき評価を決定
const getCveData = async () => {
  // CVEデータの取得（仮の例）
  const cveData = await fetch("/path/to/cve/data");  // データのパスを指定
  const data = await cveData.json();

  // CVSSスコアに基づきスコアを決定
  const cvssScore = data.cvssScore; // CVEデータからスコアを取得
  if (cvssScore >= 9.0) {
    score.value = "A"; // "緊急" (9.0~10.0)
    scoreColor.value = "#700D0D"; // 赤色
  } else if (cvssScore >= 7.0) {
    score.value = "B"; // "重要" (7.0~8.9)
    scoreColor.value = "#4C7C84"; // 青色
  } else if (cvssScore >= 4.0) {
    score.value = "C"; // "警告" (4.0~6.9)
    scoreColor.value = "#749A7D"; // 緑色
  } else if (cvssScore >= 0.1) {
    score.value = "D"; // "注意" (0.1~3.9)
    scoreColor.value = "#E0E29D"; // 黄色
  } else {
    score.value = "E"; // "なし" (0)
    scoreColor.value = "#FFFFFF"; // 白色
  }
};

// CVEデータの取得と評価の更新
onMounted(() => {
  getCveData();
});

// 現在時刻と年月日を表示するための ref
const currentTime = ref("");
const currentDate = ref("");
onMounted(() => {
  setInterval(() => {
    const now = new Date();
    currentTime.value = now.toLocaleTimeString(); // 時刻を更新
    currentDate.value = now.toLocaleDateString(); // 年月日を更新
  }, 1000);
});

// 四角形カードデータ
const squareData = ref([
  { label: "緊急", value: 10, color: "#700D0D" },
  { label: "重要", value: 20, color: "#4C7C84" },
  { label: "警告", value: 30, color: "#749A7D" },
  { label: "注意", value: 40, color: "#E0E29D" },
  { label: "なし", value: 0, color: "#FFFFFF" },
]);

// 深刻度ラベルデータ
const severityLabels = ref([
  { text: "緊急 (9.0~10.0)", color: "#700D0D" },
  { text: "重要 (7.0~8.9)", color: "#4C7C84" },
  { text: "警告 (4.0~6.9)", color: "#749A7D" },
  { text: "注意 (0.1~3.9)", color: "#E0E29D" },
  { text: "なし (0)", color: "#FFFFFF" },
]);

// 棒グラフのデータ設定
const chartData = ref({
  labels: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
  datasets: [
    {
      label: "データ数",
      backgroundColor: "#42A5F5",
      data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    },
  ],
});

// Firestoreデータの数を計算する
const dataCount = computed(() => {
  return result?.value?.length || 0;  // result が存在する場合のみ length を参照
});

// Firestoreのデータを基に棒グラフのデータを更新
onMounted(() => {
  if (result?.value) {
    // `result.value` が存在する場合のみ、棒グラフデータを更新
    chartData.value.datasets[0].data = result.value.map(() => 1);  // 各月のデータ数を1として表示
  }
});
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

.pa-5 {
  background-color:#f4f5f7;
}

.mb-2 {
  display: flex;
}

.circle {
  display: flex;
  justify-content: center;
  margin-right: 4vw;
}

/* "診断日" を自由に動かせるように */
.diagnosis {
  font-weight: bold;
  color: rgba(127, 127, 127, 1);
  position: absolute; /* absolute positioning を使って自由に動かせる */
  left: 23vw; /* 中央に配置（適宜調整） */
  top: 7vh; /* 上から10vhの位置に配置（適宜調整） */
}

/* 現在時刻と年月日を横一列に配置 */
.current-datetime {
  display: flex;
  justify-content: center;
  gap: 2vw; /* 年月日と時刻の間隔を調整 */
  font-size: 1.5vw;
  font-weight: bold;
  color: rgba(112, 13, 13, 0.8);
  position: absolute;
  left: 23vw;
  top: 10.4vh; /* "診断日" の下に配置（適宜調整） */
}

.current-date,
.current-time {
  font-size: 1.5vw;
  font-weight: bold;
  color: rgba(112, 13, 13, 0.8);
  
}

/* 深刻度ラベルを横一列に配置 */
.severity-row {
  display: flex;
  justify-content: flex-start; /* 左揃え */
  align-items: center;  /* 中央揃え（縦方向） */
  gap: 1vw; /* ラベル間の間隔 */
}

.severity-label {
  font-size: 1vw;
  font-weight: bold;
  margin-bottom: 2vh;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2), 1px 1px 2px rgba(0, 0, 0, 0.3); /* 文字の周りに影を付けてボーダー風に */
}

.severity-text {
  font-size: 1vw;
  font-weight: bold;
  margin-bottom: 2vh;
}
</style>
