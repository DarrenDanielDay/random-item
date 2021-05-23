import React from 'react'

export interface ITodoItemProp {
    name: string
}

export const TodoItem: React.FC<ITodoItemProp> = ({name}) => {
  return (<div>
    {name.repeat(2)}
  </div>);
}