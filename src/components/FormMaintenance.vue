<template>
  <v-card flat>
    <v-card-title class="d-flex justify-space-between align-center">
      <div>List Maintenance</div>

      <v-btn color="primary" @click="openDialog"> Add </v-btn>
    </v-card-title>

    <v-simple-table dense>
      <template v-slot:default>
        <thead>
          <tr>
            <th>Tanggal</th>
            <th>Tipe</th>
            <th>Detail</th>
            <th>Dari Komponen</th>
            <th>Ke Komponen</th>
            <th>Price</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="item in unit.maintenances" :key="item.id">
            <td>
              {{ item.mt_date }}
            </td>

            <td>
              {{ item.mt_type }}
            </td>

            <td>
              {{ item.mt_detail }}
            </td>

            <td>
              <div v-if="item.change_component_id != null">
                K{{ item.change_component_id }} - {{ item.from_name }}
              </div>
            </td>

            <td>
              <div v-if="item.data_component_id != null">
                K{{ item.data_component_id }} - {{ item.to_name }}
              </div>
            </td>

            <td>
              {{ item.mt_price.toLocaleString("id-ID") }}
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>

    <v-dialog v-model="dialogMt" persistent width="450">
      <v-card>
        <v-toolbar dark color="primary" dense hide-orverlay>
          <v-card-title>New Maintenance</v-card-title>
          <v-spacer></v-spacer>
          <v-btn icon dark @click="dialogMt = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-container fluid>
          <v-form v-model="valid">
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
                  v-model="form.mt_date"
                  label="Tanggal"
                  outlined
                  dense
                  append-icon="mdi-calendar"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                  :rules="formRules"
                ></v-text-field>
              </template>

              <v-date-picker
                v-model="form.mt_date"
                @input="menu = false"
              ></v-date-picker>
            </v-menu>

            <v-text-field
              v-model="form.mt_type"
              label="Tipe"
              outlined
              dense
              value="GANTI"
              readonly
              :rules="formRules"
              v-if="ganti"
            ></v-text-field>

            <v-autocomplete
              v-model="form.mt_type"
              label="Tipe"
              :items="types"
              outlined
              dense
              hide-selected
              :rules="formRules"
              @change="freeCost"
              v-else
            ></v-autocomplete>

            <v-autocomplete
              v-model="form.data_component_id"
              label="Komponen"
              :items="components"
              item-text="component_name"
              item-value="id"
              outlined
              dense
              hide-selected
              :rules="form.mt_type == 'TAMBAH' ? formRules : []"
              v-if="form.mt_type == 'TAMBAH' || form.mt_type == 'GANTI'"
            >
              <template v-slot:selection="data">
                K{{ data.item.id }} - {{ data.item.component_name }} -
                {{ data.item.brand_component_name }} -
                {{ data.item.component_type }}
              </template>

              <template v-slot:item="data">
                K{{ data.item.id }} - {{ data.item.component_name }} -
                {{ data.item.brand_component_name }} -
                {{ data.item.component_type }}
              </template>
            </v-autocomplete>

            <v-text-field
              v-model="form.mt_detail"
              label="Detail"
              outlined
              dense
              :rules="formRules"
            ></v-text-field>

            <v-text-field
              ref="mt_price"
              v-model.lazy="form.mt_price"
              v-money="money"
              label="Biaya"
              outlined
              dense
              hide-details
              :rules="formRules"
              :readonly="readonly"
            ></v-text-field>
          </v-form>
        </v-container>

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
  </v-card>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { VMoney } from "v-money";

export default {
  name: "FormMaintenance",
  props: ["unit"],
  directives: { money: VMoney },
  data: () => ({
    dialogMt: false,
    valid: true,
    form: {
      mt_date: "",
      mt_type: "",
      mt_detail: "",
      data_component_id: "",
      mt_price: "",
    },
    default: {
      mt_date: "",
      mt_type: "",
      mt_detail: "",
      data_component_id: "",
      mt_price: "",
    },
    formRules: [(v) => !!v || "Field is required"],
    menu: false,
    types: ["SERVICE", "TAMBAH"],
    components: [],
    money: {
      precision: 0,
      masked: false,
    },
    loading: false,
    ganti: false,
    removeId: "",
    readonly: false,
  }),
  computed: {
    ...mapGetters({
      access_token: "token/token",
    }),
  },
  watch: {
    dialogMt(val) {
      val || this.toggleTipe();
    },
  },
  methods: {
    ...mapActions({
      setAlert: "alert/set",
    }),
    openDialog() {
      this.getComponent();
      this.dialogMt = true;
    },
    async getComponent() {
      await this.axios
        .get("list-asset/v1/list-component?page=1", {
          headers: {
            Authorization: "Bearer " + this.access_token,
          },
          params: {
            stock: true,
          },
        })
        .then((response) => {
          let { data } = response.data;
          this.components = data.data;
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
    async changeComponent(item) {
      await this.axios
        .get("list-asset/v1/list-component?page=1", {
          headers: {
            Authorization: "Bearer " + this.access_token,
          },
          params: {
            stock: true,
            component_id: item.component_id,
          },
        })
        .then((response) => {
          let { data } = response.data;
          this.components = data.data;
          this.removeId = item.id;
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
    async store() {
      let r = window.confirm("apakah anda yakin?");

      if (r) {
        this.loading = true;

        let formData = new FormData();
        formData.set("data_unit_id", this.unit.id);
        formData.set("mt_date", this.form.mt_date);
        formData.set("mt_type", this.form.mt_type);
        formData.set("mt_detail", this.form.mt_detail);
        if (this.form.mt_type == "GANTI") {
          formData.set("change_component_id", this.removeId);
        }
        formData.set("data_component_id", this.form.data_component_id);
        formData.set("mt_price", this.form.mt_price.replaceAll(",", ""));

        await this.axios
          .post("list-asset/v1/store-maintenance", formData, {
            headers: {
              Authorization: "Bearer " + this.access_token,
            },
          })
          .then((response) => {
            if (this.form.mt_type != "SERVICE") {
              if (this.form.mt_type == "GANTI") {
                this.removeComponent();
                if (this.form.data_component_id != "") {
                  this.addComponent();
                }
              }
              if (this.form.mt_type == "TAMBAH") {
                this.addComponent();
              }
            } else {
              let { data } = response;
              this.setAlert({
                status: true,
                color: "success",
                text: data.message,
              });
              this.$parent.getMaster();
              this.loading = false;
              this.dialogMt = false;
            }
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
    async addComponent() {
      let formData = new FormData();
      formData.set("id", this.form.data_component_id);
      formData.set("unit_id", this.unit.id);

      await this.axios
        .post("list-asset/v1/add-unit-component", formData, {
          headers: {
            Authorization: "Bearer " + this.access_token,
          },
        })
        .then(() => {
          this.$parent.getMaster();
          this.dialogMt = false;
          this.loading = false;
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
    async removeComponent() {
      let formData = new FormData();
      formData.set("id", this.removeId);

      await this.axios
        .post("list-asset/v1/change-unit-component", formData, {
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
          this.$parent.getMaster();
          this.dialogMt = false;
          this.loading = false;
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
    toggleTipe() {
      this.ganti = false;
      this.freeCost();
      this.$nextTick(() => {
        this.form = Object.assign({}, this.default);
      });
    },
    freeCost() {
      this.form.mt_price = 0;
      this.$refs.mt_price.$el.getElementsByTagName("input")[0].value = 0;

      if (this.form.mt_type == "SERVICE") {
        this.readonly = false;
      } else {
        this.readonly = true;
      }
    },
  },
};
</script>

<style>
</style>