<template>
  <v-container fluid>
    <app-bar />

    <v-app-bar app color="primary" v-if="$vuetify.breakpoint.xs">
      <v-btn icon dark @click.stop="$router.go(-1)">
        <v-icon>mdi-arrow-left-circle</v-icon>
      </v-btn>
    </v-app-bar>

    <v-data-table :headers="headers" :items="masters" :items-per-page="20" :footer-props="{
      itemsPerPageOptions: [20, -1],
    }" class="elevation-1" dense>
      <template v-slot:top>
        <v-toolbar flat dense color="grey lighten-2">
          <v-toolbar-title>{{ $route.name }}</v-toolbar-title>

          <v-spacer></v-spacer>

          <v-btn color="primary" dark :to="$route.path + '/new'">
            <v-icon left>mdi-plus</v-icon>New
          </v-btn>

          <v-text-field v-model="search" label="Search" outlined dense append-icon="mdi-magnify" single-line
            hide-details slot="extension" @keyup.enter="getMaster"></v-text-field>
        </v-toolbar>
      </template>

      <template v-slot:item.action="{ item }">
        <v-btn icon small :to="$route.path + '/edit/' + item.id">
          <v-icon small>mdi-pencil</v-icon>
        </v-btn>

        <v-btn icon small>
          <v-icon small @click="destroy(item)">mdi-delete</v-icon>
        </v-btn>
      </template>
    </v-data-table>

    <br />

    <v-pagination v-model="page" :length="lengthPage" total-visible="7"></v-pagination>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "Customer",
  components: {
    AppBar: () =>
      import(/* webpackChunkName: "alert" */ "@/components/AppBar.vue"),
  },
  data: () => ({
    headers: [
      { text: "Tipe", value: "cust_type" },
      { text: "KTP", value: "cust_ktp" },
      { text: "Nama", value: "cust_name" },
      { text: "Alamat", value: "cust_address" },
      { text: "Provinsi", value: "provinsi" },
      { text: "Kabupaten", value: "kabupaten" },
      { text: "Kecamatan", value: "kecamatan" },
      { text: "Kelurahan", value: "kelurahan" },
      { text: "Kodepos", value: "kodepos" },
      { text: "Telepon", value: "cust_hp" },
      { text: "Telepon 2", value: "cust_hp2" },
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
      await this.axios
        .get("asset/v1/customer", {
          headers: {
            Authorization: "Bearer " + this.access_token,
          },
          params: {
            search: this.search
          }
        })
        .then((response) => {
          let { data } = response.data;
          this.masters = data.data;
          this.page = data.current_page
          this.lengthPage = data.last_page
        })
    },
    async destroy(item) {
      let r = confirm("Yakin akan dihapus?");

      if (r) {
        await this.axios
          .delete("asset/v1/destroy-customer", {
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
            this.getMaster();
          })
      }
    },
  },
  async created() {
    await this.getMaster();
  },
};
</script>