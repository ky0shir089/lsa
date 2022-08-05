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
      :footer-props="{
        itemsPerPageOptions: [20, -1],
      }"
      dense
      class="elevation-1"
      group-by="unit_name"
    >
      <template v-slot:top>
        <v-toolbar flat dense color="grey lighten-2">
          <v-toolbar-title>{{ $route.name }}</v-toolbar-title>

          <v-spacer></v-spacer>

          <v-btn color="primary" dark :to="$route.path + '/new'">
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
          ></v-text-field>
        </v-toolbar>
      </template>

      <template v-slot:item.action="{ item }">
        <v-btn icon small :to="$route.path + '/' + item.id + '/edit'">
          <v-icon small>mdi-pencil</v-icon>
        </v-btn>

        <v-btn icon small>
          <v-icon small @click="destroy(item)">mdi-delete</v-icon>
        </v-btn>
      </template>
    </v-data-table>
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
      { text: "ID", value: "component_code" },
      { text: "Komponen", value: "component_name" },
      { text: "Action", value: "action", sortable: false },
    ],
    masters: [],
    search: "",
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
        .get("setup-asset/v1/component", {
          headers: {
            Authorization: "Bearer " + this.access_token,
          },
        })
        .then((response) => {
          let { data } = response.data;
          this.masters = data;
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
    async destroy(item) {
      let r = confirm("Yakin akan dihapus?");

      if (r) {
        await this.axios
          .delete("setup-asset/v1/destroy-component/" + item.id, {
            headers: {
              Authorization: "Bearer " + this.access_token,
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
  async created() {
    await this.getMaster();
  },
};
</script>