import React, { useState, useEffect } from 'react';

/*Bootstrap components*/
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import ListGroup from 'react-bootstrap/ListGroup';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';

/*Custom cumoponents*/
import FilterDropdown from '../filterDropdown';
import EditFormControl from '../editFormControl';

type Todo = { completed: boolean; id: number; title: string; userId: number };

const TodoList = () => {
  const [initialValues, setInitialValues] = useState<Todo[]>([]);
  const [todos, setTodos] = useState<Todo[]>(initialValues);
  const [filter, setFilter] = useState<string>('All');
  const [edit, setEdit] = useState<number | boolean>(false);
  const [editText, setEditText] = useState<string>('');
  const [newTodoName, setNewTodoName] = useState<string>('');

  useEffect(() => {
    const fetchTodos = async () => {
      let response = await fetch('https://jsonplaceholder.typicode.com/todos');
      let data = await response.json();
      //imitate "results=10" query to backend and set result of fetching to the state
      const todos = data.slice(0, 10);
      setInitialValues(todos);
    };
    fetchTodos();
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
    const todosToChange = JSON.parse(
      JSON.stringify(initialValues)
    ); /*JSON.parse used for deep copy of array*/
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
    const postNewTodo = async () => {
      let response = await fetch('https://jsonplaceholder.typicode.com/todos', {
        method: 'POST',
        body: JSON.stringify(newTodoItem),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      });
      let data = await response.json();
      const todo = data;
      /*this not the best approach below and needs because jsonplacecholder always returns id=201,
      only for demo apps*/
      let cryptoArray = new Uint32Array(1);
      window.crypto.getRandomValues(cryptoArray);
      todo.id = cryptoArray[0];
      const todosToChange = JSON.parse(JSON.stringify(initialValues));
      setInitialValues([...todosToChange, todo]);
      setNewTodoName('');
    };
    postNewTodo();
  };
  return (
    <Container>
      <FilterDropdown filter={filter} setFilter={setFilter} />
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
                id={String(item.id)}
              />
              {edit === item.id ? (
                <EditFormControl
                  title={item.title}
                  itemId={item.id}
                  setEditText={setEditText}
                  setEdit={setEdit}
                  saveEditedTodo={saveEditedTodo}
                />
              ) : (
                <label className="todo-title" htmlFor={String(item.id)}>
                  {item.title}
                </label>
              )}
            </InputGroup>
            {/*hardcoded because jsonplaceholder not returns "due date" for todos list*/}
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
          placeholder="Name for todo"
          aria-label="Name for todo"
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
