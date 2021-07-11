export enum SOCKET_EVENT_TYPE {
  NEW_MESSAGE = 'NEW_MESSAGE', // 新消息
  ADD_USER = 'ADD_USER', // 新加入
  DISCONNECT = 'DISCONNECT', // 断开连接，退出房间
  USER_JOIN = 'USER_JOIN', // 有用户加入
  USER_LEFT = 'USER_LEFT', // 有用户退出
}

export default SOCKET_EVENT_TYPE;
