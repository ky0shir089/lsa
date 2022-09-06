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

        <!-- <v-menu transition="slide-y-transition" bottom offset-y>
          <template v-slot:activator="{ on, attrs, value }">
            <v-btn small outlined v-bind="attrs" v-on="on">
              Menu
              <v-icon right v-if="value">mdi-chevron-up</v-icon>
              <v-icon right v-else>mdi-chevron-down</v-icon>
            </v-btn>
          </template>

          <v-list dense>
            <v-list-item-group color="red">
              <v-list-item :to="$route.path + '/view/' + item.id">
                <v-list-item-content>
                  <v-list-item-title>View</v-list-item-title>
                </v-list-item-content>

                <v-list-item-icon>
                  <v-icon small>mdi-eye</v-icon>
                </v-list-item-icon>
              </v-list-item>

              <v-list-item
                :to="$route.path + '/receive/' + item.id"
                v-if="item.po_status == 'ON PROCESS'"
              >
                <v-list-item-content>
                  <v-list-item-title>Receive Item</v-list-item-title>
                </v-list-item-content>

                <v-list-item-icon>
                  <v-icon small>mdi-hammer-wrench</v-icon>
                </v-list-item-icon>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-menu> -->
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