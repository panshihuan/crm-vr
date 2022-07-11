import requestCustom from '@/utils/requestCustom'
import request from '@/utils/request';
import host from './host'

export const uploadUrl = '/actualize.vrcore/fileUpload'

export function uploadFile(data, url) {
  return request({
    url,
    method: 'post',
    data
  })
}


// *****************************  场景组相关  ******************

// 【场景组】 根据机构获取场景组列表
export function getVrSceneGroup(params) {
  return request({
    url: '/actualize.vrcore/getVrSceneGroup',
    method: 'get',
    params
  })
}
// 【场景组】 编辑场景组内容
export function editVrSceneGroup(params) {
  return request({
    url: '/actualize.vrcore/editVrSceneGroup',
    method: 'get',
    params
  })
}
// 【场景组】 获取场景组未选择的场景列表
export function getPickVrSceneList(params) {
  return request({
    url: '/actualize.vrcore/getPickVrSceneList',
    method: 'get',
    params
  })
}
// 【场景组】 获取场景组对应的场景列表
export function getVrSceneGroupList(params) {
  return request({
    url: '/actualize.vrcore/getVrSceneGroupList',
    method: 'get',
    params
  })
}
// 【场景组】 批量排序场景组对应的场景
export function sortVrSceneGroup(params) {
  return request({
    url: '/actualize.vrcore/sortVrSceneGroup',
    method: 'get',
    params
  })
}
// 【场景组】 绑定一个或者多个场景
export function attachVrScene(data) {
  console.log(3333, data)
  return request({
    url: '/actualize.vrcore/attachVrScene',
    method: 'post',
    data
  })
}
// 【场景组】 解绑一个或者多个场景
export function detachVrScene(data) {
  return request({
    url: '/actualize.vrcore/detachVrScene',
    method: 'post',
    data
  })
}
// 【VR场景】VR场景编辑
export function editVRcore(data) {
  return request({
    url: '/actualize.vrcore/editVRcore',
    method: 'post',
    data
  })
}
// 【配置】 编辑机构vr配置信息
export function editOrgVrConfig(data) {
  return request({
    url: '/actualize.vrcore/editOrgVrConfig',
    method: 'post',
    data
  })
}
// 【配置】 获取机构vr的配置信息
export function getOrgVrConfig(params) {
  return request({
    url: '/actualize.vrcore/getOrgVrConfig',
    method: 'get',
    params
  })
}


// *********************************************  VR场景 *********************************************
// 【VR】 获取如视的VR空间数据
export function getVrById(params) {
  return request({
    url: '/actualize.vrcore/getVrById',
    method: 'get',
    params
  })
}
// 【VR】 获取如视的VR户型图数据
export function getVrFloorPlanById(params) {
  return request({
    url: '/actualize.vrcore/getVrFloorPlanById',
    method: 'get',
    params
  })
}
// 【场景内容】获取场景内容
export function getVrSceneContentList(params) {
  return request({
    url: '/actualize.vrcore/getVrSceneContentList',
    method: 'get',
    params
  })
}
// 【场景内容】编辑场景内容
export function editVrSceneContent(data) {
  return request({
    url: '/actualize.vrcore/editVrSceneContent',
    method: 'post',
    data
  })
}
// 【场景内容】移除场景内容
export function delVrSceneContent(data) {
  return request({
    url: '/actualize.vrcore/delVrSceneContent',
    method: 'post',
    data
  })
}

// 【场景标签】获取场景标签列表
export function getVrSceneTagList(params) {
  return request({
    url: '/actualize.vrcore/getVrSceneTagList',
    method: 'get',
    params
  })
}
// 【场景标签】编辑场景标签
export function editVrSceneTag(data) {
  return request({
    url: '/actualize.vrcore/editVrSceneTag',
    method: 'post',
    data
  })
}
// 【场景标签】移除场景标签
export function delVrSceneTag(data) {
  return request({
    url: '/actualize.vrcore/delVrSceneTag',
    method: 'post',
    data
  })
}

