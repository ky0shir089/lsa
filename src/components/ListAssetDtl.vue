<template>
  <v-data-table
    :headers="headers2"
    :items="item.assets"
    :items-per-page="-1"
    hide-default-footer
    dense
    show-expand
    class="elevation-1"
  >
    <template v-slot:item.action="{ item }">
      <v-btn
        icon
        small
        :to="
          '/setup-asset/asset-dtl/new/' +
          item.asset_hdr_id +
          '/' +
          item.asset_code
        "
      >
        <v-icon small>mdi-plus-thick</v-icon>
      </v-btn>

      <v-btn
        icon
        small
        :to="'/setup-asset/asset-dtl/' + item.asset_hdr_id + '/edit/' + item.id"
      >
        <v-icon small>mdi-pencil</v-icon>
      </v-btn>

      <v-btn icon small>
        <v-icon small @click="destroy(item)">mdi-delete</v-icon>
      </v-btn>
    </template>

    <template v-slot:expanded-item="{ headers, item }">
      <td :colspan="headers.length">
        <list-sub-asset :item="item" :parent="item.id" />
      </td>
    </template>
  </v-data-table>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "AssetDtl",
  props: ["item"],
  components: {
    ListSubAsset: () =>
      import(
        /* webpackChunkName: "list-sub-asset" */ "@/components/ListSubAsset.vue"
      ),
  },
  data: () => ({
    headers2: [
      { text: "Kode Asset", value: "asset_code" },
      { text: "Nama Asset", value: "asset_dtl_name" },
      { text: "Action", value: "action", sortable: false },
      { text: "", value: "data-table-expand" },
    ],
    expanded2: [],
  }),
  computed: {
    ...mapGetters({
      access_token: "token/token",
    }),
  },
  methods: {
    ...mapActions({
      setAlert: "alert/set",
    }),
    async destroy(item) {
      let r = confirm("Yakin akan dihapus?");

      if (r) {
        await this.axios
          .delete("setup-asset/v1/destroy-asset-dtl", {
            headers: {
              Authorization: "Bearer " + this.access_token,
            },
            data: {
              id: item.id,
            },
          })
          .then((response) => {
            let { data } = response;
            this.setAlert({
              status: true,
              color: "success",
              text: data.message,
            });
          })
          .catch((error) => {
            let responses = error.response.data;
            this.setAlert({
              status: true,
              color: "error",
              text: responses.message,
            });
          });
      }
    },
  },
};
</script>

<style>
</style>