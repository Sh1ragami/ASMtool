<template>
  <!-- ドキュメントヘッダー -->
  <v-card class="mb-6 header-card" outlined>
    <v-card-title class="text-h5 text-center">
      <v-icon class="mr-2">mdi-file-document-outline</v-icon>
      スキャンツール使用ガイド
    </v-card-title>
  </v-card>

  <!-- 前提準備 -->
  <v-card class="mb-6 section-card" outlined>
    <v-card-title class="section-title">
      <v-icon class="mr-2">mdi-information-outline</v-icon>
      前提準備
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <p>
        このツールを使用するには、BBOTをインストールする必要があります。
        詳しいインストール方法は、以下の公式ページをご確認ください。
        <br />
        <a href="https://github.com/blacklanternsecurity/bbot" class="link">
          BBOT GitHubページ
        </a>
      </p>
      <p>ツールを使用する前に以下の情報を用意してください:</p>
      <v-list dense class="info-list">
        <v-list-item>
          <v-list-item-icon>
            <v-icon>mdi-domain</v-icon>
          </v-list-item-icon>
          <v-list-item-title>調査対象のドメイン名</v-list-item-title>
        </v-list-item>
        <v-list-item>
          <v-list-item-icon>
            <v-icon>mdi-ip</v-icon>
          </v-list-item-icon>
          <v-list-item-title>IPアドレス</v-list-item-title>
        </v-list-item>
        <v-list-item>
          <v-list-item-icon>
            <v-icon>mdi-server</v-icon>
          </v-list-item-icon>
          <v-list-item-title>ホスト名</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-card-text>
  </v-card>

  <!-- スキャン設定 -->
  <v-card class="mb-6 section-card" outlined>
    <v-card-title class="section-title">
      <v-icon class="mr-2">mdi-cog-outline</v-icon>
      スキャン設定
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text>用意した情報をスキャン設定に入力してください。</v-card-text>
  </v-card>

  <!-- スキャンの実行 -->
  <v-card class="mb-6 section-card" outlined>
    <v-card-title class="section-title">
      <v-icon class="mr-2">mdi-play-circle-outline</v-icon>
      スキャンの実行
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <p>スキャンを実行すると、結果が表形式で表示されます。取得できる情報:</p>
      <v-table>
        <thead>
          <tr>
            <th class="text-left">項目</th>
            <th class="text-left">説明</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in items" :key="item.項目">
            <td>{{ item.項目 }}</td>
            <td>{{ item.説明 }}</td>
          </tr>
        </tbody>
      </v-table>
    </v-card-text>
  </v-card>

  <!-- スキャンログの確認 -->
  <v-card class="section-card" outlined>
    <v-card-title class="section-title">
      <v-icon class="mr-2">mdi-history</v-icon>
      スキャンログの確認
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <p>過去のスキャンログの詳細は以下の内容を含みます:</p>
      <v-list dense class="info-list">
        <v-list-item>
          <v-list-item-icon>
            <v-icon>mdi-calendar-clock</v-icon>
          </v-list-item-icon>
          <v-list-item-title>スキャン実行日時</v-list-item-title>
        </v-list-item>
        <v-list-item>
          <v-list-item-icon>
            <v-icon>mdi-database-search</v-icon>
          </v-list-item-icon>
          <v-list-item-title>スキャン対象の情報</v-list-item-title>
        </v-list-item>
        <v-list-item>
          <v-list-item-icon>
            <v-icon>mdi-alert-circle-outline</v-icon>
          </v-list-item-icon>
          <v-list-item-title>検出された脆弱性のリスト</v-list-item-title>
        </v-list-item>
        <v-list-item>
          <v-list-item-icon>
            <v-icon>mdi-check-circle-outline</v-icon>
          </v-list-item-icon>
          <v-list-item-title>スキャンのステータス</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-card-text>
  </v-card>
</template>

<script setup>
const items = [
  { 項目: 'IPアドレス', 説明: '調査対象のIPアドレス' },
  { 項目: 'ポート番号', 説明: '開いているポート番号一覧' },
  { 項目: 'サービス', 説明: '各ポートで稼働しているサービス' },
  { 項目: 'バナー情報', 説明: 'サービスのバージョン情報など' },
  { 項目: 'クラウド情報', 説明: 'クラウドサービスプロバイダー情報' },
  { 項目: '脆弱性', 説明: '検出されたCVE一覧と説明' },
];
</script>

<style scoped>
.header-card {
  background-color: #1976d2;
  color: white;
}

.section-title {
  font-weight: bold;
  color: #1976d2;
}

.info-list v-list-item {
  margin-bottom: 8px;
}

.link {
  color: red;
  text-decoration: none;
}

.link:hover {
  text-decoration: underline;
}
</style>
