var http = require("http");
var fs = require("fs");
var url = require("url");

//获取输入的端口
var port = process.argv[2];
if (!port) {
  console.log("请指定端口例如: node server.js 8888");
  process.exit(1);
}

// 读取文件目录
fs.readdir('./public/img', (err, files) => {
  if (err) {
    return console.log('目录不存在')
  }
  console.log(files);   //['功能.jpg','垃圾屋.jpg','投喂.jpg']

  //根据文件名,拼接标签
  let htmlStr = ''
  for (let i = 0; i < files.length; i++) {
    htmlStr += `
    <details>
        <summary>${files[i].split('.')[0]}</summary>
        <img src="./img/${files[i]}" alt="" width="100%">
    </details>
  `
  }

  // 创建http服务+注册请求事件 (拿到请求,返回响应)
  let server = http.createServer((request, response) => {
    // console.log(request.headers);      //请求头
    // console.log(request.method);       //请求方式
    // console.log(request.url)           //"http:/域名:8888/xx.html?a=b"

    // 地址==>对象, 顺便解码中文
    var parsedUrl = url.parse(decodeURI(request.url), true);
    // console.log(parsedUrl.href);       //"http:/域名:8888/xx.html?a=b"
    // console.log(parsedUrl.path);       //"/xx.html?a=b"
    // console.log(parsedUrl.pathname);   //"/xx.html"
    // console.log(parsedUrl.query);      //{a:b}

    // ----------------------------------------------------------------------
    console.log('接收到请求地址: ' + parsedUrl.href);

    //如果没有路径名, 则进入首页
    if (parsedUrl.pathname === "/") {
      parsedUrl.pathname = "/index.html"
    }
    //读取文件后缀 (html/css/js)
    let suffix = parsedUrl.pathname.replace(/.*\./, "");
    //支持的后缀类型
    let ContentTypes = {
      html: "text/html",
      css: "text/css",
      js: "text/javascript",
      png: "image/png",
      jpg: "image/jpeg",
    };
    //设置响应体格式 (没支持的后缀用text/html兜底)
    response.setHeader("Content-Type", `${ContentTypes[suffix] || "text/html"};charset=utf-8`);

    //读取文件
    let content;
    try {
      if (parsedUrl.pathname === '/index.html') {
        content = fs.readFileSync(`public${parsedUrl.pathname}`).toString();
        content = content.replace('{{n}}', htmlStr)
      } else {
        content = fs.readFileSync(`public${parsedUrl.pathname}`);
      }
    } catch (error) {
      response.statusCode = 404;
      content = "文件不存在";
    }
    response.statusCode = 200;
    //设置响应体, 并响应
    response.end(content);
  })

  //监听端口, 启动服务
  server.listen(port)
  console.log(`\n服务启动成功, 请打开http://localhost:${port}`);
})