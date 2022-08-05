<template>
  <v-container fluid v-if="computed">
    <app-bar />

    <v-app-bar app color="primary" v-if="$vuetify.breakpoint.xs">
      <v-btn icon dark @click.stop="$router.go(-1)">
        <v-icon>mdi-arrow-left-circle</v-icon>
      </v-btn>
    </v-app-bar>

    <v-row>
      <v-col cols="12" sm="4">
        <v-simple-table dense>
          <template v-slot:default>
            <tbody>
              <tr>
                <td><b>Kode Unit</b></td>
                <td>{{ unit.unit_no }}</td>
              </tr>

              <tr>
                <td><b>Tgl Beli</b></td>
                <td>{{ unit.unit_date }}</td>
              </tr>

              <tr>
                <td><b>Status</b></td>
                <td>{{ unit.unit_status }}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-col>

      <v-col cols="12" sm="4">
        <v-simple-table dense>
          <template v-slot:default>
            <tbody>
              <tr>
                <td><b>Unit</b></td>
                <td>{{ unit.unit_name }}</td>
              </tr>

              <tr>
                <td><b>Brand</b></td>
                <td>{{ unit.brand_unit_name }}</td>
              </tr>

              <tr>
                <td><b>Type</b></td>
                <td>{{ unit.po_type }}</td>
              </tr>

              <tr>
                <td><b>Serial Number</b></td>
                <td>{{ unit.unit_serial_number }}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-col>

      <v-col cols="12" sm="4">
        <v-simple-table dense>
          <template v-slot:default>
            <tbody>
              <tr>
                <td><b>Outlet</b></td>
                <td>{{ unit.outlet_name }}</td>
              </tr>

              <tr>
                <td><b>Ruangan</b></td>
                <td>{{ unit.room_name }}</td>
              </tr>

              <tr>
                <td><b>Harga Beli</b></td>
                <td>
                  {{ unit.po_price.toLocaleString("id-ID") }}
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-col>
    </v-row>

    <form-component :unit="unit" />
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "DetailUnit",
  props: {
    id: {
      required: true,
      type: String,
    },
  },
  components: {
    AppBar: () =>
      import(/* webpackChunkName: "alert" */ "@/components/AppBar.vue"),
    FormComponent: () =>
      import(
        /* webpackChunkName: "form-component" */ "@/components/FormComponent.vue"
      ),
  },
  data: () => ({
    unit: [],
    computed: false,
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
        .get("list-asset/v1/list-unit/" + this.id, {
          headers: {
            Authorization: "Bearer " + this.access_token,
          },
        })
        .then((response) => {
          let { data } = response.data;
          this.unit = data;
          this.computed = true;
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
</style>