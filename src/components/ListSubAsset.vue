<template>
  <v-data-table
    :headers="headers3"
    :items="item.sub_assets"
    :items-per-page="-1"
    hide-default-footer
    dense
    class="elevation-1"
  >
    <template v-slot:item.action="{ item }">
      <v-btn
        icon
        small
        :to="'/setup-asset/asset-dtl/' + parent + '/edit/' + item.id"
      >
        <v-icon small>mdi-pencil</v-icon>
      </v-btn>

      <v-btn icon small>
        <v-icon small @click="destroy(item)">mdi-delete</v-icon>
      </v-btn>
    </template>
  </v-data-table>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "SubAsset",
  props: ["item", "parent"],
  data: () => ({
    headers3: [
      { text: "Kode Asset", value: "asset_sub_code" },
      { text: "Nama Asset", value: "asset_dtl_name" },
      { text: "Action", value: "action", sortable: false },
    ],
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
            this.$root.$emit("reload");
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