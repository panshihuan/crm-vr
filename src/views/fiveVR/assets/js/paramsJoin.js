export default (obj) => {
    let r = '';
    if (!obj || Object.keys(obj).length <= 0) {
      return '';
    }
    function encode(str) {
      let replace = {
        '!': '%21',
        "'": '%27',
        '(': '%28',
        ')': '%29',
        '~': '%7E',
        '%20': '+',
        '%00': '\x00'
      };
      return encodeURIComponent(str).replace(/[!'\(\)~]|%20|%00/g, function (match){
        return replace[match];
      });
    }
    return Object.keys(obj).map((key) => {
      return `key=${encode(obj[key])}`
    }).join('&')
  }