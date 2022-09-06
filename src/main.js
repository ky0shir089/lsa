import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import './plugins/helper'
import OneSignal from "onesignal-vue";

Vue.config.productionTip = false

Vue.use(OneSignal);

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App),
  beforeMount() {
    this.$OneSignal.init({
      appId: "7551e8ef-9d84-4cce-898a-ea9f1fc6268e",
      allowLocalhostAsSecureOrigin: true,
    });
  },
}).$mount('#app')
