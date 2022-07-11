import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function login2(params) {
  return request({
    url: '/login/login2',
    method: 'get',
    params
  })
}
export function login3(params) {
  return request({
    url: '/mobilelogin/loginByCode2',
    method: 'get',
    params
  })
}
export function login4(params) {
  return request({
    url: '/mobilelogin/loginByCodeNew',
    method: 'get',
    params
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

// 获取用户信息（包括前端路由）
export function getInfo(params) {
  return request({
    url: '/user/getInfo',
    method: 'get',
    params
  })

}

// 顶部通知消息
export function getNotify(data) {
  return request({
    url: '/topnotice/notify',
    method: 'post',
    data
  })
}

//【帮助】获取列表
export function helperGetList(params) {
    return request({
      url: '/Helper/getList',
      method: 'get',
      params
    })
}

//【帮助】添加/修改帮助列表
export function helperEdit(data) {
    return request({
      url: '/Helper/edit',
      method: 'post',
      data
    })
}

//【帮助】删除帮助
export function helperDelete(data) {
    return request({
      url: '/Helper/delete',
      method: 'post',
      data
    })
}

//【帮助】获取业务支撑负责人
export function getBusinessList(params) {
    return request({
      url: '/helper/getBusinessList',
      method: 'get',
      params
    })
}

//【帮助】 删除业务支撑
export function deleteBusiness(data) {
    return request({
      url: '/helper/deleteBusiness',
      method: 'post',
      data
    })
}

//【帮助】编辑业务支撑负责人
export function editBusiness(data) {
    return request({
      url: '/helper/editBusiness',
      method: 'post',
      data
    })
}

// 【VR】 获取如视的VR空间数据
export function getVrById(params) {
  return request({
    url: '/actualize.vrcore/getVrById',
    method: 'get',
    params
  })
}
