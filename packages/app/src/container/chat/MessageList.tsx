import { FC, ReactNode } from 'react';
import { ClientMessage } from './store';
import { Box, useTheme } from '@chatroom/component';
import MessageItem from './MessageItem';
interface Props {
  messages: ClientMessage[];
  children?: ReactNode;
}

const MessageList: FC<Props> = (props) => {
  const { messages = [] } = props;
  const theme = useTheme();

  return (
    <Box
      flexGrow={1}
      overflow="auto"
      p={2}
      bgcolor={theme.palette.background.default}
    >
      {messages.map((message: ClientMessage, index: number) => (
        <div key={message.id}>
          <Box mb={2}>
            <MessageItem data={message} />
          </Box>
        </div>
      ))}
    </Box>
  );
};

export default MessageList;
