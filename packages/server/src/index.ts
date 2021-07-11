import Koa from 'koa';
import { Server } from 'socket.io';
import { port } from './config';
import { v4 as uuid } from 'uuid';
import { SOCKET_EVENT_TYPE, BaseMessage, Message, UserMessage } from '@chatroom/helper';

const app = new Koa();
const server = require('http').createServer(app);
const io = new Server(server);

io.on('connection', (socket) => {
  console.log('connection');
  let currentUserAdded = false;
  const currentUserInfo = {
    username: '',
    userId: '',
  };

  // 监听当前用户加入
  socket.on(SOCKET_EVENT_TYPE['ADD_USER'], (username: string) => {
    if (currentUserAdded) return;

    currentUserInfo.username = username;
    currentUserInfo.userId = uuid();

    currentUserAdded = true;

    // 派发用户加入
    socket.broadcast.emit(SOCKET_EVENT_TYPE['USER_JOIN'], {
      id: uuid(),
      ...currentUserInfo,
    } as UserMessage);
  });

  // 处理新消息
  socket.on(SOCKET_EVENT_TYPE['NEW_MESSAGE'], (data: BaseMessage) => {
    // 广播发送新消息
    socket.broadcast.emit(SOCKET_EVENT_TYPE['NEW_MESSAGE'], {
      id: uuid(),
      content: data.content,
      type: data.type,
      ...currentUserInfo,
    } as Message);
  });

  socket.on(SOCKET_EVENT_TYPE['DISCONNECT'], () => {
    if (currentUserAdded) {
      socket.broadcast.emit(SOCKET_EVENT_TYPE['USER_LEFT'], {
        id: uuid(),
        ...currentUserInfo,
      } as UserMessage);
    }
  });
});

server.listen(port, () => {
  console.log(`server 启动在 http://localhost:${port}/`);
});
