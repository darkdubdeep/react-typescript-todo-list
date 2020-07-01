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
  const [filter, setFilter] = useState<string>('All');
  const [edit, setEdit] = useState<number | boolean>(false);
  const [editText, setEditText] = useState<string>('');
  const [newTodoName, setNewTodoName] = useState<string>('');

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
  const saveEditedTodo = (id: number) => {
    const foundIndex = initialValues.findIndex((item) => item.id === id);
    const todosToChange = JSON.parse(JSON.stringify(initialValues));
    todosToChange[foundIndex].title = editText;
    setInitialValues(todosToChange);
    setEdit(false);
  };
  const deleteTodo = (id: number) => {
    setInitialValues(initialValues.filter((item) => item.id !== id));
  };
  const addTodo = () => {
    const newTodoItem = {
      completed: false,
      title: newTodoName,
      userId: 1,
    };
    async function postNewTodo() {
      let response = await fetch('https://jsonplaceholder.typicode.com/todos', {
        method: 'POST',
        body: JSON.stringify(newTodoItem),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      });
      let data = await response.json();
      //imitate results=10 and set result of fetching to the state
      const todo = data;
      todo.id = Math.random();
      const todosToChange = JSON.parse(JSON.stringify(initialValues));
      setInitialValues([...todosToChange, todo]);
      setNewTodoName('');
    }
    postNewTodo();
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
              {edit === item.id ? (
                <FormControl
                  placeholder={item.title}
                  aria-label="title"
                  aria-describedby="basic-addon1"
                  onChange={(event) => setEditText(event.target.value)}
                />
              ) : (
                <span className="todo-title">{item.title}</span>
              )}
              {edit === item.id && (
                <React.Fragment>
                  <InputGroup.Append>
                    <Button
                      variant="outline-secondary"
                      onClick={() => setEdit(false)}
                    >
                      Cancel
                    </Button>
                  </InputGroup.Append>
                  <InputGroup.Append>
                    <Button
                      variant="outline-secondary"
                      onClick={() => saveEditedTodo(item.id)}
                    >
                      Save
                    </Button>
                  </InputGroup.Append>
                </React.Fragment>
              )}
            </InputGroup>
            {/*hardcodet because jsonplaceholder not return due date for todos*/}
            <p className="todo-due-date">due date: 11.08.2020</p>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setEdit(item.id)}
            >
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
          onChange={(event) => setNewTodoName(event.target.value)}
          value={newTodoName}
        />
        <InputGroup.Append>
          <Button variant="outline-secondary" onClick={addTodo}>
            Add
          </Button>
        </InputGroup.Append>
      </InputGroup>
    </Container>
  );
};

export default TodoList;
