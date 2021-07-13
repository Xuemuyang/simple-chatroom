export enum SOCKET_EVENT_TYPE {
  NEW_MESSAGE = 'NEW_MESSAGE', // 新消息
  LOGIN_CLIENT = 'LOGIN_CLIENT', // 新加入
  LOGIN_SERVER = 'LOGIN_SERVER', // 新加入
  LOGOUT = 'LOGOUT', // 用户注销
  DISCONNECT = 'disconnect', // 断开连接，退出房间
  USER_JOIN = 'USER_JOIN', // 有用户加入
  USER_LEFT = 'USER_LEFT', // 有用户退出
}

export default SOCKET_EVENT_TYPE;
