import React from 'react';

/*Bootstrap components*/
import Button from 'react-bootstrap/Button';

import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';

interface Props {
  title: string;
  itemId: number;
  setEditText(value: string): void;
  setEdit(value: boolean): void;
  saveEditedTodo(value: number): void;
}

const EditFormControl: React.FunctionComponent<Props> = ({
  title,
  itemId,
  setEditText,
  setEdit,
  saveEditedTodo,
}) => {
  return (
    <React.Fragment>
      <FormControl
        placeholder={title}
        aria-label="title"
        aria-describedby="basic-addon1"
        onChange={(event) => setEditText(event.target.value)}
      />
      <InputGroup.Append>
        <Button variant="outline-secondary" onClick={() => setEdit(false)}>
          Cancel
        </Button>
      </InputGroup.Append>
      <InputGroup.Append>
        <Button
          variant="outline-secondary"
          onClick={() => saveEditedTodo(itemId)}
        >
          Save
        </Button>
      </InputGroup.Append>
    </React.Fragment>
  );
};

export default EditFormControl;
