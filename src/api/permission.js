import request from '@/utils/request'

// 设置权限菜单
export function setMenu(data) {
  return request({
    url: '/permission/setMenu',
    method: 'post',
    data
  })
}

// 获取权限菜单
export function getMenu(data) {
  return request({
    url: '/permission/getMenu',
    method: 'post',
    data
  })
}

// 获取角色列表
export function getRoleList(data) {
  return request({
    url: '/permission/userRoles',
    method: 'post',
    data
  })
}

// 获取人员上下级权限定义
export function getUserTree(data) {
  return request({
    url: '/permission/getUserTree',
    method: 'post',
    data
  })
}
// 设置人员级别上下级关系
export function setUserTree(data) {
  return request({
    url: '/permission/setUserTree',
    method: 'post',
    data
  })
}
