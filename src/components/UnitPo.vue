<template>
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
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="item in items" :key="item.id">
              <td>{{ item.unit_name }}</td>

              <td>{{ item.brand_unit_name }}</td>

              <td>{{ item.po_type }}</td>

              <td>
                <div v-for="(spec, index) in item.po_specs" :key="index">
                  <div>{{ spec.nama }} : {{ spec.detail }}</div>
                </div>
              </td>

              <td>{{ item.po_qty }}</td>

              <td class="text-right">
                {{ item.po_price.toLocaleString("id-ID") }}
              </td>

              <td class="text-right">
                {{ item.po_amount.toLocaleString("id-ID") }}
              </td>

              <td>
                <v-btn icon color="green" @click="editItem(item)">
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>

      <v-btn
        block
        color="primary"
        outlined
        @click="$refs.formUnit.dialogFormUnit = true"
      >
        <v-icon>mdi-plus-circle</v-icon> Tambah Baru
      </v-btn>

      <!-- <v-dialog v-model="dialogFormUnit" persistent max-width="500">
      <v-card>
        <v-toolbar dark color="primary" dense hide-orverlay>
          <v-toolbar-title>Tambah Unit</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon dark @click="closeDialogFormUnit">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>

        <form-unit :editedIndex="editedIndex" ref="formUnit" />
      </v-card>
    </v-dialog> -->

      <form-unit :editedIndex="editedIndex" ref="formUnit" />
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "UnitPo",
  props: ["items"],
  components: {
    FormUnit: () =>
      import(/* webpackChunkName: "form-unit" */ "@/components/FormUnit.vue"),
  },
  data: () => ({
    editedIndex: -1,
    dialogFormUnit: false,
  }),
  computed: {
    ...mapGetters({
      access_token: "token/token",
    }),
  },
  watch: {
    dialogFormUnit(val) {
      val || this.closeDialogFormUnit();
    },
  },
  methods: {
    ...mapActions({
      setAlert: "alert/set",
    }),
    open() {
      this.$refs.formUnit.dialogFormUnit = true;
    },
    addItem(item) {
      let myItem = this.items;
      myItem.push(item);
      this.sumAmount();
    },
    editItem(item) {
      this.editedIndex = this.items.indexOf(item);
      this.$refs.formUnit.form = Object.assign({}, item);
      if (this.$refs.formUnit.$refs.po_price != undefined) {
        this.$refs.formUnit.$refs.po_price.$el.getElementsByTagName(
          "input"
        )[0].value = item.po_price;
      }
      this.$refs.formUnit.getBrand(item.unit_id);
      this.$refs.formUnit.dialogFormUnit = true;
    },
    editCart(item) {
      let myItem = this.items;
      myItem.splice(this.editedIndex, 1, item);
      this.sumAmount();
    },
    sumAmount() {
      let subtotal = this.items.reduce(
        (sum, item) => Number(sum) + Number(item.po_amount),
        0
      );
      this.$parent.$parent.form.po_sub_total = subtotal;

      this.sumTotal();
    },
    sumTotal() {
      let total_order =
        Number(this.$parent.$parent.form.po_sub_total) +
        Number(this.$parent.$parent.form.po_shipping_cost.replaceAll(",", ""));
      this.$parent.$parent.form.po_total_order = total_order;
    },
  },
};
</script>

<style>
</style>