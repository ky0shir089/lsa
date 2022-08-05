<template>
  <v-card flat>
    <v-card-title>Default Komponen</v-card-title>

    <v-simple-table dense>
      <template v-slot:default>
        <thead>
          <tr>
            <th>ID</th>
            <th>Jenis</th>
            <th>Brand</th>
            <th>Type</th>
            <th class="text-right">Harga</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="item in defaults" :key="item.id">
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
              {{ item.component_price.toLocaleString("id-ID") }}
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
  </v-card>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "DefaultComponent",
  props: ["id"],
  data: () => ({
    defaults: [],
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
    async getDefault() {
      await this.axios
        .get("list-asset/v1/show-default/" + this.id, {
          headers: {
            Authorization: "Bearer " + this.access_token,
          },
        })
        .then((response) => {
          let { data } = response.data;
          this.defaults = data;
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
    await this.getDefault();
  },
};
</script>

<style>
</style>