import { getVrGroupMenuList } from '@/api/fiveVR'
import { flatFunc } from '@/utils/sortList'

const state = {
  menuList: []
}

const mutations = {
  SET_MENU: (state, list) => {
    state.menuList = flatFunc(list, 'children')
  }
}

const actions = {
  getVrGroupMenuList({ commit, state }, params) {
    return new Promise((resolve, reject) => {
      getVrGroupMenuList(params).then(response => {
        const menuList = [{id: '', name: '(空)'}, ...response]
        commit('SET_MENU', menuList)
        resolve(menuList)
      }).catch((error) => {
        reject(error)
      })
    })
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
