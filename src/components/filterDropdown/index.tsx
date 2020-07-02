import React from 'react';

/*Bootstrap components*/

import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';

interface Props {
  setFilter(filter: string): void;
  filter: string;
}

const FilterDropdown: React.FunctionComponent<Props> = ({
  filter,
  setFilter,
}) => {
  return (
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
  );
};

export default FilterDropdown;
