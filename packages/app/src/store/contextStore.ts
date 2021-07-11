import { createContext } from 'react';

const ContextStore = createContext({
  userState: {},
  userDispatch: () => {},
});

export default ContextStore;
