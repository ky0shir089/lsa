<template>
  <v-container fluid>
    <app-bar />

    <v-app-bar app color="primary" v-if="$vuetify.breakpoint.xs">
      <v-btn icon dark @click.stop="$router.go(-1)">
        <v-icon>mdi-arrow-left-circle</v-icon>
      </v-btn>
    </v-app-bar>

    <div class="text-h5 mb-4">
      {{ $route.name }}
      <v-btn icon @click="po = {}" v-if="Object.keys(po).length > 0">
        <v-icon>mdi-arrow-left-circle</v-icon>
      </v-btn>
    </div>

    <v-row v-if="Object.keys(po).length === 0">
      <v-col cols="12" sm="6">
        <v-text-field
          v-model="id"
          label="PO Number"
          placeholder="Masukan No PO disini"
          outlined
          dense
          append-outer-icon="mdi-eye"
          @click:append-outer="getPo"
        ></v-text-field>
      </v-col>
    </v-row>

    <div v-else>
      <v-row dense>
        <v-col cols="12" sm="6">
          <v-simple-table dense>
            <template v-slot:default>
              <tbody>
                <tr>
                  <td><b>Supplier</b></td>
                  <td>{{ po.supplier_id }} | {{ po.supplier_name }}</td>
                </tr>

                <tr v-if="$vuetify.breakpoint.smAndUp">
                  <td><b>Alamat Vendor</b></td>
                  <td><b>Alamat Kirim</b></td>
                </tr>

                <tr v-if="$vuetify.breakpoint.smAndUp">
                  <td>{{ po.supplier_address }}</td>
                  <td>{{ po.po_ship_to }}</td>
                </tr>

                <tr v-if="$vuetify.breakpoint.xs">
                  <td><b>Alamat Vendor</b></td>
                  <td>{{ po.supplier_address }}</td>
                </tr>

                <tr v-if="$vuetify.breakpoint.xs">
                  <td><b>Alamat Kirim</b></td>
                  <td>{{ po.po_ship_to }}</td>
                </tr>

                <tr v-if="po.po_term == 'TRANSFER'">
                  <td><b>No Rekening</b></td>
                  <td>{{ po.account_no }} - {{ po.account_name }}</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-col>

        <v-col cols="12" sm="6">
          <v-form v-model="valid" ref="form">
            <v-simple-table dense>
              <template v-slot:default>
                <tbody>
                  <tr>
                    <td><b>PO Number</b></td>
                    <td>{{ po.po_number }}</td>
                  </tr>

                  <tr>
                    <td><b>Receive Date</b></td>
                    <td>
                      <v-menu
                        v-model="menu"
                        :close-on-content-click="false"
                        :nudge-right="40"
                        transition="scale-transition"
                        offset-y
                        min-width="auto"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            v-model="form.po_receive_date"
                            outlined
                            dense
                            hide-details
                            append-icon="mdi-calendar"
                            readonly
                            v-bind="attrs"
                            v-on="on"
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          v-model="form.po_receive_date"
                          @input="menu = false"
                        ></v-date-picker>
                      </v-menu>
                    </td>
                  </tr>

                  <tr>
                    <td><b>Kurir</b></td>
                    <td>
                      <v-autocomplete
                        v-model="form.courier_id"
                        :items="couriers"
                        item-text="courier_name"
                        item-value="id"
                        outlined
                        dense
                        hide-selected
                        hide-details
                      ></v-autocomplete>
                    </td>
                  </tr>

                  <tr>
                    <td><b>Lokasi</b></td>
                    <td>
                      <v-autocomplete
                        v-model="form.room_id"
                        :items="rooms"
                        item-text="room_name"
                        item-value="id"
                        outlined
                        dense
                        hide-selected
                        hide-details
                        :rules="formRules"
                      >
                        <template v-slot:selection="data">
                          {{ data.item.outlet_name }} -
                          {{ data.item.room_name }}
                        </template>

                        <template v-slot:item="data">
                          {{ data.item.outlet_name }} -
                          {{ data.item.room_name }}
                        </template>
                      </v-autocomplete>
                    </td>
                  </tr>

                  <tr>
                    <td><b>Status</b></td>
                    <td>{{ po.po_status }}</td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-form>
        </v-col>
      </v-row>

      <br />

      <v-row>
        <v-col cols="12">
          <v-simple-table dense>
            <template v-slot:default>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Brand</th>
                  <th>Type</th>
                  <th>Spesifikasi</th>
                  <th>Qty</th>
                  <th class="text-right">Harga</th>
                  <th class="text-right">Amount</th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="item in po.items" :key="item.id">
                  <td>{{ item.unit_name }}</td>
                  <td>{{ item.brand_unit_name }}</td>
                  <td>{{ item.po_type }}</td>
                  <td>
                    <ul>
                      <li
                        v-for="(spec, index) in JSON.parse(item.po_specs)"
                        :key="index"
                      >
                        {{ spec.nama }}: {{ spec.detail }}
                      </li>
                    </ul>
                  </td>
                  <td>{{ item.po_qty }}</td>
                  <td class="text-right">
                    {{ Number(item.po_price).toLocaleString("id-ID") }}
                  </td>
                  <td class="text-right">
                    {{ Number(item.po_amount).toLocaleString("id-ID") }}
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-col>
      </v-row>

      <br />

      <v-row dense justify-md="end">
        <v-col cols="12" sm="6">
          <v-simple-table dense>
            <template v-slot:default>
              <tbody>
                <tr>
                  <td><b>Keterangan</b></td>
                  <td>{{ po.po_desc }}</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-col>

        <v-col cols="12" sm="6" v-if="Object.keys(po).length > 0">
          <v-simple-table dense>
            <template v-slot:default>
              <tbody>
                <tr>
                  <td><b>Subtotal</b></td>
                  <td class="text-right">
                    {{ Number(po.po_sub_total).toLocaleString("id-ID") }}
                  </td>
                </tr>

                <tr>
                  <td><b>Biaya Kirim</b></td>
                  <td class="text-right">
                    <v-text-field
                      v-model.lazy="form.po_shipping_cost"
                      v-money="money"
                      label="Biaya Kirim"
                      outlined
                      dense
                      hide-details
                      :rules="formRules"
                      @change="sumTotal"
                    ></v-text-field>
                  </td>
                </tr>

                <tr>
                  <td><b>Total Order</b></td>
                  <td class="text-right">
                    {{ Number(form.po_total_order).toLocaleString("id-ID") }}
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-col>
      </v-row>

      <br />

      <v-btn
        block
        color="primary"
        :loading="loading"
        :disabled="!valid"
        @click="update"
      >
        <v-icon left>mdi-content-save</v-icon>
        RECEIVE
      </v-btn>
    </div>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { VMoney } from "v-money";

