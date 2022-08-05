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
                <td><b>No PO</b></td>
                <td>{{ unit.po_number }}</td>
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
                <td v-if="unit.unit_serial_number">
                  {{ unit.unit_serial_number }}
                </td>
                <td v-else>
                  <v-text-field
                    v-model="unit_serial_number"
                    outlined
                    dense
                    append-outer-icon="mdi-content-save"
                    hide-details
                    @click:append-outer="update"
                  ></v-text-field>
                </td>
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
                  {{ unit.unit_price.toLocaleString("id-ID") }}
                </td>
              </tr>

              <tr>
                <td><b>Ongkos Kirim</b></td>
                <td>
                  {{ unit.unit_ongkir.toLocaleString("id-ID") }}
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-col>
    </v-row>

    <default-component :id="id" ref="default" v-if="unit.components.length > 0" />

    <form-component :unit="unit" />

    <form-other-info :unit="unit" />

    <form-photo :unit="unit" />

    <form-maintenance :unit="unit" ref="maintenance" />
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
    FormOtherInfo: () =>
      import(
        /* webpackChunkName: "form-other-info" */ "@/components/FormOtherInfo.vue"
      ),
    FormMaintenance: () =>
      import(
        /* webpackChunkName: "form-maintenance" */ "@/components/FormMaintenance.vue"
      ),
    FormPhoto: () =>
      import(/* webpackChunkName: "form-photo" */ "@/components/FormPhoto.vue"),
    DefaultComponent: () =>
      import(
        /* webpackChunkName: "default-componenet" */ "@/components/DefaultComponent.vue"
      ),
  },
  data: () => ({
    unit: [],
    defaults: [],
    unit_serial_number: "",
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
    async update() {
      let r = window.confirm("apakah anda yakin?");

      if (r) {
        let formData = new FormData();
        formData.set("unit_serial_number", this.unit_serial_number);

        await this.axios
          .post("list-asset/v1/update-list-unit/" + this.id, formData, {
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
            this.loading = false;
          });
      }
    },
  },
  async created() {
    await this.getMaster();
  },
};
</script>

<style>
</style>