// 这个组件内部使用 Hook 实现一个 TODO List
import { useState, useReducer, FC } from 'react';
import './index.scss';
interface todoItem {
  status: boolean;
  content: string;
}

interface payloadIndex {
  index: number;
}

type payload = todoItem | payloadIndex;

interface todoAction {
  type: string;
  payload: payload;
}

type changeFn = (e: React.FormEvent<HTMLInputElement>) => void;

const initTodoState: todoItem[] = [];

const todoReducer = (state: todoItem[], action: todoAction): todoItem[] => {
  const { type, payload } = action;

  const modifyStatus = (state: todoItem[], payload: any, status: boolean) => {
    const { index } = payload;

    const todoIndex = state.findIndex((_, ind) => ind === index);
    const newTodoList = [...state];
    if (~todoIndex) {
      const todoItem = state[todoIndex];

      newTodoList.splice(todoIndex, 1, {
        ...todoItem,
        status,
      });
    }

    return newTodoList;
  };

  switch (type) {
    case 'ADD': {
      return [...state, payload as todoItem];
    }

    case 'DELETE': {
      const { index } = payload as payloadIndex;
      return state.filter((_, i) => i !== index);
    }

    case 'CHANGE': {
      const { index } = payload as payloadIndex;
      const currentStatus = state[index].status;

      return modifyStatus(state, payload, !currentStatus);
    }

    default:
      throw new Error('no payload type');
  }
};

const Todo: FC = () => {
  const [todoList, dispatch] = useReducer(todoReducer, initTodoState);
  const [inputValue, setInputValue] = useState('');

  const handleInputChange: changeFn = (event) => {
    const { currentTarget: { value = '' } = {} } = event;
    setInputValue(value);
  };

  const handleAdd = () => {
    dispatch({
      type: 'ADD',
      payload: {
        status: false,
        content: inputValue,
      },
    });

    setInputValue('');
  };

  return (
    <div>
      <input type="text" value={inputValue} onChange={handleInputChange} />
      <button onClick={handleAdd}>添加任务</button>
      {todoList.map(({ content, status }, index) => {
        return (
          <div
            key={content}
            className={status ? 'todo_done' : ''}
            onClick={() => {
              dispatch({ type: 'CHANGE', payload: { index } });
            }}
          >
            {content}
          </div>
        );
      })}
    </div>
  );
};

export default Todo;
