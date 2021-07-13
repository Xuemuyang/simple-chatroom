import { WSMessage, BaseUser } from '@chatroom/helper';
import { createContext, useContext } from 'react';
import { Socket } from 'socket.io-client';

export interface ClientMessage extends WSMessage {
  isOwner?: boolean;
}

export interface Member {
  userId: string;
  username: string;
  avatar?: string;
}

export interface ChatState extends Member {
  messages: ClientMessage[];
  socket: Socket | null;
  members: {
    [propName: string]: Member;
  };
}

export const initChatState: ChatState = {
  messages: [],
  members: {},
  socket: null,
  userId: '',
  username: '',
};

// 都会有哪些操作
export enum ActionType {
  // 收到新消息
  INSERT_MESSAGE,
  // 创建连接
  INSERT_SOCKET,
  // 加入 member
  INSERT_MEMBER,
  // 移除 member
  REMOVE_MEMBER,
  // 更新当前 user 信息
  UPDATE_USER,
  // 重置应用
  RESET,
}

interface InsertMessage {
  type: ActionType.INSERT_MESSAGE;
  payload: ClientMessage;
}

interface InsertSocket {
  type: ActionType.INSERT_SOCKET;
  payload: Socket;
}

interface InsertMember {
  type: ActionType.INSERT_MEMBER;
  payload: Member;
}

interface RemoveMember {
  type: ActionType.REMOVE_MEMBER;
  payload: Member;
}

interface UpdateUser {
  type: ActionType.UPDATE_USER;
  payload: BaseUser;
}

interface Reset {
  type: ActionType.RESET;
}

export type Action =
  | InsertMessage
  | InsertSocket
  | InsertMember
  | RemoveMember
  | UpdateUser
  | Reset;

export const chatReducer = (
  state: ChatState = initChatState,
  action: any,
): ChatState => {
  const { type, payload } = action;

  switch (type) {
    case ActionType.INSERT_MESSAGE: {
      return {
        ...state,
        messages: [...state.messages, payload as ClientMessage],
      };
    }
    case ActionType.INSERT_SOCKET: {
      return { ...state, socket: payload };
    }
    case ActionType.INSERT_MEMBER: {
      return {
        ...state,
        members: { ...state.members, [payload.userId]: payload },
      };
    }
    case ActionType.REMOVE_MEMBER: {
      const finalMembers = { ...state.members };
      delete finalMembers[payload.userId];
      return { ...state, members: finalMembers };
    }
    case ActionType.UPDATE_USER: {
      return { ...state, ...payload };
    }
    case ActionType.RESET: {
      return { ...initChatState, socket: state.socket };
    }
    default:
      throw new Error();
  }
};

export const ChatContext = createContext<{
  state: typeof initChatState;
  dispatch: (action: Action) => void;
}>({ state: initChatState, dispatch: () => {} });

export const useChatStore = () => useContext(ChatContext);
