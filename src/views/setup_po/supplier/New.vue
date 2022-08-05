<template>
  <v-container fluid>
    <app-bar />

    <v-app-bar app color="primary" v-if="$vuetify.breakpoint.xs">
      <v-btn icon dark @click.stop="$router.go(-1)">
        <v-icon>mdi-arrow-left-circle</v-icon>
      </v-btn>
    </v-app-bar>

    <form-supplier />
  </v-container>
</template>

<script>
export default {
  name: "NewSupplier",
  components: {
    AppBar: () =>
      import(/* webpackChunkName: "alert" */ "@/components/AppBar.vue"),
    FormSupplier: () =>
      import(
        /* webpackChunkName: "form-supplier" */ "@/components/FormSupplier.vue"
      ),
  },
};
</script>

<style>
</style>