// 【自动导览】保存导览列表
export function editVrSceneNavigate(data) {
  return request({
    url: '/actualize.vrcore/editVrSceneNavigate',
    method: 'post',
    data
  })
}
// 【自动导览】获取导览列表
export function getVrSceneNavigateList(params) {
  return request({
    url: '/actualize.vrcore/getVrSceneNavigateList',
    method: 'get',
    params
  })
}
// 【点位】获取点位列表
export function getVrScenePointList(params) {
  return request({
    url: '/actualize.vrcore/getVrScenePointList',
    method: 'get',
    params
  })
}
// 【点位】保存点位
export function editVrScenePoint(data) {
  return request({
    url: '/actualize.vrcore/editVrScenePoint',
    method: 'post',
    data
  })
}
// 【点位】移除点位
export function delVrScenePoint(data) {
  return request({
    url: '/actualize.vrcore/delVrScenePoint',
    method: 'post',
    data
  })
}

// 【通道】编辑通道
export function editVrSceneChannel(data) {
  return request({
    url: '/actualize.vrcore/editVrSceneChannel',
    method: 'post',
    data
  })
}
// 【通道】删除通道
export function delVrSceneChannel(data) {
  return request({
    url: '/actualize.vrcore/delVrSceneChannel',
    method: 'post',
    data
  })
}
// 【自动导览】发布导览
export function releaseVrSceneNavigate(data) {
  return request({
    url: '/actualize.vrcore/releaseVrSceneNavigate',
    method: 'post',
    data
  })
}
// 【通道】获取通道
export function getVrSceneChannelList(params) {
  return request({
    url: '/actualize.vrcore/getVrSceneChannelList',
    method: 'get',
    params
  })
}
// 【场景】 校对场景楼层
export function fixVrSceneGroupFloorIndex(data) {
  return request({
    url: '/actualize.vrcore/fixVrSceneGroupFloorIndex',
    method: 'post',
    data
  })
}
// 【场景】 获取场景基本信息
export function getVrScene(params) {
  return request({
    url: '/actualize.vrcore/getVrScene',
    method: 'get',
    params
  })
}
// 【配置】 编辑场景组对应下的场景信息
export function editVrSceneGroupInfo(data) {
  return request({
    url: '/actualize.vrcore/editVrSceneGroupInfo',
    method: 'post',
    data
  })
}
// 【菜单】初始化系统菜单
export function initGroupMenu(params) {
  return request({
    url: '/actualize.vrcore/initGroupMenu',
    method: 'get',
    params
  })
}
// 【菜单】根据场景组获取菜单的集合
export function getVrGroupMenuList(params) {
  return request({
    url: '/actualize.vrcore/getVrGroupMenuList',
    method: 'get',
    params
  })
}
// 【菜单】编辑菜单
export function editVrGroupMenu(data) {
  return request({
    url: '/actualize.vrcore/editVrGroupMenu',
    method: 'post',
    data
  })
}
// 【菜单】编辑单个菜单
export function editVrGroupMenuInfo(data) {
  return request({
    url: '/actualize.vrcore/editVrGroupMenuInfo',
    method: 'post',
    data
  })
}
// 【菜单】关联内容
export function attachVrGroupMenuContent(data) {
  return request({
    url: '/actualize.vrcore/attachVrGroupMenuContent',
    method: 'post',
    data
  })
}
// 【菜单】删除自定义菜单
export function delVrGroupMenu(data) {
  return request({
    url: '/actualize.vrcore/delVrGroupMenu',
    method: 'post',
    data
  })
}
// 【场景组】 批量排序内容
export function sortVrSceneContent(data) {
  return request({
    url: '/actualize.vrcore/sortVrSceneContent',
    method: 'post',
    data
  })
}
// 【资源组】获取资源组列表
export function getResourceGroups(params) {
  return request({
    url: '/actualize.Resourcegroup/getResourceGroupsInVr',
    method: 'get',
    params
  })
}


// *******************************************  前端接口 ********************************************
// 获取workjson
export function GET_WORK_BY_CODE(params) {
  return requestCustom(host.ar)({
    url: '/vrapi/vr/getVrById',
    method: 'get',
    params
  })
}
// 获取标签数据
export function GET_TAGLIST_BY_CODE(params) {
  return requestCustom(host.ar)({
    url: '/vrapi/vr/getVrTagListById',
    method: 'get',
    params
  })
}
// 获取空间列表
export function GET_LIST_BY_INSID(params) {
  return requestCustom(host.ar)({
    url: '/vrapi/vr/getVrListByInstanceId',
    method: 'get',
    params
  })
}
// 获取户型图数据
export function GET_FLOORPLAN_BY_CODE(params) {
  return requestCustom(host.ar)({
    url: '/vrapi/vr/getVrFloorPlanById',
    method: 'get',
    params
  })
}

