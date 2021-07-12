import { useState, useCallback } from 'react';

export const useInputValue = (initialValue: any) => {
  const [value, setValue] = useState(initialValue);
  const onChange = useCallback(function (event) {
    setValue(event.currentTarget.value);
  }, []);

  return [value, setValue, onChange];
};
