/* 
* @Author: fys
* @Date:   2016-09-18 11:19:35
* @Last Modified time: 2016-09-18 15:12:31
*/

var socket = require('socket.io'),
    guestNumber = 1,
    nickNames = {},
    namesUsed = [],
    currentRoom = {},
    io;


/* 启动Socket.IO服务器 */
exports.listen = function(server) {

  // 启动Socket.IO 服务器，允许它搭载在已有的HTTP服务器上
  io = socketio.listen(server)
  io.set('log level', 1)

  // 定义每个用户连接的处理逻辑
  io.sockets.on('connection', function(socket) {

    // 在用户连接上来时赋予其一个访客名
    guestNumber = assignGuestName(socket, guestNumber, nickNames, namesUsed)

    // 在用户连接上时把他放入聊天室Lobby里
    joinRoom(socket, 'Lobby')

    // 处理用户的消息，更名，以及聊天室的创建和变更
    handleMessageBroadcasting(socket, nickNames)
    handleNameChangeAttempts(socket, nickNames, namesUsed)
    handleRoomJoining(socket)

    socket.on('rooms', function() {

      // 用户发出请求时，向其提供已经被占用的聊天室的列表
      socket.emit('rooms', io.sockets.manager.rooms)
    })


    // 定义用户断开连接后的清除逻辑
    handleClientDisconnection(socket, nickNames, nameUsed)

  })
}

/* 分配用户昵称 */
function assignGuestName(socket, guestNumber, nickNames, namesUsed) {

  // 生成新昵称
  var name = 'Guest' + guestNumber;
  // 把用户昵称跟客户端连接ID关联上
  nickNames[socket.id] = name;

  // 让永固知道他们的昵称
  socket.emit('nameResult', {
    success: true,
    name: name
  })

  // 存放已经存在的昵称
  namesUsed.push(name)
  // 增加用来生成昵称的计数器
  return guestNumber + 1
}

/* 进入聊天室的相关逻辑 */
function joinRoom(socket, room) {

  // 让用户进入房间
  socket.join(room)

  // 记录用户的当前房间
  currentRoom[socket.id] = room

  socket.emit('joinResult', {room: room})

  // 让房间里的其他用户知道有新用户进入了房间
  socket.broadcast.to(room).emit('message', {
    text: nickNames[socket.id] + ' has joined ' + room + '.'
  })

  // 确定有哪些用户在这个房间里
  var usersInRoom = io.sockets.clients(room)

  // 如果不止一个用户在这个房间里，汇总下都是谁
  if (usersInRoom.length > 1) {
    var usersInRoomSummary = 'Users Currently in ' + room + ': ';

    for(var index in usersInRoom) {
      var userSocketId = usersInRoom[index].id;
      if (userSocketId !== socket.id) {
        if (index > 0) {
          usersInRoomSummary += ', ';
        }
        usersInRoomSummary += nickNames[userSocketId];
      }
    }
    usersInRoomSummary += '.';
    // 将房间里其他用户的汇总发送给这个用户
    socket.emit('message', {text: usersInRoomSummary});
  }
}
