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
      :search="search"
      :expanded.sync="expanded"
      dense
      hide-default-footer
      show-expand
      class="elevation-1"
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

      <template v-slot:item.room_id="{ item }">
        {{ item.outlet_name }} - {{ item.room_name }}
      </template>

      <template v-slot:item.po_price="{ item }">
        {{ Number(item.unit_amount).toLocaleString("id-ID") }}
      </template>

      <template v-slot:item.action="{ item }">
        <v-btn icon :to="$route.path + '/' + item.id + '/detail'">
          <v-icon>mdi-eye</v-icon>
        </v-btn>
      </template>

      <template v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length">
          <v-simple-table dense class="component">
            <template v-slot:default>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tanggal</th>
                  <th>Brand</th>
                  <th>Type</th>
                  <th>Harga</th>
                </tr>
              </thead>

              <tr v-for="component in item.components" :key="component.id">
                <td>{{ component.id }}</td>
                <td>{{ component.component_date }}</td>
                <td>{{ component.brand_component_name }}</td>
                <td>{{ component.component_type }}</td>
                <td>{{ component.component_price }}</td>
              </tr>
            </template>
          </v-simple-table>
        </td>
      </template>
    </v-data-table>

    <br />

    <v-pagination
      v-model="page"
      :length="lengthPage"
      :total-visible="7"
      @input="getMaster"
    ></v-pagination>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "ListUnit",
  components: {
    AppBar: () =>
      import(/* webpackChunkName: "alert" */ "@/components/AppBar.vue"),
  },
  data: () => ({
    headers: [
      { text: "Kode Unit", value: "unit_no" },
      { text: "Tgl Beli", value: "unit_date" },
      { text: "Unit", value: "unit_name" },
      { text: "Brand", value: "brand_unit_name" },
      { text: "Type", value: "po_type" },
      { text: "Serial Number", value: "unit_serial_number" },
      { text: "Lokasi", value: "room_id" },
      { text: "Harga Beli", value: "po_price", align: "right" },
      { text: "Status", value: "unit_status" },
      { text: "Action", value: "action", sortable: false },
      { text: "", value: "data-table-expand" },
    ],
    masters: [],
    expanded: [],
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
        .get("list-asset/v1/list-unit?page=" + this.page, {
          headers: {
            Authorization: "Bearer " + this.access_token,
          },
          params: {
            search: this.search,
          },
        })
        .then((response) => {
          let { data } = response.data;
          this.masters = data.data;
          this.page = data.current_page;
          this.lengthPage = data.last_page;
        })
        .catch((error) => {
          let responses = error.response.data;
          this.setAlert({
            status: true,
            color: "error",
            text: responses.message,
          });
        });
    },
  },
  async created() {
    await this.getMaster();
  },
};
</script>

<style>
.component tr:nth-child(even) {
  background-color: #dddddd;
}
</style>