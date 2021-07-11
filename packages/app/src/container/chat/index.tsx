import { FC, useCallback, useEffect, useReducer } from 'react';
import {
  ChatContext,
  useChatStore,
  ActionType,
  chatReducer,
  initChatState,
  Member,
} from './store';
import io, { Socket } from 'socket.io-client';
import { SERVER_URL, WSMessage, SOCKET_EVENT_TYPE, MESSAGE_TYPE } from '@chatroom/helper';

// 首先是登录的逻辑
const ChatContainer: FC = () => {
  const { state, dispatch } = useChatStore();

  // 建立 socket.io 连接
  useEffect(() => {
    if (!state.socket) {
      const socketInstance: Socket = io(SERVER_URL);
      dispatch({
        type: ActionType.INSERT_SOCKET,
        payload: socketInstance,
      });

      return () => {
        socketInstance.close();
        dispatch({ type: ActionType.RESET });
      };
    }
  }, [state.socket, dispatch]);

  // 当前用户完成登录
  const handleLoginServer = useCallback(
    (data: WSMessage) => {
      const user: Member = {
        username: data.username,
        userId: data.id,
      };

      // 本地更新 User 数据
      dispatch({
        type: ActionType.UPDATE_USER,
        payload: user,
      });
      // 进入房间，更新状态
      dispatch({
        type: ActionType.INSERT_MEMBER,
        payload: user,
      });
    },
    [dispatch],
  );

  // 接收新消息
  const handleNewMessage = useCallback((data: WSMessage) => {
    dispatch({
      type: ActionType.INSERT_MESSAGE,
      payload: {
        ...data,
        isOwner: false
      }
    })
  }, [dispatch])

  // 监听其他用户加入聊天室
  const handleUserJoin = useCallback((data: WSMessage) => {
    dispatch({
      type: ActionType.INSERT_MEMBER,
      payload: {
        userId: data.userId,
        username: data.username,
      }
    })

    // 添加系统消息，欢迎进入
    dispatch({
      type: ActionType.INSERT_MESSAGE,
      payload: {
        type: MESSAGE_TYPE.SYSTEM_NOTICE,
        // 时间戳确保唯一
        id: Date.now() + '',
        username: '',
        userId: '',
        content: {
          text: `欢迎 ${data.username} 进入聊天室`
        }
      }
    })
  }, [dispatch])

  // 监听其他用户退出聊天室
  const handleUserLeft = useCallback((data: WSMessage) => {
    dispatch({
      type: ActionType.REMOVE_MEMBER,
      payload: {
        userId: data.userId,
        username: data.username,
      }
    })

    // 添加系统消息，提示离开
    dispatch({
      type: ActionType.INSERT_MESSAGE,
      payload: {
        type: MESSAGE_TYPE.SYSTEM_NOTICE,
        // 时间戳确保唯一
        id: Date.now() + '',
        username: '',
        userId: '',
        content: {
          text: `${data.username} 离开聊天室`
        }
      }
    })
  }, [dispatch])

  // 这里注册 socket 事件，响应服务端派发事件
  useEffect(() => {
    const socket = state.socket

    if (!socket) {
      return;
    }

    socket.on(SOCKET_EVENT_TYPE.LOGIN_SERVER, handleLoginServer);
    socket.on(SOCKET_EVENT_TYPE.NEW_MESSAGE, handleNewMessage);
    socket.on(SOCKET_EVENT_TYPE.USER_JOIN, handleUserJoin);
    socket.on(SOCKET_EVENT_TYPE.USER_LEFT, handleUserLeft);
  }, [
    state.socket,
    handleLoginServer,
    handleNewMessage,
    handleUserJoin,
    handleUserLeft,
  ]);

  return <div>123</div>;
};

const Chat: FC = () => {
  const [state, dispatch] = useReducer(chatReducer, initChatState);
  const value = { state, dispatch };

  return (
    <ChatContext.Provider value={value}>
      <ChatContainer></ChatContainer>
    </ChatContext.Provider>
  );
};

export default Chat;
