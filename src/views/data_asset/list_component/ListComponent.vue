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
      dense
      hide-default-footer
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat dense color="grey lighten-2">
          <v-toolbar-title>{{ $route.name }}</v-toolbar-title>

          <v-spacer></v-spacer>

          <v-btn color="primary" dark :to="$route.path + '/buy'">
            <v-icon left>mdi-plus</v-icon>New
          </v-btn>

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

      <template v-slot:item.id="{ item }"> K{{ item.id }} </template>

      <template v-slot:item.room_id="{ item }">
        {{ item.outlet_name }} - {{ item.room_name }}
      </template>

      <template v-slot:item.component_price="{ item }">
        {{ Number(item.component_price).toLocaleString("id-ID") }}
      </template>

      <template v-slot:item.action="{ item }">
        <v-btn
          icon
          small
          :to="'/data-asset/list-unit/' + item.unit_id + '/detail'"
          v-if="item.unit_id != ''"
        >
          <v-icon small>mdi-eye</v-icon>
        </v-btn>
      </template>

      <template v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length">More info about {{ item.unit_name }}</td>
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
  name: "ListComponent",
  components: {
    AppBar: () =>
      import(/* webpackChunkName: "alert" */ "@/components/AppBar.vue"),
  },
  data: () => ({
    headers: [
      { text: "Kode Komponent", value: "id" },
      { text: "Tgl Beli", value: "component_date" },
      { text: "Komponen", value: "component_name" },
      { text: "Brand", value: "brand_component_name" },
      { text: "Type", value: "component_type" },
      { text: "Harga", value: "component_price", align: "right" },
      { text: "Lokasi", value: "unit_no" },
      { text: "Ruangan", value: "room_id" },
      { text: "Status", value: "component_status" },
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
        .get("list-asset/v1/list-component?page=" + this.page, {
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