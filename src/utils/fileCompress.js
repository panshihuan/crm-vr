

//当图片宽度大于300时 进行等比例压缩，并返回Blob，否则返回false
export const compress = (fileObj, callback, {size=300, isCompress=true}={}) => {
    function dataURLtoBlob(dataurl) {//base64格式图片 转为Blob  
        var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime });
    }
    if (!isCompress) {
        callback(fileObj)
        return
    }
    if (typeof (FileReader) === 'undefined') {
        console.log("当前浏览器内核不支持base64图标压缩");
        return false;
    } else {
        try {
            var reader = new FileReader();
            var image = new Image();
            reader.readAsDataURL(fileObj);//开始读取指定的Blob中的内容。返回base64
            reader.onload = function (ev) {
                image.src = ev.target.result;
                image.onload = function () {
                    var imgWidth = this.width,
                        imgHeight = this.height; //获取图片宽高
                    if (imgWidth > size) {//设置图片的最大宽度为300
                        imgWidth = size;
                        imgHeight = size / this.width * imgHeight;//设置等比例高度
                        var canvas = document.createElement('canvas');
                        var ctx = canvas.getContext('2d');
                        canvas.width = imgWidth;
                        canvas.height = imgHeight;
                        ctx.drawImage(this, 0, 0, imgWidth, imgHeight);//根据宽高绘制图片
                        var fullQuality = canvas.toDataURL("image/png", 1.0);//canvas转为base64
                        var blogData=dataURLtoBlob(fullQuality);
                        let file = new window.File([blogData], fileObj.name, {type: fileObj.type})
                        callback(file);
                    }else{
                        callback(fileObj);
                    }
                }
            }
        } catch (e) {
            console.log("压缩失败!");
        }
    }
}
