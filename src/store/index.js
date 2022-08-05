import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersist from 'vuex-persist'
import alert from '@/store/alert'
import auth from '@/store/auth'
import token from '@/store/token'
import nav from '@/store/nav'
import draftPo from '@/store/draftPo'

const vuexPersist = new VuexPersist({
  key: 'lsa',
  storage: sessionStorage
})

Vue.use(Vuex)

export default new Vuex.Store({
  plugins: [vuexPersist.plugin],
  state: {
    prevUrl: '',
  },
  mutations: {
    setPrevUrl: (state, value) => {
      state.prevUrl = value
    },
  },
  actions: {
    setPrevUrl: ({ commit }, value) => {
      commit('setPrevUrl', value)
    },
  },
  getters: {
    prevUrl: state => state.prevUrl,
  },
  modules: {
    alert,
    auth,
    token,
    nav,
    draftPo
  }
})
