export default {
  namespaced: true,
  state: {
    draftPo: {},
  },
  mutations: {
    set: (state, payload) => {
      state.draftPo = payload
    },
  },
  actions: {
    set: ({ commit }, payload) => {
      commit('set', payload)
    },
  },
  getters: {
    draftPo: state => state.draftPo,
  }
}