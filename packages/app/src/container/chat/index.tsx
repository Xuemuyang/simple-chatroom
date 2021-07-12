import { FC, useCallback, useEffect, useReducer } from 'react';
import {
  ChatContext,
  useChatStore,
  ActionType,
  chatReducer,
  initChatState,
  Member,
  ClientMessage,
} from './store';
import io, { Socket } from 'socket.io-client';
import {
  SERVER_URL,
  WSMessage,
  SOCKET_EVENT_TYPE,
  MESSAGE_TYPE,
  BaseMessage,
} from '@chatroom/helper';
import { useInputValue } from '@chatroom/hooks';

// 首先是登录的逻辑
const ChatContainer: FC = () => {
  const { state, dispatch } = useChatStore();

  // 建立 socket.io 连接
  useEffect(() => {
    const socketInstance: Socket = io(SERVER_URL, {
      withCredentials: true,
    });
    dispatch({
      type: ActionType.INSERT_SOCKET,
      payload: socketInstance,
    });

    return () => {
      socketInstance.close();
      dispatch({ type: ActionType.RESET });
    };
  }, [dispatch]);

  // 当前用户完成登录
  const handleLoginServer = useCallback(
    (data: WSMessage) => {
      const user: Member = {
        username: data.username,
        userId: data.userId,
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
  const handleNewMessage = useCallback(
    (data: WSMessage) => {
      dispatch({
        type: ActionType.INSERT_MESSAGE,
        payload: {
          ...data,
          isOwner: false,
        },
      });
    },
    [dispatch],
  );

  // 监听其他用户加入聊天室
  const handleUserJoin = useCallback(
    (data: WSMessage) => {
      dispatch({
        type: ActionType.INSERT_MEMBER,
        payload: {
          userId: data.userId,
          username: data.username,
        },
      });

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
            text: `欢迎 ${data.username} 进入聊天室`,
          },
        },
      });
    },
    [dispatch],
  );

  // 监听其他用户退出聊天室
  const handleUserLeft = useCallback(
    (data: WSMessage) => {
      dispatch({
        type: ActionType.REMOVE_MEMBER,
        payload: {
          userId: data.userId,
          username: data.username,
        },
      });

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
            text: `${data.username} 离开聊天室`,
          },
        },
      });
    },
    [dispatch],
  );

  // 这里注册 socket 事件，响应服务端派发事件
  useEffect(() => {
    const socket = state.socket;

    if (!socket) {
      return;
    }
    // 这里防止事件重复注册
    socket.offAny();

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

  const [username, setUsername, onUsernameChange] = useInputValue('');
  const [content, setContent, onContentChange] = useInputValue('');
  const handleSubmitUsername = () => {
    // 拿到输入的值
    state.socket?.emit(SOCKET_EVENT_TYPE.LOGIN_CLIENT, username);
  };

  const handleSendMessage = () => {
    state.socket?.emit(SOCKET_EVENT_TYPE.NEW_MESSAGE, {
      type: MESSAGE_TYPE.TEXT,
      content: {
        text: content,
      },
    } as BaseMessage);

    // 本地将消息插入
    dispatch({
      type: ActionType.INSERT_MESSAGE,
      payload: {
        isOwner: true,
        userId: state.userId,
        username: state.username,
        type: MESSAGE_TYPE.TEXT,
        id: Date.now() + '',
        content: {
          text: content,
        },
      },
    });

    setContent('');
  };

  // 首先一个输入框，输入昵称，当昵称输入完成进入房间
  return (
    <div>
      {/* 输入昵称 */}
      {!state.userId ? (
        <div>
          <div>欢迎加入聊天室，输入昵称</div>
          <input type="text" value={username} onChange={onUsernameChange} />
          <button onClick={handleSubmitUsername}>提交</button>
        </div>
      ) : (
        <div>
          <div>聊天界面</div>
          <input type="text" value={content} onChange={onContentChange} />
          <button onClick={handleSendMessage}>发送</button>
          {state.messages.map((message: ClientMessage) => {
            if (message.type === MESSAGE_TYPE.TEXT) {
              return (
                <div key={message.id}>
                  <div>
                    {message.username}: {message.content?.text}
                  </div>
                </div>
              );
            } else if (message.type === MESSAGE_TYPE.SYSTEM_NOTICE) {
              return (
                <div key={message.id}>系统消息: {message.content?.text}</div>
              );
            }
          })}
        </div>
      )}
    </div>
  );
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
