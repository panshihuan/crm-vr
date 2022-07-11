import { getEnumCommon, getNotify, getDynamicList, getCrmEnum } from '@/api/common'

const state = {
  enumAll: null, // 所有枚举
  enumDynamicAll: null, // 所有枚举(动态枚举)
  routerParams: null, // 传值操作
  notifyList: null, // 通知消息
  notifyTotal: null, // 通知消息数量(订单、审核)
  notifyTotalAll: null, // 通知消息数量(总数)
  notifyTotalBidding: null, // 通知消息数量(招投标数量)
  visiEnumList: null, // 招标枚举
}

const mutations = {
  SET_ENUM: (state, list) => {
    state.enumAll = list
  },
  SET_ENUM_DYNAMIC: (state, list) => {
    state.enumDynamicAll = list
  },
  SET_PARAMS: (state, list) => {
    state.routerParams = list
  },
  SET_CLEAR__PARAMS: (state) => {
    state.routerParams = null
  },
  SET_NOTIFY_LIST: (state, list) => {
    state.notifyList = list
  },
  SET_NOTIFY_TOTAL: (state, list) => {
    state.notifyTotal = list
  },
  SET_NOTIFY_TOTAL_BIDDING: (state, list) => {
    state.notifyTotalBidding = list
  },
  SET_NOTIFY_TOTAL_ALL: (state, list) => {
    state.notifyTotalAll = list
  },
  SET_VISI_ENUM: (state, list) => {
    state.visiEnumList = list
  },
}

const actions = {
  getEnumCommon({ commit, state }) {
    if (state.enumOrg) {
      return
    }
    return getEnumCommon().then(res => {
      commit('SET_ENUM', res)
    })
  },
  getEnumDynamicCommon({ commit, state }) {
    if (state.enumDynamicAll) {
      return
    }
    return getDynamicList().then(res => {
      commit('SET_ENUM_DYNAMIC', res)
    })
  },
  getEnumVisi({ commit, state }) {
    if (state.visiEnumList) {
      return
    }
    return getCrmEnum({ module_name: 'bid' }).then(res => {
      commit('SET_VISI_ENUM', res)
    })
  },
  setParams({ commit }, params) {
    commit('SET_PARAMS', params)
  },
  clearParams({ commit }) {
    commit('SET_CLEAR__PARAMS')
  },
  getNotifyList({ commit }, params) {
    return getNotify(params).then(res => {
      const total = res.msgTypeList.reduce((pre, cur) => pre += (cur.type ==3 || cur.type ==4 || cur.type ==8 || cur.type ==20 || cur.type ==40 || cur.type ==9) && cur.count, 0)
      const totalBidding = res.msgTypeList.reduce((pre, cur) => pre += (cur.type ==30 || cur.type ==31) && cur.count, 0)
      const totalAll = res.total
      commit('SET_NOTIFY_LIST', res)
      commit('SET_NOTIFY_TOTAL', total)
      commit('SET_NOTIFY_TOTAL_ALL', totalAll)
      commit('SET_NOTIFY_TOTAL_BIDDING', totalBidding)
    })
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
