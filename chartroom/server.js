// 使用express框架
var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),     //引入socket.io模块并绑定到服务器
    users = [];                                   //保存所有在线用户的昵称

// 指定静态HTML文件的位置
app.use('/', express.static(__dirname + '/www'));
server.listen(process.env.PORT || 8088);

// socket部分
io.sockets.on('connection', function(socket) {
    // 昵称设置
    socket.on('login', function(nickname) {
        if (users.indexOf(nickname) > -1) {
            socket.emit('nickExisted');
        } else {
            socket.userIndex = users.length;
            socket.nickname = nickname;
            users.push(nickname);
            socket.emit('loginSuccess');

            //向所有连接到服务器的客户端发送当前登陆用户的昵称 
            io.sockets.emit('system', nickname, users.length, 'login');
        };
    });
    
    // 用户离开时
    socket.on('disconnect', function() {
        if (socket.nickname != null) {
            //将断开连接的用户从users中删除
            users.splice(socket.userIndex, 1);

            //通知除自己以外的所有人
            socket.broadcast.emit('system', socket.nickname, users.length, 'logout');
        }
    });
    
    // 发送消息
    socket.on('postMsg', function(msg, color) {
        socket.broadcast.emit('newMsg', socket.nickname, msg, color);
    });
    
    // 上传图片
    socket.on('img', function(imgData, color) {
        //通过一个newImg事件分发到除自己外的每个用户
        socket.broadcast.emit('newImg', socket.nickname, imgData, color);
    });
});