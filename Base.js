var request = require('request');
var until = require('./until')
module.exports= {
  wxconfig: function(req,res,next){
    // 最初始时，global中不存在wxshare会导致报错
    if(!global.wxshare){
      global.wxshare = {}
    }
    // 检查页面链接对应的签名是否可用 默认false 不可用
    var signtag = false;
    // signindex表示签名在global.wxshare.signs中的下标位置
    var signindex; 
    // 判断是否存在global.wxshare.signs，存在检查签名,不存在则创建
    if(global.wxshare.signs){
      global.wxshare.signs.forEach(function(item, index){
        // 判断此次请求地址签名的下标
        if(item.url === req.body.url){ 
          signindex = index;
          // 当签名创建时间距离此刻小于一小时四十分钟时表示签名可用
          if (item.deadline && new Date().getTime() - item.deadline < 6000000) {
            signtag = true;
          }
        }
      })
    }else{
      global.wxshare.signs = [];
    }
    //当签名不可用时，检测jsapi_ticket是否可用，来决定是直接请求签名还是先请求jsapi_ticket再请求签名
    if (!signtag){
      // 判断jsapi_ticket是否可用,jsapi_ticket有效时间是7200秒，由于进入页面就请求避免用户停留时间过长，导致签名失败，故判断时使用7000秒，公众号平台在5分钟内，新老access_token都可用，加上原本的200秒，有8分钟的时间
      if(new Date().getTime() - global.wxshare.deadline < 7000000){
        var signatureStr = until.sign(global.wxshare.jsapi_ticket, req.body.url); 
        // 记录此签名生成的时间使用生成jsapi_ticket的时间，避免签名在临近过期的时候生成，重新请求时，不满足判断签名是否可用
        signatureStr.deadline = global.wxshare.deadline;
        // 缓存签名
        if(signindex && signindex !==0){
          global.wxshare.signs.splice(signindex, 1 ,signatureStr)
        }else {
          global.wxshare.signs.push(signatureStr)
        }
        res.status(200).json(signatureStr); 
      }else {
        var appID = "你的appID";
        var appSecret = "你的appSecret";
        var tokenUrl = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid='+appID+'&secret='+appSecret;
        request(tokenUrl, function (error, response, body) {
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
                global.wxshare.jsapi_ticket = content.ticket;
                // 计算signature
                // 获取时间戳
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

      }
    } else {
      var signatureStr = global.wxshare.signs[signindex]
      res.status(200).json(signatureStr); 
    }
  },
  checkWx: function(req, res){
    console.log(req.connection.remoteAddress)
    console.log(req.socket.remoteAddress)
    res.send("数据啦啦啦啦啦")
    // res.send('添加js安全域名时MP_verify_Re09yKUQYwCBoUx7.txt文件中的内容');
  }
}
