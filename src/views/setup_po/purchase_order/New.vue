<template>
  <v-container fluid>
    <app-bar />

    <v-app-bar app color="primary" v-if="$vuetify.breakpoint.xs">
      <v-btn icon dark @click.stop="$router.go(-1)">
        <v-icon>mdi-arrow-left-circle</v-icon>
      </v-btn>
    </v-app-bar>

    <div class="text-h5 mb-4">{{ $route.name }}</div>

    <v-form ref="form" v-model="valid">
      <v-row>
        <v-col cols="12" sm="6">
          <v-row dense>
            <v-col cols="3">
              <v-text-field
                v-model="form.supplier_id"
                label="Supl ID"
                outlined
                dense
                readonly
              ></v-text-field>
            </v-col>

            <v-col cols="9">
              <v-autocomplete
                v-model="form.supplier_name"
                label="Supplier Name"
                :items="suppliers"
                item-text="supplier_name"
                item-value="supplier_name"
                outlined
                dense
                hide-selected
                @change="selectSupplier"
                :rules="formRules"
                append-outer-icon="mdi-plus-circle"
                @click:append-outer="open"
              ></v-autocomplete>
            </v-col>

            <v-col cols="12" sm="6">
              <v-textarea
                v-model="form.supplier_address"
                label="Alamat Supplier"
                outlined
                dense
                rows="1"
                auto-grow
                readonly
              ></v-textarea>
            </v-col>

            <v-col cols="12" sm="6">
              <v-textarea
                v-model="form.po_ship_to"
                label="Alamat Kirim"
                outlined
                dense
                rows="1"
                auto-grow
                :rules="formRules"
              ></v-textarea>
            </v-col>
          </v-row>
        </v-col>

        <v-col cols="12" sm="6">
          <v-text-field
            v-model="form.po_date"
            label="PO Date"
            outlined
            dense
            readonly
            :rules="formRules"
          ></v-text-field>

          <v-autocomplete
            v-model="form.po_term"
            label="Ketentuan"
            :items="['TUNAI', 'TEMPO', 'SEWA']"
            outlined
            dense
            hide-selected
            :rules="formRules"
          ></v-autocomplete>

          <v-autocomplete
            v-model="form.po_payment"
            label="Pembayaran"
            :items="['CASH', 'TRANSFER']"
            outlined
            dense
            hide-selected
            :rules="formRules"
          ></v-autocomplete>

          <v-autocomplete
            v-model="form.supplier_account_id"
            label="Nomor Rekening"
            :items="accounts"
            item-text="account_no"
            item-value="id"
            outlined
            dense
            hide-selected
            :rules="formRules"
            @change="selectAccount"
            v-if="form.po_payment == 'TRANSFER'"
          >
            <template v-slot:selection="data">
              {{ data.item.bank_name }} - {{ data.item.account_no }} -
              {{ data.item.account_name }}
            </template>

            <template v-slot:item="data">
              {{ data.item.bank_name }} - {{ data.item.account_no }} -
              {{ data.item.account_name }}
            </template>
          </v-autocomplete>

          <v-autocomplete
            v-model="form.courier_id"
            label="Kurir"
            :items="couriers"
            item-text="courier_name"
            item-value="id"
            outlined
            dense
            hide-selected
            @change="selectCourier"
          ></v-autocomplete>

          <v-text-field
            v-model="form.po_pv"
            label="No PV"
            outlined
            dense
            v-if="form.po_term == 'TUNAI'"
          ></v-text-field>
        </v-col>
      </v-row>

      <unit-po :items="form.items" ref="unitPo" />

      <br />

      <v-row dense>
        <v-col cols="12" sm="6">
          <v-textarea
            v-model="form.po_desc"
            label="Keterangan"
            outlined
            dense
            rows="4"
            auto-grow
          ></v-textarea>
        </v-col>

        <v-col cols="12" sm="6">
          <div class="d-flex align-center justify-space-around">
            <b>Subtotal:</b>
            <b>{{ Number(form.po_sub_total).toLocaleString("id-ID") }}</b>
          </div>

          <v-text-field
            ref="po_shipping_cost"
            v-model.lazy="form.po_shipping_cost"
            v-money="money"
            label="Biaya Kirim"
            outlined
            dense
            hide-details
            :rules="formRules"
            @change="sumTotal"
          ></v-text-field>

          <div class="d-flex align-center justify-space-around">
            <b>Total Order:</b>
            <b>{{ Number(form.po_total_order).toLocaleString("id-ID") }}</b>
          </div>
        </v-col>
      </v-row>
    </v-form>

    <br />

    <v-btn
      block
      color="primary"
      :disabled="!valid || form.items.length < 1"
      @click="check = true"
    >
      <v-icon left>mdi-file-document</v-icon>
      View Draft
    </v-btn>

    <v-dialog v-model="dialog" fullscreen>
      <v-card>
        <v-toolbar dark color="primary" dense hide-orverlay>
          <v-spacer></v-spacer>
          <v-btn icon dark @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>

        <form-supplier />
      </v-card>
    </v-dialog>

    <v-dialog v-model="check" width="1000">
      <v-card>
        <v-toolbar dark color="primary" dense hide-orverlay>
          <v-spacer></v-spacer>
          <v-btn icon dark @click="check = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>

        <hr class="mt-2" />
        <h2 class="text-center">PURCHASE ORDER</h2>
        <hr />

        <po-data :po="form" />

        <v-card-actions>
          <v-btn
            block
            color="primary"
            :loading="loading"
            :disabled="!valid"
            @click="store"
          >
            <v-icon left>mdi-content-save</v-icon>
            Submit
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { VMoney } from "v-money";

