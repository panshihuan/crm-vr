var bookancrm = {};
bookancrm.os = {};
bookancrm.os.isIOS = /iOS|iPhone|iPad|iPod/i.test(navigator.userAgent);
bookancrm.os.isAndroid = !bookancrm.os.isIOS;
bookancrm.genCallbackName = function(){
    return "bookancrm_callback_" + (new Date()).getTime() + "_" + Math.floor(Math.random() * 10000);
};
bookancrm.callbacks = {};
bookancrm.addCallback = function(name,func,userdata){
    delete bookancrm.callbacks[name];
    bookancrm.callbacks[name] = {callback:func,userdata:userdata};
};

bookancrm.callback = function(result){
    var callbackObject = bookancrm.callbacks[result.callback_name];
    if (callbackObject !== undefined){
        if (callbackObject.userdata !== undefined){
            callbackObject.userdata.callbackData = result;
        }
        if(callbackObject.callback != undefined){
            var ret = callbackObject.callback(result.result);
            if(ret === false){
                return
            }
            delete bookancrm.callbacks[result.callback_name];
        }
    }
};

bookancrm.post = function(cmd,para){
    if(bookancrm.os.isIOS){
        var message = {};
        message.meta = {
            cmd:cmd
        };
        message.para = para || {};
        window.jsBridge && window.jsBridge.invoke(message);
    }else if(window.bookancrm.os.isAndroid){
        window.jsBridge && window.jsBridge.invoke(cmd,JSON.stringify(para));
    }
};
bookancrm.postWithCallback = function(cmd,para,callback,ud){
    var callback_name = bookancrm.genCallbackName();
    bookancrm.addCallback(callback_name,callback,ud);
    if(bookancrm.os.isIOS){
        var message = {};
        message.meta  = {
            cmd:cmd,
            callback:callback_name
        };
        message.para = para;
        window.jsBridge && window.jsBridge.invoke(message);
    }else if(window.bookancrm.os.isAndroid){
        para.callback_name = callback_name;
        window.jsBridge && window.jsBridge.invoke(cmd,JSON.stringify(para));
    }
};
bookancrm.dispatchEvent = function(para){
    if (!para) {
        para = {"name":"webviewLoadComplete"};
    }
    var evt = {};
    try {
        evt = new Event(para.name);
        evt.para = para.para;
    } catch(e) {
        evt = document.createEvent("HTMLEvents");
        evt.initEvent(para.name, false, false);
    }
    window.dispatchEvent(evt);
};
bookancrm.addEventListener = window.addEventListener;

bookancrm.stringify = function(obj){
    var type = typeof obj;
    if (type == "object"){
        return JSON.stringify(obj);
    }else {
        return obj;
    }
};

window.bookancrm = bookancrm;
