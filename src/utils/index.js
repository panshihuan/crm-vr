import { isArray } from "lodash";
let $math = require('mathjs');

export const copyText = (text) => {
    // 数字没有 .length 不能执行selectText 需要转化成字符串
    const textString = text.toString();
    let input = document.querySelector('#copy-input');
    if (!input) {
        input = document.createElement('input');
        input.id = "copy-input";
        input.readOnly = "readOnly";        // 防止ios聚焦触发键盘事件
        input.style.position = "absolute";
        input.style.left = "-1000px";
        input.style.zIndex = "-1000";
        document.body.appendChild(input)
    }

    input.value = textString;
    // ios必须先选中文字且不支持 input.select();
    selectText(input, 0, textString.length);
    if (document.execCommand('copy')) {
        document.execCommand('copy');
        // Toast('复制成功')
    }else {
        // Dialog({ message: text })
    }
    input.blur();

    // input自带的select()方法在苹果端无法进行选择，所以需要自己去写一个类似的方法
    // 选择文本。createTextRange(setSelectionRange)是input方法
    function selectText(textbox, startIndex, stopIndex) {
        if (textbox.createTextRange) {//ie
            const range = textbox.createTextRange();
            range.collapse(true);
            range.moveStart('character', startIndex);//起始光标
            range.moveEnd('character', stopIndex - startIndex);//结束光标
            range.select();//不兼容苹果
        } else {//firefox/chrome
            textbox.setSelectionRange(startIndex, stopIndex);
            textbox.focus();
        }
    }
}


export const os = function (){
    var ua = navigator.userAgent,
    isWindowsPhone = /(?:Windows Phone)/.test(ua),
    isSymbian = /(?:SymbianOS)/.test(ua) || isWindowsPhone,
    isAndroid = /(?:Android)/.test(ua),
    isFireFox = /(?:Firefox)/.test(ua),
    isChrome = /(?:Chrome|CriOS)/.test(ua),
    isTablet = /(?:iPad|PlayBook)/.test(ua) || (isAndroid && !/(?:Mobile)/.test(ua)) || (isFireFox && /(?:Tablet)/.test(ua)),
    isPhone = /(?:iPhone)/.test(ua) && !isTablet,
    isPc = !isPhone && !isAndroid && !isSymbian;
    return {
        isTablet: isTablet,
        isPhone: isPhone,
        isAndroid: isAndroid,
        isPc: isPc
    };
}();
// if (os.isAndroid || os.isPhone) {
//   console.log("手机")
// } else if (os.isTablet) {
//   console.log("平板")
// } else if(os.isPc) {
//   console.log("电脑")
// }


// 过滤参数的undefined和‘''
export function filterParams(params={},tansArrToString=true) {
    const keyArr = Object.keys(params);
    let newParams = {}
    keyArr.forEach(item=>{
        if( isArray(params[item])&&params[item].length ){
            if(tansArrToString){
                newParams[item] = params[item].join();
            }else{
                newParams[item] = params[item];
            }
        } else if(!isArray(params[item])&&(params[item]||`${params[item]}`==='0')){
            newParams[item] = params[item];
        }
    })
    return newParams
}

export const math = {
    add() {
      return comp('add', arguments)
    },
    subtract() {
      return comp('subtract', arguments)
    },
    multiply() {
      return comp('multiply', arguments)
    },
    divide() {
      return comp('divide', arguments)
    },
  }

  function comp(_func, args) {
    let t = $math.chain($math.bignumber(args[0]));
    for (let i=1; i<args.length; i++) {
      t = t[_func]($math.bignumber(args[i]))
    }
    // 防止超过6位使用科学计数法
    return parseFloat(t.done())
  }


  // 从枚举里面获取label
export function getLabel(enumArr=[], val) {
    const actItem = enumArr.find(item=>{
        return `${item.value}`===`${val}`
    })
    if(actItem){
        return actItem.label;
    }
    return '';
}

export function handleBlank(text){
    const el = document.createElement("a");
    document.body.appendChild(el);
    el.href = encodeURI(text);
    el.target = '_blank';
    el.click();
    document.body.removeChild(el);
}