export default {
  name: "ReceivePo",
  components: {
    AppBar: () =>
      import(/* webpackChunkName: "alert" */ "@/components/AppBar.vue"),
  },
  directives: { money: VMoney },
  data: () => ({
    id: "",
    po: {},
    valid: true,
    form: {
      po_receive_date: new Date(
        Date.now() - new Date().getTimezoneOffset() * 60000
      )
        .toISOString()
        .substr(0, 10),
      courier_id: "",
      room_id: "",
      po_shipping_cost: "",
      po_total_order: "",
    },
    formRules: [(v) => !!v || "Field is required"],
    menu: false,
    couriers: [],
    rooms: [],
    money: {
      precision: 0,
      masked: false,
    },
    loading: false,
    totalItem: "",
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
    async getPo() {
      if (this.id.length > 0) {
        await this.axios
          .get("setup-po/v1/purchase-order", {
            headers: {
              Authorization: "Bearer " + this.access_token,
            },
            params: {
              receive: this.id,
            },
          })
          .then((response) => {
            let { data } = response.data;

            if (data.data.length == 0) {
              this.setAlert({
                status: true,
                color: "error",
                text: "No PO tidak ada atau sudah di RECEIVE",
              });
            } else {
              this.po = data.data[0];
              this.id = "";
              this.form.courier_id = this.po.courier_id;
              this.form.po_shipping_cost = this.po.po_shipping_cost;
              this.form.po_total_order = this.po.po_total_order;
              this.totalItem = this.po.items.reduce(
                (sum, item) => Number(sum) + Number(item.po_qty),
                0
              );
            }
          });
      } else {
        this.setAlert({
          status: true,
          color: "error",
          text: "Silahkan masukan No PO terlebih dahulu",
        });
      }
    },
    async getCourier() {
      await this.axios
        .get("setup-po/v1/courier", {
          headers: {
            Authorization: "Bearer " + this.access_token,
          },
        })
        .then((response) => {
          let { data } = response.data;
          this.couriers = data;
        });
    },
    async getRoom() {
      await this.axios
        .get("network/v1/room", {
          headers: {
            Authorization: "Bearer " + this.access_token,
          },
        })
        .then((response) => {
          let { data } = response.data;
          this.rooms = data;
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
    sumTotal() {
      let total_order =
        Number(this.po.po_sub_total) +
        Number(this.form.po_shipping_cost.replaceAll(",", ""));
      this.form.po_total_order = total_order;
    },
    async update() {
      let r = confirm("Apakah anda yakin akan menyimpan data berikut?");

      if (r) {
        this.loading = true;

        let formData = new FormData();
        formData.set("id", this.po.id);
        formData.set("po_receive_date", this.form.po_receive_date);
        formData.set(
          "courier_id",
          this.form.courier_id == null ? "" : this.form.courier_id
        );
        formData.set("room_id", this.form.room_id);
        formData.set("ongkir", this.form.po_shipping_cost.replaceAll(",", ""));
        formData.set("po_total_order", this.form.po_total_order);
        formData.set("items", JSON.stringify(this.po.items));
        formData.set("total_item", this.totalItem);

        await this.axios
          .post("setup-po/v1/update-po", formData, {
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
            this.$router.push("/data-asset/list-unit");
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
    await this.getCourier();
    await this.getRoom();
  },
};
</script>

<style>
</style>