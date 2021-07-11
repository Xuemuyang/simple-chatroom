export enum MESSAGE_TYPE {
  TEXT, // 纯文本
  IMAGE, // 纯图片
  SYSTEM_NOTICE, // 纯文本系统消息
}

export interface BaseUser {
  username: string;
  userId: string;
}

export interface BaseMessage {
  type: MESSAGE_TYPE;
  content?: {
    text?: string;
    image?: string;
  };
}

export interface UserMessage {
  id: string;
  username: string,
  userId: string
}

export type Message = BaseMessage & UserMessage
  
export interface NewMessage extends BaseUser {
  id: string;
  message: Message;
}
