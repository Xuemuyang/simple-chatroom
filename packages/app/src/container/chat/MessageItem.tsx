import React from 'react';
import { MESSAGE_TYPE } from '@chatroom/helper';
import { MessageText, MessageSystem } from '@chatroom/component';
import { useChatStore, ClientMessage } from './store';

interface Props {
  data: ClientMessage;
}

// 不同消息 render 方法
const renderStrategy = {
  [MESSAGE_TYPE.TEXT]: {
    render(props: any) {
      return (
        <MessageText {...props.commonProps}>{props.content.text}</MessageText>
      );
    },
  },
  [MESSAGE_TYPE.SYSTEM_NOTICE]: {
    render(props: any) {
      return <MessageSystem message={props.content.text} />;
    },
  },
  [MESSAGE_TYPE.IMAGE]: {
    // TODO 后续支持图片
    render(props: any) {
      return <div>图片</div>
    }
  }
};

export default function ContainerMessageItem(props: Props) {
  const { state } = useChatStore();
  const { type, userId = '', isOwner, ...restProps } = props.data;
  const { avatar = '', username = '' } = state.members[userId] || {};
  const commonProps = { reverse: isOwner, username, avatar }; // 消息组件公共 props

  if (!renderStrategy[type]) {
    return null;
  }

  return renderStrategy[type].render({ ...restProps, commonProps });
}
