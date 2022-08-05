<template>
  <v-dialog v-model="dialogFormUnit" persistent max-width="500">
    <v-card>
      <v-toolbar dark color="primary" dense hide-orverlay>
        <v-toolbar-title>Tambah Unit</v-toolbar-title>

        <v-spacer></v-spacer>

        <v-btn icon dark @click="closeDialogFormUnit">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-container fluid>
        <v-form v-model="valid" ref="form">
          <v-autocomplete
            v-model="form.unit_id"
            label="Unit"
            :items="units"
            item-text="unit_name"
            item-value="id"
            cache-items
            outlined
            dense
            hide-selected
            :rules="formRules"
            @change="getBrand(form.unit_id)"
            v-on:change="form.brand_id = ''"
          ></v-autocomplete>

          <v-autocomplete
            v-model="form.brand_id"
            :items="brands"
            item-text="brand_unit_name"
            item-value="id"
            label="Brand"
            outlined
            dense
            hide-selected
            :rules="formRules"
            @change="selectBrand"
          ></v-autocomplete>

          <v-text-field
            v-model="form.po_type"
            label="Type"
            outlined
            dense
            :rules="formRules"
          ></v-text-field>

          <h3>Spesifikasi</h3>

          <v-simple-table dense class="mb-4">
            <template v-slot:default>
              <thead>
                <tr>
                  <th>Nama</th>
                  <th>Detail</th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="(item, index) in form.po_specs" :key="index">
                  <td>
                    <v-text-field
                      v-model="item.nama"
                      outlined
                      dense
                      :rules="formRules"
                    ></v-text-field>
                  </td>

                  <td>
                    <v-text-field
                      v-model="item.detail"
                      outlined
                      dense
                      :rules="formRules"
                    ></v-text-field>
                  </td>

                  <td valign="top" v-if="index > 0">
                    <v-btn icon small color="error" @click="removeSpec(index)">
                      <v-icon>mdi-minus-circle</v-icon>
                    </v-btn>
                  </td>
                </tr>

                <tr>
                  <td colspan="3">
                    <v-btn block color="primary" outlined @click="addSpec">
                      <v-icon>mdi-plus-circle</v-icon> Tambah Baru
                    </v-btn>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>

          <v-text-field
            v-model="form.po_qty"
            type="number"
            label="Qty"
            outlined
            dense
            :rules="formRules"
            @change="sumAmount"
          ></v-text-field>

          <v-text-field
            v-model.lazy="form.po_price"
            label="Harga"
            v-money="money"
            ref="po_price"
            outlined
            dense
            :rules="formRules"
            @change="sumAmount"
          ></v-text-field>

          <div class="d-flex justify-space-between align-center">
            <b>Total:</b>

            <b>{{ form.po_amount.toLocaleString("id-ID") }}</b>
          </div>
        </v-form>

        <v-btn
          block
          color="primary"
          :disabled="!valid"
          class="mt-2"
          @click="addCart"
          v-if="editedIndex == -1"
        >
          <v-icon left>mdi-content-save</v-icon>
          Tambah
        </v-btn>

        <v-btn
          block
          color="primary"
          :disabled="!valid"
          class="mt-2"
          @click="editCart"
          v-else
        >
          <v-icon left>mdi-content-save</v-icon>
          edit
        </v-btn>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { VMoney } from "v-money";

export default {
  name: "FormUnit",
  props: ["editedIndex"],
  directives: { money: VMoney },
  data: () => ({
    dialogFormUnit: false,
    valid: true,
    formRules: [(v) => !!v || "Field is required"],
    form: {
      unit_id: "",
      unit_name: "",
      brand_id: "",
      brand_unit_name: "",
      po_type: "",
      po_specs: [
        {
          nama: "",
          detail: "",
        },
      ],
      po_qty: 1,
      po_price: 0,
      po_amount: 0,
    },
    default: {
      unit_id: "",
      unit_name: "",
      brand_id: "",
      brand_unit_name: "",
      po_type: "",
      po_specs: [
        {
          nama: "",
          detail: "",
        },
      ],
      po_qty: 1,
      po_price: 0,
      po_amount: 0,
    },
    units: [],
    brands: [],
    money: {
      precision: 0,
      masked: false,
    },
  }),
  computed: {
    ...mapGetters({
      access_token: "token/token",
    }),
  },
  dialogFormUnit(val) {
    val || this.closeDialogFormUnit();
  },
  methods: {
    ...mapActions({
      setAlert: "alert/set",
    }),
    closeDialogFormUnit() {
      this.dialogFormUnit = false;
      this.$nextTick(() => {
        this.form = Object.assign({}, this.default);
        this.form.po_specs = [{ nama: "", detail: "" }];
        this.$refs.po_price.$el.getElementsByTagName("input")[0].value = 0;
        this.$parent.editedIndex = -1;
      });
    },
    async getUnit() {
      await this.axios
        .get("setup-asset/v1/unit", {
          headers: {
            Authorization: "Bearer " + this.access_token,
          },
        })
        .then((response) => {
          let { data } = response.data;
          this.units = data;
        });
    },
    async getBrand(id) {
      await this.axios
        .get("setup-asset/v1/brand-unit", {
          headers: {
            Authorization: "Bearer " + this.access_token,
          },
          params: {
            unit_id: id,
          },
        })
        .then((response) => {
          let { data } = response.data;
          this.brands = data;

          let unit = this.units.filter(
            (item) => item.id == this.form.unit_id
          )[0];
          this.form.unit_name = unit.unit_name;
        });
    },
    selectBrand() {
      let brand = this.brands.filter(
        (item) => item.id == this.form.brand_id
      )[0];
      this.form.brand_unit_name = brand.brand_unit_name;
    },
    addSpec() {
      this.form.po_specs.push({
        nama: "",
        detail: "",
      });
    },
    removeSpec(index) {
      this.form.po_specs.splice(index, 1);
    },
    sumAmount() {
      let total =
        Number(this.form.po_qty) *
        Number(this.form.po_price.replaceAll(",", ""));
      this.form.po_amount = total;
    },
    addCart() {
      this.$parent.addItem(this.form);
      this.closeDialogFormUnit();
    },
    editCart() {
      this.$parent.editCart(this.form);
      this.closeDialogFormUnit();
    },
  },
  async created() {
    await this.getUnit();
  },
};
</script>

<style>
</style>