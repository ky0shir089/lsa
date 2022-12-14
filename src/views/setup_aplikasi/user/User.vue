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
      :search="search"
      :options.sync="options"
      :server-items-length="total"
      :loading="loading"
      class="elevation-1"
      dense
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
            @keyup.enter="getMaster"
          ></v-text-field>
        </v-toolbar>
      </template>

      <template v-slot:item.user_roles="{ item }">
        <ul>
          <li v-for="role in item.user_roles" :key="role.id">
            {{ role.role_name }}
          </li>
        </ul>
      </template>

      <template v-slot:item.action="{ item }">
        <v-btn icon small :to="$route.path + '/edit/' + item.id">
          <v-icon small>mdi-pencil</v-icon>
        </v-btn>

        <!-- <v-btn icon small>
          <v-icon small @click="destroy(item)">mdi-delete</v-icon>
        </v-btn> -->
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "SetupUser",
  components: {
    AppBar: () =>
      import(/* webpackChunkName: "alert" */ "@/components/AppBar.vue"),
  },
  data: () => ({
    headers: [
      { text: "ID", value: "id" },
      { text: "NPK", value: "npk" },
      { text: "Nama", value: "name" },
      { text: "Role", value: "user_roles", sortable: false },
      { text: "IP Address", value: "ipaddress", sortable: false },
      { text: "User Agent", value: "useragent", sortable: false },
      { text: "Status", value: "status" },
      { text: "Action", value: "action", sortable: false },
    ],
    masters: [],
    loading: false,
    total: 0,
    options: {},
    search: "",
  }),
  computed: {
    ...mapGetters({
      access_token: "token/token",
    }),
  },
  watch: {
    options: {
      handler() {
        this.getMaster();
      },
      deep: true,
    },
  },
  methods: {
    ...mapActions({
      setAlert: "alert/set",
    }),
    async getMaster() {
      this.loading = true;

      await this.axios
        .get("user/v1/user?page=" + this.options.page, {
          headers: {
            Authorization: "Bearer " + this.access_token,
          },
          params: {
            per_page: this.options.itemsPerPage,
            sort_by: this.options.sortBy[0],
            sort_desc: this.options.sortDesc[0] ? "desc" : "asc",
            search: this.search,
          },
        })
        .then((response) => {
          let { data } = response.data;
          this.masters = data.data;
          this.total = data.total;
          this.loading = false;
        });
    },
    async destroy(item) {
      let r = confirm("Yakin akan dihapus?");

      if (r) {
        await this.axios
          .delete("user/v1/destroy-user", {
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