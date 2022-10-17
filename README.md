## 运行服务
```
node server.js 8888
```

## 脚本运行服务
- 解决断开远程连接, node自动关闭的问题
```
echo 'node server.js 8888 > log 2>&1 &' >> ./start  //创建脚本,写入命令
touch log         //创建log日志
chmod +x start    //脚本授权
./start           //执行脚本
tail log          //查看log日志后10行
```

## 关闭服务
```
netstat -ltnp     //查所有tcp协议,  端口+PID+服务名 
lsof -i:端口      //查PID (进程号/服务号)
kill -9 PID       //关闭服务
killall node      //关闭所有node服务
```
