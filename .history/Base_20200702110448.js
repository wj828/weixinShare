var request = require('request');
var until = require('./until')
module.exports= {
  wxconfig: function(req,res,next){
    if(!global.wxshare){
      global.wxshare = {}
    }
    // 检查页面链接对应的签名是否可用
    var signtag = false;
    var signindex;
    // 检查签名
    if(global.wxshare.signs){
      global.wxshare.signs.forEach(function(item, index){
        if(item.url === req.body.url){
          signindex = index;
          if (item.deadline && new Date().getTime() - item.deadline < 6000000) {
            signtag = true;
          }
        }
      })
    }else{
      global.wxshare.signs = [];
    }
  
    //当签名不可用时，检测jsapi_ticket是否可用，来决定是直接请求签名还是先请求jsapi_ticket再请求签名
    
    var appID = "你的appID";
    var appSecret = "1bd651eebf61697df35c2fcad8c3b111";
    var tokenUrl = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid='+appID+'&secret='+appSecret;
    request(tokenUrl, function (error, response, body) {
      console.log(response)
      if (response.statusCode === 200) {
        body = JSON.parse(body); 
        // 这里我缓存到了global
        global.wxshare.access_token = body.access_token;
        // 获取jsapi_ticket
        var ticketUrl = 'https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=' + body.access_token + '&type=jsapi';
        request(ticketUrl, function (err, response, content) {
          content = JSON.parse(content);
          if (content.errcode == 0) {
            // 这里我缓存到了global
            // res.send(content.ticket)
            global.wxshare.jsapi_ticket = content.ticket;
            // 计算signature
            // 获取事件戳
            global.wxshare.deadline = new Date().getTime();
            // 通过调用计算签名方法
            var signatureStr = until.sign(content.ticket, req.body.url); 
            signatureStr.deadline = new Date().getTime();
            // 缓存签名
            if(signindex && signindex !==0){
              global.wxshare.signs.splice(signindex, 1 ,signatureStr)
            }else {
              global.wxshare.signs.push(signatureStr)
            }
            res.status(200).json(signatureStr);
          }
        })
      }
    })
  },
  checkWx: function(req, res){
    res.send('Re09yKUQYwCBoUx7');
  }
}
