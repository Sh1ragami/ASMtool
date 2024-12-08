<template>
  <v-data-table-server
    v-model:items-per-page="itemsPerPage"
    :headers="headers"
    :items="serverItems"
    :items-length="totalItems"
    :loading="loading"
    :search="search"
    item-value="name"
    @update:options="loadItems"
  >
    <template v-slot:[`column.危険度`]="{ column }">
      <span style="font-weight: bold;">{{ column.value }}</span>
    </template>
  </v-data-table-server>
</template>

<script>
import { ref } from 'vue';
import { targets } from "~/data/target_info"; // データのインポート

const desserts = targets; // サンプルデータ

const FakeAPI = {
  async fetch({ page, itemsPerPage, sortBy }) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const items = desserts.slice();

        if (sortBy.length) {
          const sortKey = sortBy[0].key;
          const sortOrder = sortBy[0].order;
          items.sort((a, b) => {
            const aValue = a[sortKey];
            const bValue = b[sortKey];
            return sortOrder === "desc" ? bValue - aValue : aValue - bValue;
          });
        }

        const paginated = items.slice(start, end);

        resolve({ items: paginated, total: items.length });
      }, 500);
    });
  },
};

export default {
  data() {
    return {
      itemsPerPage: 10,
      search: "",
      serverItems: [],
      loading: true,
      totalItems: 0,
      headers: [
        { title: "危険度", key: "危険度", align: "end", style: "background-color: red;" },
        { title: "IPアドレス", key: "IPアドレス", align: "end" },
        { title: "サービス", key: "サービス", align: "end" },
        { title: "生存", key: "生存", align: "end" },
        { title: "発見日", key: "発見日", align: "end" },
      ],
    };
  },
  methods: {
    loadItems({ page, itemsPerPage, sortBy }) {
      this.loading = true;
      FakeAPI.fetch({ page, itemsPerPage, sortBy }).then(({ items, total }) => {
        this.serverItems = items;
        this.totalItems = total;
        this.loading = false;
      });
    },
  },
};
</script>
