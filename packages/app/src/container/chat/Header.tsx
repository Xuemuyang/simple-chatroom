import { FC, Fragment, useEffect, useState } from 'react';
import {
  makeStyles,
  AppBar,
  Toolbar,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
} from '@chatroom/component';
import { useChatStore, ActionType } from './store';
import { useInputValue } from '@chatroom/hooks';
import { SOCKET_EVENT_TYPE } from '@chatroom/helper';
import { CHATROOM_NAME } from '../../assets/config';

const useStyles = makeStyles((theme) => ({
  title: {
    flexGrow: 1,
  },
}));

const Header: FC = () => {
  const { state, dispatch } = useChatStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [username, setUsername, onUsernameChange] = useInputValue('');

  const classes = useStyles();
  const hasLogin = !!state.userId;

  // 只在组件加载的时候执行一次
  useEffect(() => {
    if (!hasLogin) {
      setIsDialogOpen(true);
    }
  }, []);

  const handleLog = () => {
    // 判断是否登录
    if (hasLogin) {
      state.socket?.emit(SOCKET_EVENT_TYPE.LOGOUT);

      // 登录就登出
      dispatch({
        type: ActionType.RESET,
      });
    } else {
      // 这里是弹窗
      setIsDialogOpen(true);
    }
  };

  const handleSubmitUsername = () => {
    // 拿到输入的值
    state.socket?.emit(SOCKET_EVENT_TYPE.LOGIN_CLIENT, username);
    setIsDialogOpen(false);
  };

  return (
    <Fragment>
      <AppBar position="sticky">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            {CHATROOM_NAME}
          </Typography>
          <Button color="inherit" onClick={handleLog}>
            {hasLogin ? 'Logout' : 'Login'}
          </Button>
        </Toolbar>
      </AppBar>

      <Dialog open={isDialogOpen} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">{CHATROOM_NAME}</DialogTitle>
        <DialogContent>
          <DialogContent>欢迎，这里只聊 React</DialogContent>
          <TextField
            value={username}
            onChange={onUsernameChange}
            autoFocus
            margin="dense"
            id="name"
            label="请输入昵称"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSubmitUsername} color="primary">
            确定
          </Button>
          <Button onClick={() => setIsDialogOpen(false)}>取消</Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};

export default Header;
