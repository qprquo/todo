import React, { useState, useMemo } from 'react';
import Header from './header';
import Item from './item';
import { TTodoItem } from '../../types/common';
import Footer from './footer';

const FILTERS = ['All', 'Active', 'Completed'];

const TodoList = () => {
  const [items, setItems] = useState<TTodoItem[]>([{
    completed: false,
    editing: false,
    title: 'Pay electric bill'
  }, {
    completed: false,
    editing: false,
    title: 'Walk the dog'
  }]);
  const [value, setValue] = useState('');
  const [currentFilter, setCurrentFilter] = useState('All');

  const filtered = useMemo(
    () => items.filter((item) => currentFilter === 'All'
      ? item
      : currentFilter === 'Active'
        ? !item.completed
        : item.completed),
    [items, currentFilter]
  );

  const left = useMemo(
    () => items.reduce((acc, curr) => !curr.completed ? ++acc : acc, 0),
    [items]
  );

  const hasCompleted = useMemo(
    () => items.some((item) => item.completed),
    [items]
  );

  const onToggle = (idx: number) => {
    setItems(items.map((item, i) => i === idx
      ? { ...item, completed: !item.completed }
      : item
    ));
  };

  const onDestroy = (idx: number) => {
    setItems(items.filter((_, i) => i != idx));
  };

  const onFilterChange = (name: string) => {
    setCurrentFilter(name);
  };

  const onClearClick = () => {
    setItems(items.filter((item) => !item.completed));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.code === 'Enter' || e.code == 'NumpadEnter') {
      setItems([...items, { completed: false, editing: false, title: value }]);
      setValue('');
    }
  };

  const onItemDoubleClick = (idx: number) => () => {
    setItems(items.map((item, i) => i === idx
      ? { ...item, editing: true }
      : item
    ));
  };

  const onItemChange = (idx: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setItems(items.map((item, i) => i === idx
      ? { ...item, title: e.target.value }
      : item
    ));
  };

  const onItemBlur = () => {
    setItems(items.map((item) => ({
      ...item, editing: false
    })));
  };

  const toggleAll = () => {
    setItems(items.map((item) => ({ ...item, completed: !item.completed })));
  };

  return (
    <section className="todoapp">
      <div>
        <Header
          value={value}
          handleChange={handleChange}
          handleKeyDown={handleKeyDown}
        />
        <section className="main">
          <input
            id="toggle-all"
            type="checkbox"
            className="toggle-all"
            onChange={toggleAll}
          />
          <label htmlFor="toggle-all" />
          <ul className="todo-list">
            {
              filtered.map((item, idx) => (
                <Item
                  key={idx}
                  item={item}
                  onBlur={onItemBlur}
                  onChange={onItemChange(idx)}
                  onDoubleClick={onItemDoubleClick(idx)}
                  onDestroy={() => onDestroy(idx)}
                  onToggle={() => onToggle(idx)}
                />
              ))
            }
          </ul>
        </section>
        <Footer
          left={left}
          filters={FILTERS}
          onClearClick={onClearClick}
          currentFilter={currentFilter}
          onFilterChange={onFilterChange}
          hasCompleted={hasCompleted}
        />
      </div>
    </section>
  );
};

export default TodoList;
