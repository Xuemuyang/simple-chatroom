import { FC, Fragment } from 'react';
import { useChatStore, ActionType } from './store';
import {
  Box,
  AppBar,
  Toolbar,
  InputBase,
  makeStyles,
  useTheme,
  Button,
} from '@chatroom/component';
import { useInputValue } from '@chatroom/hooks';
import { SOCKET_EVENT_TYPE, MESSAGE_TYPE, BaseMessage } from '@chatroom/helper';

const useStyles = makeStyles(() => ({
  inputRoot: {
    color: 'inherit',
    lineHeight: 1.5,
  },
}));

const Operation: FC = () => {
  const classes = useStyles();
  const { state, dispatch } = useChatStore();
  const theme = useTheme();
  const [message, setMessage, onMessageChange] = useInputValue('');
  const hasLogin = !!state.userId;

  const handleSend = () => {
    state.socket?.emit(SOCKET_EVENT_TYPE.NEW_MESSAGE, {
      type: MESSAGE_TYPE.TEXT,
      content: {
        text: message,
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
          text: message,
        },
      },
    });

    setMessage('');
  };

  return (
    <Fragment>
      {hasLogin && (
        <Box flexShrink={0}>
          <AppBar position="static" component="footer" elevation={1}>
            <Toolbar>
              <Box flexGrow={1} display="flex" alignItems="flex-end">
                <Box
                  flexGrow={1}
                  px={1}
                  my={1}
                  borderRadius={theme.shape.borderRadius}
                  bgcolor={theme.palette.text.primary}
                >
                  <InputBase
                    value={message}
                    onChange={onMessageChange}
                    maxRows={5}
                    classes={{
                      root: classes.inputRoot,
                    }}
                    inputProps={{ 'aria-label': 'message input' }}
                    fullWidth
                    multiline
                  />
                </Box>
                {message.trim().length !== 0 && (
                  <Box pl={1} my={1}>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={handleSend}
                    >
                      发送
                    </Button>
                  </Box>
                )}
              </Box>
            </Toolbar>
          </AppBar>
        </Box>
      )}
    </Fragment>
  );
};

export default Operation;
