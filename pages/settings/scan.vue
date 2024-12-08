<template>
    <!-- タブ切り替え -->
    <v-tabs v-model="tab">
      <v-tab>フォーム形式で編集</v-tab>
      <v-tab>YAML直接編集</v-tab>
    </v-tabs>

    <!-- フォーム形式 -->
    <v-tab-item v-if="tab === 0">
      <v-form>
        <h3>調査対象</h3>
        <v-text-field
          v-for="(item, index) in yamlData.target || []"
          :key="index"
          v-model="yamlData.target[index]"
          label="調査対象"
        />

        <h3>モジュール</h3>
        <div v-if="yamlData.config && yamlData.config.modules">
          <div v-for="(module, key) in yamlData.config.modules" :key="key">
            <v-text-field v-model="module.api_key" :label="`${key} APIキー`" />
          </div>
        </div>
        <v-btn color="primary" class="mt-4" @click="saveYaml">保存</v-btn>
      </v-form>
    </v-tab-item>

    <!-- YAML直接編集 -->
    <v-tab-item v-if="tab === 1">
      <v-textarea v-model="yamlRaw" label="YAML設定" rows="20" />
      <v-btn color="primary" class="mt-4" @click="saveYamlDirect">保存</v-btn>
    </v-tab-item>
</template>

<script>
import yaml from "js-yaml"; // js-yamlライブラリを利用

export default {
  data() {
    return {
      tab: 0, // タブの切り替え
      yamlData: {}, // パース済みのYAMLデータ
      yamlRaw: "", // YAML全体のテキスト
    };
  },
  mounted() {
    // 初期のYAMLデータを設定
    const initialYaml = `
description: 攻撃面の発見方法や対象についての設定ファイル

# 調査対象のドメイン名、IPアドレスなど
target:
  - asojuku.ac.jp

include:
  - subdomain-enum

flags:
  - safe
  - passive

modules:

config:

  modules:
  
    # APIキー設定
# ---------------------------------------------------------------------------------------

    bevigil:
      # BevigilのAPIキー
      api_key: 

    binaryedge:
      # BinaryEdgeのAPIキー
      api_key: 

    bufferoverrun:
      # BufferoverrunのAPIキー
      api_key: 

    builtwith:
      # BuiltWithのAPIキー
      api_key: 

    c99:
      # c99のAPIキー
      c99: 

    censys:
      # CensysのAPIキー
      api_key: 

    chaos:
      # ChaosのAPIキー
      api_key: 

    credshed:
      # CredshedのAPIキー
      api_key: 

    dehashed:
      # DehashedのAPIキー
      api_key: 

    fullhunt:
      # FullHuntのAPIキー
      api_key: 

    github_codesearch:
      # GitHub Code SearchのAPIキー
      api_key: 

    hunterio:
      # Hunter.ioのAPIキー
      api_key: 

    ip2location:
      # IP2LocationのAPIキー
      api_key: 

    ipstack:
      # IPStackのAPIキー
      api_key: 

    passivetotal:
      # PassiveTotalのAPIキー
      api_key: 

    securitytrails:
      # securitytrailsのAPIキー
      api_key: 

    shodan_dns:
      # Shodan DNSのAPIキー
      api_key: 

    subdomainradar:
      # SubdomainRadarのAPIキー
      api_key: 

    trickest:
      # TrickestのAPIキー
      api_key: 

    virustotal:
      # virustotalのAPIキー
      api_key: 

    zoomeye:
      # ZoomeyeのAPIキー
      api_key: 

`;
    try {
      this.yamlData = yaml.load(initialYaml) || {}; // YAMLデータをオブジェクトに変換
      this.yamlRaw = initialYaml; // 元のYAML文字列を保持
    } catch (e) {
      console.error("YAMLのロードに失敗しました: ", e.message);
    }
  },
  methods: {
    saveYaml() {
      try {
        this.yamlRaw = yaml.dump(this.yamlData); // YAMLデータを文字列に変換
        alert("保存しました");
      } catch (e) {
        alert("保存に失敗しました: " + e.message);
      }
    },
    saveYamlDirect() {
      try {
        this.yamlData = yaml.load(this.yamlRaw) || {}; // 文字列をYAMLデータに変換
        alert("保存しました");
      } catch (e) {
        alert("保存に失敗しました: " + e.message);
      }
    },
  },
};
</script>

<style scoped>
.v-container {
  padding: 20px;
}
</style>
