<template>
  <v-card flat>
    <v-card-title>Existing Komponen</v-card-title>

    <div v-if="unit.components.length == 0">
      <v-container fluid>
        <v-form v-model="valid">
          <v-simple-table dense>
            <template v-slot:default>
              <thead>
                <tr>
                  <th>Jenis</th>
                  <th>Brand</th>
                  <th>Type</th>
                  <th>Harga</th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="(item, index) in components" :key="item.id">
                  <td>
                    {{ item.component_name }}
                  </td>

                  <td>
                    <v-autocomplete
                      v-model="form[index].brand_component_id"
                      :items="item.brands"
                      item-text="brand_component_name"
                      item-value="id"
                      outlined
                      dense
                      hide-selected
                      :rules="formRules"
                    ></v-autocomplete>
                  </td>

                  <td>
                    <v-text-field
                      v-model="form[index].component_type"
                      outlined
                      dense
                      :rules="formRules"
                    ></v-text-field>
                  </td>

                  <td class="text-right font-weight-black">1</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-form>
      </v-container>

      <v-card-actions>
        <v-btn
          block
          color="primary"
          :loading="loading"
          :disabled="!valid"
          @click="store"
          v-if="components.length > 0"
        >
          <v-icon left>mdi-content-save</v-icon>
          save
        </v-btn>
      </v-card-actions>
    </div>

    <div v-else>
      <v-simple-table dense>
        <template v-slot:default>
          <thead>
            <tr>
              <th>ID</th>
              <th>Jenis</th>
              <th>Brand</th>
              <th>Type</th>
              <th class="text-right">Harga</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="item in unit.components" :key="item.id">
              <td>K{{ item.id }}</td>

              <td>
                {{ item.component_name }}
              </td>

              <td>
                {{ item.brand_component_name }}
              </td>

              <td>
                {{ item.component_type }}
              </td>

              <td class="text-right font-weight-black">
                {{ Number(item.component_price).toLocaleString("id-ID") }}
              </td>

              <td>
                <v-btn
                  icon
                  @click="changeComponent(item)"
                  v-if="unit.room_id == 1"
                >
                  <v-icon color="error">mdi-close-circle</v-icon>
                </v-btn>
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </div>
  </v-card>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "FormComponent",
  props: ["unit"],
  data: () => ({
    valid: true,
    form: [],
    formRules: [(v) => !!v || "Field is required"],
    components: [],
    brands: [],
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
    async getComponent() {
      await this.axios
        .get("setup-asset/v1/component", {
          headers: {
            Authorization: "Bearer " + this.access_token,
          },
          params: {
            unit_id: this.unit.unit_id,
          },
        })
        .then((response) => {
          let { data } = response.data;
          this.components = data;
          this.components.forEach((item) => {
            this.form.push({
              component_id: item.id,
              brand_component_id: "",
              component_type: "",
            });
          });
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
        formData.set("unit_id", this.unit.id);
        formData.set("component_date", this.unit.unit_date);
        formData.set("room_id", this.unit.room_id);
        formData.set("items", JSON.stringify(this.form));

        await this.axios
          .post("list-asset/v1/store-unit-component", formData, {
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
            this.$parent.$refs.default.getDefault();
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
    async changeComponent(item) {
      let r = window.confirm("apakah anda akan mengganti komponen ini?");

      if (r) {
        this.$parent.$refs.maintenance.form.mt_type = "GANTI";
        this.$parent.$refs.maintenance.ganti = true;
        this.$parent.$refs.maintenance.dialogMt = true;
        this.$parent.$refs.maintenance.changeComponent(item);
        this.$parent.$refs.maintenance.readonly = true;
      }
    },
  },
  async created() {
    if (this.unit.components.length == 0) {
      await this.getComponent();
    }
  },
};
</script>

<style>
</style>