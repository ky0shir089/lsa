<template>
  <v-snackbar v-model="alert" :color="color" multi-line top>
    {{ text }}
    <template v-slot:action="{ attrs }">
      <v-btn dark icon @click="close" v-bind="attrs">
        <v-icon>mdi-close-circle</v-icon>
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "snack-bar",
  computed: {
    ...mapGetters({
      status: "alert/status",
      color: "alert/color",
      text: "alert/text",
    }),
    alert: {
      get() {
        return this.status;
      },
      set(value) {
        this.setAlert({
          status: value,
          color: "success",
          text: "",
        });
      },
    },
  },
  methods: {
    ...mapActions({
      setAlert: "alert/set",
    }),
    close() {
      this.setAlert({
        status: false,
      });
    },
  },
};
</script>