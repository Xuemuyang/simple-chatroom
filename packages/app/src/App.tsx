import { FC } from 'react';
import './assets/styles/index.scss';
import { Route } from 'react-router-dom';
import Chat from './container/chat';

const App: FC = () => {
  return (
    <div>
      <Route path="/" component={Chat} />
    </div>
  );
};

export default App;
