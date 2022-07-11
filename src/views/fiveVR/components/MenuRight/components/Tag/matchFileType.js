export const matchType = (fileName) => {
    // 后缀获取
    var suffix = '';
    // 获取类型结果
    var result = '';
    try {
      var flieArr = fileName.split('.');
      suffix = flieArr[flieArr.length - 1];
    } catch (err) {
      suffix = '';
    }
    // fileName无后缀返回 false
    if (!suffix) {
      result = false;
      return result;
    }
    // 图片格式
    var imglist = ['png', 'jpg', 'jpeg', 'bmp', 'gif'];
    // 进行图片匹配
    result = imglist.some(function (item) {
      return item == suffix;
    });
    if (result) {
      result = 'image';
      return result;
    }
    return 'video'
}