import React from 'react';
import './assets/styles/index.scss';
import { Route } from 'react-router-dom';
import Todo from './container/todo';

const App: React.FC = () => {
  return (
    <div>
      <Route path="/" component={Todo} exact />
    </div>
  );
};

export default App;
