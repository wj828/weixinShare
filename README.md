# weixinShare
微信JS-SDK分享接口实例开发及本地测试

## 项目启动说明

## 安装依赖

npm install 

## 注意
jssha不能用npm安装，因为npm安装的运行时候会报Chosen SHA variant is not supported,必须使用官网提供的sample包，下载解压后，选择node版本，打开后将node_module里面jssha文件复制到项目内的node_module里面即可 可打开
https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/JS-SDK.html
中附录6-DEMO页面和示例代码 进行下载，也可直接点击
http://demo.open.weixin.qq.com/jssdk/sample.zip 
进行下载

## 启动

npm run dev 

## 本项目中使用了npm,每次修改接口不需要重启

## 访问地址

http://localhost:8080  或 http://localhost:8080/index.html

要是测试微信分享是否成功，请在微信开发者工具中测试，本地测试使用ngrok内网穿透，具体使用请看博客 
https://blog.csdn.net/wen_j/article/details/107026899