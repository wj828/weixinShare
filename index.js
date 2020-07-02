var express = require("express");
var app = express()
var bodyParser = require('body-parser');
var Base = require('./Base')
app.use(bodyParser.json({
  limit: '50mb'
}));
app.use(bodyParser.urlencoded({
  limit: '50mb',
  extended: true
}));
app.use('/', express.static('./static'));
app.post('/signture',Base.wxconfig)
app.get('/MP_verify_Re09yKUQYwCBoUx7.txt', Base.checkWx);
app.listen(8080, function(){
  console.log("服务启动")
})