/* 方法 */
module.exports = {
  /* 随机字符串 */
  createNonceStr: function() {
    return Math.random().toString(36).substr(2,15)
  },
  /* 获取时间戳 */
  createTimestamp: function(){
    return parseInt(new Date().getTime()/1000) + '';
  },
  /* 排序拼接
  *  toLowerCase() 把字符串转为小写
  */
  raw: function(args) {
    var keys = Object.keys(args);
    keys = keys.sort()
    var newArgs = {};
    keys.forEach(function (key) {
      newArgs[key.toLowerCase()] = args[key];
    });
    var string = '';
    for(var k in newArgs){
      string += '&' + k + '=' + newArgs[k];
    }
    string = string.substr(1);
    return string;
  },
  /* 签名计算方法 */
  sign: function(jsapi_ticket, url){
    var ret = {
      jsapi_ticket:jsapi_ticket,
      nonceStr:this.createNonceStr(),
      timestamp: this.createTimestamp(),
      url:url
    }
    var string = this.raw(ret);
    jsSHA = jsSHA = require("jssha");
    shaObj = new jsSHA(string, 'TEXT');
    ret.signature = shaObj.getHash('SHA-1', 'HEX');
    return ret;
  }
}