import React, { useState, useEffect } from 'react';

/*Bootstrap components*/
import Button from 'react-bootstrap/Button';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import Container from 'react-bootstrap/Container';
import ListGroup from 'react-bootstrap/ListGroup';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';

type Todo = { completed: boolean; id: number; title: string; userId: number };

const TodoList = () => {
  const [initialValues, setInitialValues] = useState<Todo[]>([]);
  const [todos, setTodos] = useState<Todo[]>(initialValues);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    async function fetchTodos() {
      let response = await fetch('https://jsonplaceholder.typicode.com/todos');
      let data = await response.json();
      //imitate results=10 and set result of fetching to the state
      const todos = data.slice(0, 10);
      setInitialValues(todos);
      /*set fetched todos to the local storage*/
      window.localStorage.setItem('todos', JSON.stringify(todos));
    }
    const initialValues = JSON.parse(window.localStorage.getItem('todos')!);
    if (initialValues) {
      setInitialValues(initialValues);
    } else {
      fetchTodos();
    }
  }, []);
  useEffect(() => {
    /*Filtering todos*/
    if (filter === 'All') {
      setTodos(initialValues);
    } else if (filter === 'Completed') {
      setTodos(initialValues.filter((item) => item.completed === true));
    } else {
      setTodos(initialValues.filter((item) => item.completed === false));
    }
  }, [filter, initialValues]);

  /*set complete status of todo*/
  const changetodoStatus = (event: any, id: number) => {
    const foundIndex = initialValues.findIndex((item) => item.id === id);
    const todosToChange = JSON.parse(JSON.stringify(initialValues));
    todosToChange[foundIndex].completed = event.target.checked;
    setInitialValues(todosToChange);
  };
  const deleteTodo = (id: number) => {
    setInitialValues(initialValues.filter((item) => item.id !== id));
  };
  return (
    <Container>
      <DropdownButton
        variant="outline-secondary"
        title={filter}
        id="input-group-dropdown-1"
      >
        <Dropdown.Item href="#" onClick={() => setFilter('All')}>
          All
        </Dropdown.Item>
        <Dropdown.Item href="#" onClick={() => setFilter('Completed')}>
          Completed
        </Dropdown.Item>
        <Dropdown.Item href="#" onClick={() => setFilter('Uncompleted')}>
          Uncompleted
        </Dropdown.Item>
      </DropdownButton>
      <ListGroup>
        {todos.map((item) => (
          <ListGroup.Item
            key={item.id}
            variant={item.completed ? 'success' : 'primary'}
          >
            <InputGroup>
              <InputGroup.Checkbox
                aria-label="todo status checkbox"
                checked={item.completed}
                onChange={(event) => changetodoStatus(event, item.id)}
              />
              <span className="todo-title">{item.title}</span>
            </InputGroup>
            {/*hardcodet because jsonplaceholder not return due date for todos*/}
            <p className="todo-due-date">due date: 11.08.2020</p>
            <Button variant="primary" size="sm">
              Edit
            </Button>{' '}
            <Button
              variant="danger"
              size="sm"
              onClick={() => deleteTodo(item.id)}
            >
              Delete
            </Button>
          </ListGroup.Item>
        ))}
      </ListGroup>
      <InputGroup>
        <FormControl
          placeholder="Name fo todo"
          aria-label="Name fo todo"
          aria-describedby="basic-addon2"
        />
        <InputGroup.Append>
          <Button variant="outline-secondary">Add</Button>
        </InputGroup.Append>
      </InputGroup>
    </Container>
  );
};

export default TodoList;
