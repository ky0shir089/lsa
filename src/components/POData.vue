<template>
  <v-container fluid>
    <v-row dense>
      <v-col cols="12" sm="6">
        <v-simple-table dense>
          <template v-slot:default>
            <tbody>
              <tr>
                <td><b>Supplier</b></td>
                <td>{{ po.supplier_id }} | {{ po.supplier_name }}</td>
              </tr>

              <tr>
                <td><b>Alamat Vendor</b></td>
                <td><b>Alamat Kirim</b></td>
              </tr>

              <tr>
                <td>{{ po.supplier_address }}</td>
                <td>{{ po.po_ship_to }}</td>
              </tr>

              <tr v-if="po.po_payment == 'TRANSFER'">
                <td><b>No Rekening</b></td>
                <td>
                  {{ po.bank_name }} - {{ po.account_no }} -
                  {{ po.account_name }}
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-col>

      <v-col cols="12" sm="6">
        <v-simple-table dense>
          <template v-slot:default>
            <tbody>
              <tr v-if="po.po_number != null">
                <td><b>PO Number</b></td>
                <td>{{ po.po_number }}</td>
              </tr>

              <tr>
                <td><b>PO Date</b></td>
                <td>{{ po.po_date }}</td>
              </tr>

              <tr>
                <td><b>Ketentuan</b></td>
                <td>{{ po.po_term }}</td>
              </tr>

              <tr>
                <td><b>Pembayaran</b></td>
                <td>{{ po.po_payment }}</td>
              </tr>

              <tr>
                <td><b>Kurir</b></td>
                <td>{{ po.courier_name }}</td>
              </tr>

              <tr>
                <td><b>Status</b></td>
                <td>{{ po.po_status }}</td>
              </tr>

              <tr v-if="po.po_receive_date != null">
                <td><b>PO Receive Date</b></td>
                <td>{{ po.po_receive_date }}</td>
              </tr>

              <tr v-if="po.po_status == 'REJECT'">
                <td><b>Alasan Reject</b></td>
                <td class="red--text">{{ po.po_reject_reason }}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
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
                  <ul v-if="typeof item.po_specs == 'string'">
                    <li
                      v-for="(spec, index) in JSON.parse(item.po_specs)"
                      :key="index"
                    >
                      {{ spec.nama }}: {{ spec.detail }}
                    </li>
                  </ul>

                  <ul v-else>
                    <li v-for="(spec, index) in item.po_specs" :key="index">
                      {{ spec.nama }}: {{ spec.detail }}
                    </li>
                  </ul>
                </td>

                <td>{{ item.po_qty }}</td>

                <td class="text-right">
                  {{ item.po_price.toLocaleString("id-ID") }}
                </td>

                <td class="text-right">
                  {{ item.po_amount.toLocaleString("id-ID") }}
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-col>
    </v-row>

    <br />

    <v-row dense>
      <v-col cols="6">
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

      <v-col cols="6" v-if="Object.keys(po).length > 0">
        <v-simple-table dense>
          <template v-slot:default>
            <tbody>
              <tr>
                <td><b>Subtotal</b></td>
                <td class="text-right">
                  {{ po.po_sub_total.toLocaleString("id-ID") }}
                </td>
              </tr>

              <tr>
                <td><b>Biaya Kirim</b></td>
                <td class="text-right">
                  {{ po.po_shipping_cost.toLocaleString("id-ID") }}
                </td>
              </tr>

              <tr>
                <td><b>Total Order</b></td>
                <td class="text-right">
                  {{ po.po_total_order.toLocaleString("id-ID") }}
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "ViewPo",
  props: ["po"],
  methods: {
    closeView() {
      this.$root.$emit("close");
    },
  },
};
</script>

<style>
</style>