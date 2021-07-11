import { FC } from 'react';
import './assets/styles/index.scss';
import { Route } from 'react-router-dom';
import Todo from './container/todo';
import Chat from './container/chat';

const App: FC = () => {
  return (
    <div>
      <Route path="/" component={Todo} exact />
      <Route path='/chat' component={Chat}></Route>
    </div>
  );
};

export default App;
 