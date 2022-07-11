/** 
 * 统一内存对象缓存管理
 * GB_USER_USE_ID_MAP  用户使用记录 record_type 1 收藏，3 关注
  */
let cacheObj = {};
export default {
    get: function (key) {
      return key in cacheObj ? cacheObj[key] : null;
    },
    set: function (key, val) {
      cacheObj[key] = val;
    }
}