import Koa from 'koa';
import { Server } from 'socket.io';
import { port, clientOrigin } from './config';
import { v4 as uuid } from 'uuid';
import {
  SOCKET_EVENT_TYPE,
  BaseMessage,
  WSMessage,
  UserMessage,
} from '@chatroom/helper';
import { generateRandomAvatar } from '../src/helper';

const app = new Koa();
const server = require('http').createServer(app);
const io = new Server(server, {
  cors: {
    origin: clientOrigin,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

io.on('connection', (socket) => {
  let currentUserAdded = false;
  const currentUserInfo = {
    username: '',
    userId: '',
    avatar: '',
  };

  // 监听当前用户加入
  socket.on(SOCKET_EVENT_TYPE.LOGIN_CLIENT, (username: string) => {
    if (currentUserAdded) return;

    currentUserInfo.username = username;
    currentUserInfo.userId = uuid();
    currentUserInfo.avatar = generateRandomAvatar();

    currentUserAdded = true

    socket.emit(SOCKET_EVENT_TYPE.LOGIN_SERVER, {
      id: uuid(),
      ...currentUserInfo,
    } as UserMessage);

    // 派发用户加入
    socket.broadcast.emit(SOCKET_EVENT_TYPE.USER_JOIN, {
      id: uuid(),
      ...currentUserInfo,
    } as UserMessage);
  });

  // 处理新消息
  socket.on(SOCKET_EVENT_TYPE.NEW_MESSAGE, (data: BaseMessage) => {
    // 广播发送新消息
    socket.broadcast.emit(SOCKET_EVENT_TYPE.NEW_MESSAGE, {
      id: uuid(),
      content: data.content,
      type: data.type,
      ...currentUserInfo,
    } as WSMessage);
  });

  socket.on(SOCKET_EVENT_TYPE.DISCONNECT, () => {
    if (currentUserAdded) {
      socket.broadcast.emit(SOCKET_EVENT_TYPE.USER_LEFT, {
        id: uuid(),
        ...currentUserInfo,
      } as UserMessage);
    }
  });
});

server.listen(port, () => {
  console.log(`@chatroom/server 启动在 http://localhost:${port}/`);
});