export default {
  name: "NewPo",
  components: {
    AppBar: () =>
      import(/* webpackChunkName: "alert" */ "@/components/AppBar.vue"),
    FormSupplier: () =>
      import(
        /* webpackChunkName: "form-supplier" */ "@/components/FormSupplier.vue"
      ),
    PoData: () =>
      import(/* webpackChunkName: "view-po" */ "@/components/POData.vue"),
    UnitPo: () =>
      import(/* webpackChunkName: "unit-po" */ "@/components/UnitPo.vue"),
  },
  directives: { money: VMoney },
  data: () => ({
    valid: true,
    form: {
      supplier_id: "",
      supplier_name: "",
      supplier_address: "",
      po_ship_to:
        "JL. DANAU SUNTER SELATAN KOMPLEK RUKO ROYAL SUNTER BLOK C NO 22 JAKARTA UTARA",
      po_date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10),
      po_term: "",
      po_payment: "",
      supplier_account_id: "",
      account_no: "",
      account_name: "",
      courier_id: "",
      courier_name: "",
      po_pv: "",
      po_status: "DRAFT",
      items: [],
      po_desc: "",
      po_sub_total: 0,
      po_shipping_cost: 0,
      po_total_order: 0,
    },
    formRules: [(v) => !!v || "Field is required"],
    suppliers: [],
    accounts: [],
    couriers: [],
    units: [],
    money: {
      precision: 0,
      masked: false,
    },
    loading: false,
    dialog: false,
    check: false,
  }),
  computed: {
    ...mapGetters({
      access_token: "token/token",
      getDraft: "draftPo/draftPo",
    }),
  },
  methods: {
    ...mapActions({
      setAlert: "alert/set",
      setDraft: "draftPo/set",
    }),
    initialize() {
      if (Object.keys(this.getDraft).length > 0) {
        this.form = this.getDraft;
        this.form.po_shipping_cost =
          this.$refs.po_shipping_cost.$el.getElementsByTagName(
            "input"
          )[0].value = this.getDraft.po_shipping_cost;
      }
    },
    open() {
      this.dialog = true;
    },
    close() {
      this.dialog = false;
    },
    async getSupplier() {
      await this.axios
        .get("setup-po/v1/supplier", {
          headers: {
            Authorization: "Bearer " + this.access_token,
          },
        })
        .then((response) => {
          let { data } = response.data;
          this.suppliers = data;
        });
    },
    selectSupplier() {
      let supplier = this.suppliers.filter(
        (item) => item.supplier_name == this.form.supplier_name
      )[0];
      this.form.supplier_id = supplier.id;
      this.form.supplier_address = supplier.supplier_address;
      this.accounts = supplier.accounts;
    },
    selectAccount() {
      let account = this.accounts.filter(
        (item) => item.id == this.form.supplier_account_id
      )[0];
      this.form.bank_name = account.bank_name;
      this.form.account_no = account.account_no;
      this.form.account_name = account.account_name;
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
    selectCourier() {
      let courier = this.couriers.filter(
        (item) => item.id == this.form.courier_id
      )[0];
      this.form.courier_name = courier.courier_name;
    },
    sumTotal() {
      let total_order =
        Number(this.form.po_sub_total) +
        Number(this.form.po_shipping_cost.replaceAll(",", ""));
      this.form.po_total_order = total_order;
    },
    addToData(item) {
      this.form.items.push(item);
      let subtotal = this.form.items.reduce(
        (sum, item) => Number(sum) + Number(item.po_amount),
        0
      );
      this.form.po_sub_total = subtotal;
    },
    editedData(item) {
      this.form.items.splice(this.$refs.unitPo.editedIndex, 1, item);
      let subtotal = this.form.items.reduce(
        (sum, item) => Number(sum) + Number(item.po_amount),
        0
      );
      this.form.po_sub_total = subtotal;
    },
    async store() {
      let r = confirm("Apakah anda yakin akan mensubmit data berikut?");

      if (r) {
        this.loading = true;

        let formData = new FormData();
        formData.set("supplier_id", this.form.supplier_id);
        formData.set("po_ship_to", this.form.po_ship_to);
        formData.set("po_term", this.form.po_term);
        formData.set("po_payment", this.form.po_payment);
        formData.set("supplier_account_id", this.form.supplier_account_id);
        if (this.form.courier_id != null) {
          formData.set("courier_id", this.form.courier_id);
        }
        formData.set("po_pv", this.form.po_pv);
        formData.set("po_desc", this.form.po_desc);
        formData.set("items", JSON.stringify(this.form.items));
        formData.set(
          "po_shipping_cost",
          this.form.po_shipping_cost.replaceAll(",", "")
        );

        await this.axios
          .post("setup-po/v1/store-po", formData, {
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
            this.check = false;
            this.$router.push("/setup-po/purchase-order/view/" + data.data.id);
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
    await this.getSupplier();
    await this.getCourier();
    this.$refs.form.validate();
  },
  mounted() {
    this.$root.$on("close", this.close);
    this.$root.$on("getSupplier", this.getSupplier);
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.initialize();
    });
  },
  beforeRouteLeave(to, from, next) {
    if (this.check || this.dialog || this.$refs.unitPo.dialogFormUnit) {
      next(false);
      this.check = false;
      this.dialog = false;
      this.$refs.unitPo.dialogFormUnit = false;
    } else {
      if (this.loading) {
        this.setDraft({});
      } else {
        this.setDraft(this.form);
      }
      next();
    }
  },
};
</script>

<style>
</style>