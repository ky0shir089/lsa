<template>
  <v-container fluid>
    <app-bar />

    <v-app-bar app color="primary" v-if="$vuetify.breakpoint.xs">
      <v-btn icon dark @click.stop="$router.go(-1)">
        <v-icon>mdi-arrow-left-circle</v-icon>
      </v-btn>
    </v-app-bar>

    <v-data-table
      :headers="headers"
      :items="masters"
      :items-per-page="20"
      hide-default-footer
      class="elevation-1"
      dense
    >
      <template v-slot:top>
        <v-toolbar flat dense color="grey lighten-2">
          <v-toolbar-title>{{ $route.name }}</v-toolbar-title>
          
          <v-text-field
            v-model="search"
            label="Search"
            outlined
            dense
            append-icon="mdi-magnify"
            single-line
            hide-details
            slot="extension"
            @keyup.enter="getMaster"
          ></v-text-field>
        </v-toolbar>
      </template>

      <template v-slot:item.po_shipping_cost="{ item }">
        {{ Number(item.po_shipping_cost).toLocaleString("id-ID") }}
      </template>

      <template v-slot:item.po_sub_total="{ item }">
        {{ Number(item.po_sub_total).toLocaleString("id-ID") }}
      </template>

      <template v-slot:item.po_total_order="{ item }">
        {{ Number(item.po_total_order).toLocaleString("id-ID") }}
      </template>

      <template v-slot:item.action="{ item }">
        <v-btn icon :to="$route.path + '/view/' + item.id">
          <v-icon>mdi-eye</v-icon>
        </v-btn>
      </template>
    </v-data-table>

    <br />

    <v-pagination
      v-model="page"
      :length="lengthPage"
      total-visible="7"
      @input="getMaster"
    ></v-pagination>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "PurchaseOrder",
  components: {
    AppBar: () =>
      import(/* webpackChunkName: "alert" */ "@/components/AppBar.vue"),
  },
  data: () => ({
    headers: [
      { text: "No PO", value: "po_number" },
      { text: "Tanggal", value: "po_date" },
      { text: "Nama Supplier", value: "supplier_name" },
      { text: "Biaya Kirim", value: "po_shipping_cost", align: "right" },
      { text: "Jumlah", value: "po_sub_total", align: "right" },
      { text: "Total", value: "po_total_order", align: "right" },
      { text: "Status", value: "po_status" },
      { text: "Action", value: "action", sortable: false },
    ],
    masters: [],
    search: "",
    page: 1,
    lengthPage: 1,
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
    async getMaster() {
      if (this.search.length > 0) {
        this.page = 1;
      }

      await this.axios
        .get("setup-po/v1/purchase-order", {
          headers: {
            Authorization: "Bearer " + this.access_token,
          },
          params: {
            search: this.search,
            inbox: true,
          },
        })
        .then((response) => {
          let { data } = response.data;
          this.masters = data.data;
          this.page = data.current_page;
          this.lengthPage = data.last_page;
        });
    },
  },
  async created() {
    await this.getMaster();
  },
};
</script>