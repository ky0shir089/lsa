<template>
  <v-container fluid>
    <app-bar />

    <v-app-bar app color="primary" v-if="$vuetify.breakpoint.xs">
      <v-btn icon dark @click.stop="$router.go(-1)">
        <v-icon>mdi-arrow-left-circle</v-icon>
      </v-btn>
    </v-app-bar>

    <v-form ref="form" v-model="valid">
      <v-row>
        <v-col cols="12" sm="6">
          <div class="text-h5 mb-4">{{ $route.name }}</div>

          <v-text-field
            v-model="form.supplier_name"
            label="Nama Supplier"
            outlined
            dense
            :rules="formRules"
          ></v-text-field>

          <v-textarea
            v-model="form.supplier_address"
            label="Alamat"
            outlined
            dense
            rows="1"
            auto-grow
            :rules="formRules"
          ></v-textarea>

          <v-row dense>
            <v-col cols="6">
              <v-text-field
                v-model="form.kelurahan"
                label="Kelurahan"
                outlined
                dense
                readonly
                :rules="formRules"
              ></v-text-field>
            </v-col>

            <v-col cols="6">
              <v-text-field
                v-model="form.kecamatan"
                label="Kecamatan"
                outlined
                dense
                readonly
                :rules="formRules"
              ></v-text-field>
            </v-col>

            <v-col cols="4">
              <v-text-field
                v-model="form.kabupaten"
                label="Kabupaten"
                outlined
                dense
                readonly
                :rules="formRules"
              ></v-text-field>
            </v-col>

            <v-col cols="4">
              <v-text-field
                v-model="form.provinsi"
                label="Provinsi"
                outlined
                dense
                readonly
                :rules="formRules"
              ></v-text-field>
            </v-col>

            <v-col cols="3">
              <v-text-field
                v-model="form.kodepos"
                label="Kodepos"
                outlined
                dense
                readonly
                :rules="formRules"
              ></v-text-field>
            </v-col>

            <v-col cols="1">
              <v-btn icon @click="open">
                <v-icon>mdi-magnify</v-icon>
              </v-btn>
            </v-col>
          </v-row>

          <v-text-field
            v-model="form.supplier_phone"
            type="tel"
            label="Telepon"
            outlined
            dense
            maxlength="13"
            :rules="formRules"
          ></v-text-field>

          <v-text-field
            v-model="form.supplier_pic"
            label="PIC"
            outlined
            dense
            :rules="formRules"
          ></v-text-field>

          <v-text-field
            v-model="form.supplier_email"
            label="Email"
            outlined
            dense
          ></v-text-field>

          <v-text-field
            v-model="form.supplier_website"
            label="Website"
            outlined
            dense
          ></v-text-field>

          <v-btn
            block
            color="primary"
            :loading="loading"
            :disabled="!valid"
            @click="update"
          >
            <v-icon left>mdi-content-save</v-icon>
            Update
          </v-btn>
        </v-col>

        <v-col cols="12" sm="6">
          <div class="d-flex align-center justify-space-between">
            <div>Rekening</div>

            <v-btn icon color="primary" @click="add">
              <v-icon>mdi-plus-circle</v-icon>
            </v-btn>
          </div>

          <v-simple-table dense class="elevation-1">
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-center">Bank</th>
                  <th class="text-center">No Rekening</th>
                  <th class="text-center">Nama Rekening</th>
                  <th class="text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="(item, index) in form.accounts" :key="index">
                  <td>
                    <v-autocomplete
                      v-model="item.bank_id"
                      :items="banks"
                      item-text="bank_name"
                      item-value="id"
                      outlined
                      dense
                      hide-selected
                      hide-details
                    ></v-autocomplete>
                  </td>

                  <td>
                    <v-text-field
                      v-model="item.account_no"
                      outlined
                      dense
                      hide-details
                    ></v-text-field>
                  </td>

                  <td>
                    <v-text-field
                      v-model.lazy="item.account_name"
                      outlined
                      dense
                      hide-details
                    ></v-text-field>
                  </td>

                  <td>
                    <v-btn icon @click="update_account(item)" v-if="item.id">
                      <v-icon>mdi-content-save</v-icon>
                    </v-btn>

                    <v-btn icon @click="new_account(item)" v-else>
                      <v-icon>mdi-content-save</v-icon>
                    </v-btn>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-col>
      </v-row>
    </v-form>

    <list-address-dtl ref="dialog" />
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "EditSupplier",
  components: {
    AppBar: () =>
      import(/* webpackChunkName: "alert" */ "@/components/AppBar.vue"),
    ListAddressDtl: () =>
      import(
        /* webpackChunkName: "list-address-dtl" */ "@/components/ListAddressDtl.vue"
      ),
  },
  data: () => ({
    valid: true,
    form: {},
    formRules: [(v) => !!v || "Field is required"],
    banks: [],
    loading: false,
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
    open() {
      this.$refs.dialog.open();
    },
    select(item) {
      this.form.supplier_address_dtl = item.id;
      this.form.kelurahan = item.kelurahan;
      this.form.kecamatan = item.kecamatan;
      this.form.kabupaten = item.kabupaten;
      this.form.provinsi = item.provinsi;
      this.form.kodepos = item.kodepos;
    },
    async getBank() {
      await this.axios
        .get("setup-po/v1/bank", {
          headers: {
            Authorization: "Bearer " + this.access_token,
          },
        })
        .then((response) => {
          let { data } = response.data;
          this.banks = data;
        });
    },
    add() {
      this.form.accounts.push({
        bank_id: "",
        account_no: "",
        account_name: "",
      });
    },
    async getMaster() {
      await this.axios
        .get("setup-po/v1/supplier/" + this.$route.params.id, {
          headers: {
            Authorization: "Bearer " + this.access_token,
          },
        })
        .then((response) => {
          let { data } = response.data;
          this.form = data[0];
        });
    },
    async update() {
      this.loading = true;

      let formData = new FormData();
      formData.set("id", this.form.id);
      formData.set("supplier_name", this.form.supplier_name.toUpperCase());
      formData.set(
        "supplier_address",
        this.form.supplier_address.toUpperCase()
      );
      formData.set("supplier_address_dtl", this.form.supplier_address_dtl);
      formData.set("supplier_phone", this.form.supplier_phone);
      formData.set("supplier_pic", this.form.supplier_pic.toUpperCase());
      formData.set("supplier_email", this.form.supplier_email);
      formData.set("supplier_website", this.form.supplier_website);

      await this.axios
        .post("setup-po/v1/update-supplier", formData, {
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
          this.$router.go(-1);
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
    },
    async new_account(item) {
      let formData = new FormData();
      formData.set("supplier_id", this.form.id);
      formData.set("bank_id", item.bank_id);
      formData.set("account_no", item.account_no);
      formData.set("account_name", item.account_name);

      await this.axios
        .post("setup-po/v1/store-account", formData, {
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
    },
    async update_account(item) {
      let formData = new FormData();
      formData.set("id", item.id);
      formData.set("bank_id", item.bank_id);
      formData.set("account_no", item.account_no);
      formData.set("account_name", item.account_name);

      await this.axios
        .post("setup-po/v1/update-account", formData, {
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
    },
  },
  async created() {
    await this.getBank();
    await this.getMaster();
  },
};
</script>

<style>
</style>