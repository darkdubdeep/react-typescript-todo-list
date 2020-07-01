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
  const [filter, setFilter] = useState('all');
  const [completedTodo, setCompletedTodo] = useState<Number>();

  useEffect(() => {
    async function fetchTodos() {
      let response = await fetch('https://jsonplaceholder.typicode.com/todos');
      let data = await response.json();
      //imitate results=10 and set result of fetching to the state
      const todos = data.slice(0, 10);
      setInitialValues(todos);
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
    if (filter === 'all') {
      setTodos(initialValues);
    } else if (filter === 'completed') {
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
  return (
    <Container>
      <DropdownButton
        variant="outline-secondary"
        title="Show"
        id="input-group-dropdown-1"
      >
        <Dropdown.Item href="#" onClick={() => setFilter('all')}>
          All
        </Dropdown.Item>
        <Dropdown.Item href="#" onClick={() => setFilter('completed')}>
          Completed
        </Dropdown.Item>
        <Dropdown.Item href="#" onClick={() => setFilter('uncompleted')}>
          Uncompleted
        </Dropdown.Item>
      </DropdownButton>
      <ListGroup>
        {todos.map((item) => (
          <ListGroup.Item key={item.id}>
            <InputGroup.Checkbox
              aria-label="todo status checkbox"
              checked={item.completed}
              onChange={(event) => changetodoStatus(event, item.id)}
            />
            {item.title}
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
