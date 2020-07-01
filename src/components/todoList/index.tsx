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
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    async function fetchTodos() {
      let response = await fetch('https://jsonplaceholder.typicode.com/todos');
      let data = await response.json();
      //imitate results=10 and set result of fetching to the state
      setTodos(data.slice(0, 10));
    }
    fetchTodos();
  }, []);
  return (
    <Container>
      <DropdownButton
        variant="outline-secondary"
        title="Sort by"
        id="input-group-dropdown-1"
      >
        <Dropdown.Item href="#">All</Dropdown.Item>
        <Dropdown.Item href="#">Completed</Dropdown.Item>
        <Dropdown.Item href="#">Uncompleted</Dropdown.Item>
      </DropdownButton>
      <ListGroup>
        {todos.map((item) => (
          <ListGroup.Item key={item.id}>{item.title}</ListGroup.Item>
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
