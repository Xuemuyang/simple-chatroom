import { FC } from 'react';
import './assets/styles/index.scss';
import { Route } from 'react-router-dom';
import Chat from './container/chat';
import Todo from './container/todo';

const App: FC = () => {
  return (
    <div>
      <Route path="/" component={Todo} exact />
      <Route path='/chat' component={Chat}></Route>
    </div>
  );
};

export default App;
