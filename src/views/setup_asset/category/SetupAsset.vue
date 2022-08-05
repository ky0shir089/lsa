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
      class="elevation-1"
      dense
      show-expand
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
        <v-btn icon small :to="$route.path + '/edit/' + item.id">
          <v-icon small>mdi-pencil</v-icon>
        </v-btn>

        <!-- <v-btn icon small>
          <v-icon small @click="destroy(item)">mdi-delete</v-icon>
        </v-btn>-->
      </template>

      <template v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length">
          <v-data-table
            :headers="headers2"
            :items="item.asset"
            hide-default-footer
            class="elevation-1"
            dense
            show-expand
          >
            <template v-slot:item.action="{ item }">
              <v-btn icon small :to="'/asset/asset-detail/edit/' + item.id">
                <v-icon small>mdi-pencil</v-icon>
              </v-btn>
            </template>

            <template v-slot:expanded-item="{ headers, item }">
              <td :colspan="headers.length">
                <v-simple-table dense>
                  <template v-slot:default>
                    <thead>
                      <tr>
                        <th>Spesifikasi</th>
                        <th>Type</th>
                        <th>Value</th>
                      </tr>
                    </thead>

                    <tbody>
                      <tr v-for="subItem in item.spec" :key="subItem.id">
                        <td>{{ subItem.spec_dtl_name }}</td>
                        <td>{{ subItem.spec_dtl_type }}</td>
                        <td>
                          <ul>
                            <li v-for="val in JSON.parse(subItem.spec_dtl_val)" :key="val">{{ val }}</li>
                          </ul>
                        </td>
                        <!-- <td>
                          <v-btn icon small :to="'/asset/specification-detail/edit/' + subItem.id">
                            <v-icon small>mdi-pencil</v-icon>
                          </v-btn>
                        </td>-->
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </td>
            </template>
          </v-data-table>
        </td>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "AssetCategory",
  components: {
    AppBar: () =>
      import(/* webpackChunkName: "alert" */ "@/components/AppBar.vue"),
  },
  data: () => ({
    headers: [
      { text: "ID", value: "asset_id" },
      { text: "Kategori", value: "asset_name" },
      { text: "Action", value: "action", sortable: false },
      { text: '', value: 'data-table-expand' },
    ],
    masters: [],
    search: "",
    headers2: [
      { text: "Kode Asset", value: "asset_code" },
      { text: "Sub Kode", value: "asset_sub_code" },
      { text: "Nama Asset", value: "asset_dtl_name" },
      { text: "Action", value: "action", sortable: false },
      { text: '', value: 'data-table-expand' },
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
    async getMaster() {
      await this.axios
        .get("asset/v1/asset-category", {
          headers: {
            Authorization: "Bearer " + this.access_token,
          },
        })
        .then((response) => {
          let { data } = response.data;
          this.masters = data;
        })
    },
    async destroy(item) {
      let r = confirm("Yakin akan dihapus?");

      if (r) {
        await this.axios
          .delete("asset/v1/destroy-asset-category", {
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